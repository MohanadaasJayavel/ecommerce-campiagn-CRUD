const express = require('express');
const { createUser, getUserById, updateUser, deleteUser, getUsers } = require('../controller/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createUser);
router.get('/getall', authenticateJWT, getUsers);
router.get('/:id', authenticateJWT, getUserById);
router.put('/:id', authenticateJWT, updateUser);
router.delete('/:id', authenticateJWT, deleteUser);

module.exports = router;
