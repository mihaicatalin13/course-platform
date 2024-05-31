const express = require('express');

const { Category } = require('../models/associations');
const authenticateToken = require('../middleware/auth/authenticateToken');
const authRole = require('../middleware/auth/authRole');
const { ROLE } = require('../auth/params/roles');
const validateId = require('../middleware/validations/validateId');
const e = require('express');

const router = express.Router()
router.use(express.json())

router.get('/', authenticateToken, async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name']
        });

        res.json(categories);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})

router.post('/create', authenticateToken, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const category = await Category.create({
            name: req.body.name
        });

        res.json({
            message: 'Category created'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})

router.put('/update/:id', validateId, authenticateToken, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                error: 'Category not found'
            });
        }

        category.name = req.body.name;
        await category.save();

        res.json({
            message: 'Category updated'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})

router.delete('/delete/:id', validateId, authenticateToken, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                error: 'Category not found'
            });
        }

        await category.destroy();

        res.json({
            message: 'Category deleted'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})


module.exports = router