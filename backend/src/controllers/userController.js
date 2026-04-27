const User = require('../models/User');

// @desc    Get all users (admin only)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a user's role (admin only)
// @route   PATCH /api/users/:id
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ['user', 'admin'];

        if (!role || !allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: `Role is required and must be one of: ${allowedRoles.join(', ')}`,
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = [role];
        await user.save();

        res.status(200).json({ success: true, data: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a user (admin only)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
