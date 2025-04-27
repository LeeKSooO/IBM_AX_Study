// route 
// URL 요청 경로 처리

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require('../middleware/auth');


// register user(sign up)
router.post('/', userController.createUser);

// log-in
router.post('/login', userController.login);

// log-out
router.delete('/logout', userController.logout);

// change password
router.patch('/me/password', auth, userController.changePW);

// select own Info
router.get('/me', auth, userController.getMyInfo);

// update user info
router.patch('/me', auth, userController.updateMyInfo);

// withdraw
router.delete('/withdraw', auth, userController.withdraw);

module.exports = router;