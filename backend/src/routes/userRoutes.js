const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware');
const {
    getAllUsers,
    updateUserRole,
    deleteUser,
} = require('../controllers/userController');

router.get('/', verifyAdmin, getAllUsers);
router.patch('/:id', verifyAdmin, updateUserRole);
router.delete('/:id', verifyAdmin, deleteUser);

module.exports = router;
