const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
// authMiddleware.isAdmin,
router.post('/',  userController.createUser);
router.put('/:id', authMiddleware.isAdmin, userController.editUser);

module.exports = router;
