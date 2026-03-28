const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) return res.status(403).json({ error: 'No token provided' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded // includes id and role from authController.generateToken
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' })
        }
        next()
    })
}

const verifyRole = (...allowedRoles) => (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient role privileges' })
        }
        next()
    })
}

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyRole,
}
