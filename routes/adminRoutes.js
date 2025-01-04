const express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { addCategoryController, deleteCarById } = require('../controllers/carController')
const { getPendingCars, updateCarStatus, getAllUsers, deleteUser, blockUser } = require('../controllers/adminController')
const router = express.Router()

// JOB CATEGORY || POST
router.post('/add-category/',adminMiddleware, addCategoryController)


// get Pending Cars || GET
router.get('/pending-cars/',adminMiddleware, getPendingCars)

// update car status || PUT
router.put('/update-car-status/:id/',adminMiddleware, updateCarStatus)

// delete car by id 
router.delete('/delete-car/:id',adminMiddleware,deleteCarById)

// get all users 
router.get('/get-all-users/',adminMiddleware,getAllUsers)

// delete user 
router.delete("/delete-user/:id",adminMiddleware,deleteUser)

// block user 
router.patch("/block/:id",adminMiddleware,blockUser)


module.exports = router

