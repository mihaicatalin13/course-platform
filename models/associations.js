const User = require('./User');
const Teacher = require('./Teacher');
const Course = require('./Course');
const Category = require('./Category');
const Chapter = require('./Chapter');
const UserCourses = require('./UserCourses');
const TeacherApplicationDocument = require('./TeacherApplicationDocument');

User.hasOne(Teacher);
Teacher.belongsTo(User);

Course.belongsToMany(User, { through: UserCourses });
User.belongsToMany(Course, { through: UserCourses });

Category.hasMany(Course);
Course.Category = Course.belongsTo(Category);

Course.hasMany(Chapter);
Chapter.belongsTo(Course);

User.hasOne(TeacherApplicationDocument);
TeacherApplicationDocument.belongsTo(User);

Teacher.Courses = Teacher.hasMany(Course);
Course.Teacher = Course.belongsTo(Teacher);

module.exports = { User, Course, Category, Teacher, TeacherApplicationDocument, Chapter, UserCourses };