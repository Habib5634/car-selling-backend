const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware')
const { addCarController, getAcceptedCars, getCarById, getAllCategoriesController, getCategoryByIdController, getLatestAcceptedCars, deleteCarById, updateCarDetailsById, getProductsByCategoryController } = require('../controllers/carController')
const { sendMessageController, getMessagesController, getConversationController, markMessagesAsReadController, deleteMessageController, deleteConversationController } = require('../controllers/chatController')
const router = express.Router()

// POST || Post car for selling
router.post('/post-car/',authMiddleware,addCarController)

//get all categories
router.get('/categories',getAllCategoriesController)

// get All Accepted Cars
router.get('/get-all-cars/',getAcceptedCars)

//get CAtegory by id
router.get('/category/:id',getCategoryByIdController)
//get single car detail
router.get('/get-single-car/:id',getCarById)

// get latest cars 
router.get('/latest-cars',getLatestAcceptedCars)

// delete car by id 
router.delete('/delete-car/:id',authMiddleware,deleteCarById)

// update car detail by car id
router.patch('/update-car/:id',authMiddleware,updateCarDetailsById)

// get category Cars
router.get("/category-products/:categoryId",getProductsByCategoryController)

// send message 
router.post('/send/',authMiddleware,sendMessageController)

//get user conversation
router.get("/conversation/",authMiddleware,getConversationController)

// get messages
router.get("/get-messages/:conversationId",authMiddleware,getMessagesController)

// marked as read unread messages
router.patch("/marked-as-read/:conversationId",authMiddleware,markMessagesAsReadController)

// delete single message
router.delete("/delete-message/:messageId",authMiddleware,deleteMessageController)

// delete conversation controller
router.delete("/delete-conversation/:conversationId",authMiddleware,deleteConversationController)



module.exports = router

