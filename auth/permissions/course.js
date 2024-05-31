const { ROLE } = require('../params/roles');

function canViewCourse(user, course) {
    return (
        user.role === ROLE.ADMIN ||
        course.userId === user.id
    )
}