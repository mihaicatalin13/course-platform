const express = require('express');

const { TeacherApplicationDocument } = require('../models/associations');
const authenticateToken = require('../middleware/auth/authenticateToken');
const authRole = require('../middleware/auth/authRole');
const { ROLE } = require('../auth/params/roles');
const upload = require('../config/multer/multer');

const router = express.Router()
router.use(express.json())

router.post('/upload-teacher-document', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        // check if user already uploaded a document
        const document = await TeacherApplicationDocument.findOne({ where: { userId: req.user.sub } });

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (document) {
            return res.status(400).json({ error: 'Document already uploaded' });
        }

        await TeacherApplicationDocument.create({
            filename: req.file.filename,
            filepath: req.file.path,
            status: 'PENDING',
            userId: req.user.sub 
        });
        res.status(201).json({ message: 'File uploaded' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router