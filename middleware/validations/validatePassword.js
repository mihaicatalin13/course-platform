function validatePassword(req, res, next) {
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    // Regular expression for password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    // Check if password is valid
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Invalid password format. Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character.' });
    }

    next();
}

module.exports = validatePassword;