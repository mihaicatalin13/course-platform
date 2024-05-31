const express = require('express');

const { Chapter, UserCourses, Teacher, Course, User } = require('../models/associations');
const authenticateToken = require('../middleware/auth/authenticateToken');
const authRole = require('../middleware/auth/authRole');
const { ROLE } = require('../auth/params/roles');
const validateId = require('../middleware/validations/validateId');

const router = express.Router()
router.use(express.json())

router.get('/', authenticateToken, async (req, res) => {
    try {
        const courseId = req.query.courseId;

        const userCourse = await UserCourses.findOne({
            where: {
                userId: req.user.sub,
                courseId: courseId
            }
        });

        if (!userCourse) {
            return res.status(400).json({ error: 'You are not enrolled in this course' });
        }

        const chapters = await Chapter.findAll({
            attributes: ['id', 'title', 'content'],
            where: {
                courseId: courseId
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: Course,
                    attributes: ['id', 'title']
                }
            ]
        });

        res.json(chapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/create', authenticateToken, authRole(ROLE.TEACHER), async (req, res) => {
    try {
        const course = await Course.findByPk(req.body.courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const teacher = await Teacher.findOne({ where: { userId: req.user.sub } });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (course.teacherId !== teacher.id) {
            return res.status(403).json({ error: 'You are not the teacher of this course' });
        }

        const chapter = await Chapter.create({
            title: req.body.title,
            content: req.body.content,
            courseId: course.id
        });

        await chapter.save();

        res.json({ message: 'Chapter created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/update/:id', validateId, authenticateToken, authRole(ROLE.TEACHER), async (req, res) => {
    try {
        const chapter = await Chapter.findByPk(req.params.id);

        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        const course = await Course.findByPk(chapter.courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const teacher = await Teacher.findOne({ where: { userId: req.user.sub } });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (course.teacherId !== teacher.id) {
            return res.status(403).json({ error: 'You are not the teacher of this course' });
        }

        chapter.title = req.body.title;
        chapter.content = req.body.content;
        await chapter.save();

        res.json({ message: 'Chapter updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete('/delete/:id', validateId, authenticateToken, authRole(ROLE.TEACHER), async (req, res) => {
    try {
        const chapter = await Chapter.findByPk(req.params.id);

        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        const course = await Course.findByPk(chapter.courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const teacher = await Teacher.findOne({ where: { userId: req.user.sub } });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        if (course.teacherId !== teacher.id) {
            return res.status(403).json({ error: 'You are not the teacher of this course' });
        }

        await chapter.destroy();

        res.json({ message: 'Chapter deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;