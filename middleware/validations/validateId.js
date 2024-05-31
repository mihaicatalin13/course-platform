function validateId(req, res, next) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: 'ID parameter is required' });
    }

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID parameter must be a number' });
    }

    if (parseInt(id) <= 0) {
        return res.status(400).json({ error: 'ID parameter must be a positive number' });
    }

    next();
}

module.exports = validateId;