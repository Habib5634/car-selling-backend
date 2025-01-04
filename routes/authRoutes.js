const express = require('express')
const { registerController, loginController, getUserController, updateUserController, updatePasswordController, resetPasswordController } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router()
// routes

// REGISTER || POST
router.post('/register/',registerController)

// LOGIN || POST
router.post("/login", loginController);

// GET USER
router.get('/user',authMiddleware,getUserController)

// Update USER
router.put('/update',authMiddleware,updateUserController)

//password update
router.post("/updatePassword", authMiddleware, updatePasswordController);

// RESET PASSWORD
router.post("/resetPassword",  resetPasswordController);




module.exports = router