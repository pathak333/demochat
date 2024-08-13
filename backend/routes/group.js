const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.isAuthenticated, groupController.createGroup);
router.get('/',authMiddleware.isAuthenticated,groupController.groups)
router.delete('/:id', authMiddleware.isAuthenticated, groupController.deleteGroup);
router.post('/add-member', authMiddleware.isAuthenticated, groupController.addMember);
router.post('/send-message', authMiddleware.isAuthenticated, groupController.sendMessage);
router.post('/like-message', authMiddleware.isAuthenticated, groupController.likeMessage);
router.get("/:groupId/messages",authMiddleware.isAuthenticated, groupController.getmessage)
module.exports = router;
