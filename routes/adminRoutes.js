const express = require('express');
const sequelize = require('../config/db/sequelize');

const authenticateToken = require('../middleware/auth/authenticateToken');
const authRole = require('../middleware/auth/authRole');
const { ROLE } = require('../auth/params/roles');
const { User, Teacher, TeacherApplicationDocument } = require('../models/associations')

const router = express.Router()
router.use(express.json())

router.post('/grant-role', authenticateToken, authRole(ROLE.ADMIN), async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user == null) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        if (req.body.role != user.role) {
            if (req.body.role == ROLE.TEACHER) {
                await Teacher.create({ userId: user.id });
            } else {
                const teacher = await Teacher.findOne({ where: { userId: user.id } });
                if (teacher != null) {
                    await teacher.destroy();
                }
            }
            await user.update({ role: req.body.role });
        }

        res.status(200).json({ message: 'Role granted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post('/verify-teacher', authenticateToken, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const result = await sequelize.transaction(async t => {
            const document = await TeacherApplicationDocument.findOne({ where: { userId: req.body.userId } });

            if (document == null) {
                return res.status(404).json({ message: 'Document not found' });
            }

            if (document.status != 'PENDING') {
                return res.status(400).json({ message: 'Document was already processed' });
            }

            await document.update(
                { 
                    status: req.body.status 
                },
                { transaction: t }
            );
            await document.save();

            if (req.body.status == 'APPROVED') {
                const user = await User.findOne({ where: { id: req.body.userId } });
                if (user == null) {
                    return res.status(404).json({ message: 'User not found' });
                }
                
                await user.update(
                    {
                        role: ROLE.TEACHER
                    },
                    {
                        transaction: t
                    }
                );

                await Teacher.create(
                    { userId: req.body.userId },
                    { transaction: t }
                );
                res.status(200).json({ message: 'Teacher application approved' });
            }
            else {
                res.status(200).json({ message: 'Teacher application rejected' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router