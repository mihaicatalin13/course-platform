const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = require('../auth/lib/generateAccessToken');
const { User } = require('../models/associations');
const { ROLE } = require('../auth/params/roles');
const { Op } = require('sequelize');
const validateEmail = require('../middleware/validations/validateEmail');
const validatePassword = require('../middleware/validations/validatePassword.js');

const router = express.Router()

router.use(express.json())

router.post('/register',  validateEmail, /* validatePassword, */ async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: ROLE.STUDENT
        }
        await User.create(user);
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (user == null) {
        return res.status(401).json({ message: 'Incorrect username or password' });
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const userId = user.id;
            const userClaims = { sub: userId, role: user.role };

            const accessToken = generateAccessToken(userClaims)
            const refreshToken = jwt.sign(userClaims, process.env.REFRESH_TOKEN_SECRET)

            await user.update({ refreshToken: refreshToken });

            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        }
        else {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)

    const user = await User.findOne(
    { 
        where: 
        {
            refreshToken: {
                [Op.eq]: refreshToken
            }
        }
    });

    if (user == null) {
        return res.status(403).json({ message: 'Refresh token not valid' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ sub: user.sub, role: user.role });
        return res.json({ accessToken: accessToken });
    });
})

router.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;

    console.log(refreshToken)

    const user = await User.findOne({ where: { refreshToken: refreshToken } });

    if (user == null) {
        return res.sendStatus(403);
    }

    await user.update({ refreshToken: null });

    res.json({ message: 'User logged out' });
})

module.exports = router