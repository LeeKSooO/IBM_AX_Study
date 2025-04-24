// route 
// URL 요청 경로 처리

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require('../middleware/auth');


// register user
router.post('/', userController.createUser);
// log-in
router.post('/login', userController.login);
// log-out

// change password

// withdraw

// select *(users)
router.get('/', userController.getUsers);

// select user

// update user
router.put('/:id', userController.updateUser);
// delete user
router.delete('/:username', userController.deleteUser);


module.exports = router;