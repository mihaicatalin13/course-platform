const express = require('express');

const { Course, Teacher, Category, User, UserCourses } = require('../models/associations');
const authenticateToken = require('../middleware/auth/authenticateToken');
const authRole = require('../middleware/auth/authRole');
const validateId = require('../middleware/validations/validateId');
const { ROLE } = require('../auth/params/roles');
const { Op } = require('sequelize');

const router = express.Router()
router.use(express.json())

router.get('/', authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE_INDEX);
    const limit = parseInt(req.query.limit) || parseInt(process.env.DEFAULT_PAGE_SIZE);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const sortBy = req.query.sortBy || process.env.DEFAULT_SORT_BY;
    const sortOrder = req.query.sortOrder || process.env.DEFAULT_SORT_ORDER;
    const titleFilter = req.query.title;
    const descriptionFilter = req.query.description;
    const prerequisitesFilter = req.query.prerequisites;

    try {
        const whereClause = {};

        if (titleFilter) {
            whereClause.title = {
                [Op.like]: `%${titleFilter}%`
            };
        }

        if (descriptionFilter) {
            whereClause.description = {
                [Op.like]: `%${descriptionFilter}%`
            };
        }

        if (prerequisitesFilter) {
            whereClause.prerequisites = {
                [Op.like]: `%${prerequisitesFilter}%`
            };
        }

        const courses = await Course.findAll({
            where: whereClause,
            order: [[sortBy, sortOrder]],
            attributes: ['id', 'title', 'description', 'estimatedTime', 'prerequisites'],
            include: [
                {
                    model: Teacher,
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            attributes: ['username', 'email']
                        }
                    ]
                },
                {
                    model: Category,
                    attributes: ['name']
                }
            ]
        });

        res.json({
            page: page,
            limit: limit,
            totalCourses: courses.length,
            courses: courses.slice(startIndex, endIndex)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/enroll/:id', authenticateToken, validateId, async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const user = await User.findOne({ where: { id: req.user.sub } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userCourse = await UserCourses.findOne({
            where: {
                userId: user.id,
                courseId: course.id
            }
        });

        if (userCourse) {
            return res.status(400).json({ error: 'Already enrolled in course' });
        }

        await UserCourses.create({
            userId: user.id,
            courseId: course.id
        });

        res.json({ message: 'Enrolled in course' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/create', authenticateToken, authRole(ROLE.TEACHER), async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ where: { userId: req.user.sub } });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const category = await Category.findByPk(req.body.categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const course = {
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            prerequisites: req.body.prerequisites,
            teacherId: teacher.id,
            categoryId: req.body.categoryId
        }

        console.log(course)

        await Course.create(course);
        res.status(201).json({ message: 'Course created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/update/:id', validateId, authenticateToken, authRole(ROLE.TEACHER), async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const teacher = await Teacher.findOne({ where: { userId: req.user.sub } });

        if (course.teacherId !== teacher.id) {
            return res.status(403).json({ error: 'You are not allowed to update this course' });
        }

        const category = await Category.findByPk(req.body.categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        course.title = req.body.title;
        course.description = req.body.description;
        course.estimatedTime = req.body.estimatedTime;
        course.prerequisites = req.body.prerequisites;
        course.categoryId = req.body.categoryId;

        await course.save();
        res.json({ message: 'Course updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete('/delete/:id', validateId, authenticateToken, authRole(ROLE.TEACHER), async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const teacher = await Teacher.findOne({ where: { userId: req.user.sub } });

        if (course.teacherId !== teacher.id) {
            return res.status(403).json({ error: 'You are not allowed to delete this course' });
        }

        await course.destroy();
        res.json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router