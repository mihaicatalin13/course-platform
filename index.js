require('dotenv').config()

const express = require('express')
const sequelize = require('./config/db/sequelize')
const jwt = require('jsonwebtoken')

const authRoutes = require('./routes/authRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const courseRoutes = require('./routes/courseRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const chapterRoutes = require('./routes/chapterRoutes')
const adminRoutes = require('./routes/adminRoutes')

const authenticateToken = require('./middleware/auth/authenticateToken')
const { ROLE } = require('./auth/params/roles');
const authRole = require('./middleware/auth/authRole')

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error)
    })

const app = express()
app.use(express.json())

app.use('/', authRoutes)
app.use('/', teacherRoutes)
app.use('/courses', courseRoutes)
app.use('/categories', categoryRoutes)
app.use('/chapters', chapterRoutes)
app.use('/', adminRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const posts = [
    {
        username: 'mihai',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }
]

app.get('/posts', authenticateToken, authRole(ROLE.ADMIN), (req, res) => {
    res.json(posts.filter(post => post.username === req.user.username))
})

app.listen(5000, () => {
    console.log('server running http://localhost:5000')
})