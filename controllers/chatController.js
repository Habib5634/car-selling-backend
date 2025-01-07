const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel")


// Controller to Send a Message
const sendMessageController = async (req, res) => {
    try {
      const { receiverId, message } = req.body;
      const senderId = req.user._id;
  
      // Check if a conversation already exists between the sender and receiver
      let conversation = await conversationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });
  
      // If no conversation exists, create a new one
      if (!conversation) {
        conversation = new conversationModel({
          participants: [senderId, receiverId],
        });
  
        // Save the new conversation to the database
        await conversation.save();
      }
  
      // Create a new message
      const newMessage = new messageModel({
        senderId,
        receiverId,
        message,
      });
  
      // Save the message to the database
      const savedMessage = await newMessage.save();
  
      // Add the message reference to the conversation's messages array
      conversation.messages.push(savedMessage._id);
      const savedConversation = await conversation.save();
  
      // Emit the new message to the receiver using WebSocket (if connected)
    //   if (receiverId) {
    //     io.to(receiverId).emit('newMessage', {
    //       conversationId: conversation._id,
    //       message: savedMessage,
    //     });
    //   }
  
      res.status(201).json({
        message: "Message sent successfully",
        data: savedMessage,
        savedConversation
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Error sending message", error });
    }
  };

  // Get All Conversations for the Logged-In User
  const getConversationController = async (req, res) => {
    try {
        const userId = req.user._id; // Get the logged-in user's ID from middleware
  
        // Find all conversations where the logged-in user is a participant
        const conversations = await conversationModel.find({
            participants: userId,
        })
            .populate("participants", "firstName lastName bloodGroup profile email") // Populate participants' basic info
            .populate("messages"); // Populate messages if necessary
  
        if (!conversations || conversations.length === 0) {
            return res.status(404).json({ message: "No conversations found" });
        }
  
        res.status(200).json({ conversations });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving conversations", error });
        console.error(error);
    }
  };
  
  
  // Controller to Get Messages for a Conversation
// const getMessagesController = async (req, res) => {
//     try {
//         const { conversationId } = req.params;
  
//         // Find the conversation by ID and populate messages
//         const conversation = await conversationModel.findById(conversationId)
//             .populate({
//                 path: "messages",
//                 populate: {
//                     path: "senderId receiverId",
//                     select: "firstName lastName profile email"
//                 }
//             });
  
//         if (!conversation) {
//             return res.status(404).json({ message: "Conversation not found" });
//         }
  
//         res.status(200).json({
//             conversationId,
//             messages: conversation.messages
//         });
//     } catch (error) {
//         console.error("Error retrieving messages:", error);
//         res.status(500).json({ message: "Error retrieving messages", error });
//     }
//   };

  const getMessagesController = async (req, res) => {
    try {
      const { conversationId } = req.params;
  
      // Find the conversation by ID and populate participants and messages
      const conversation = await conversationModel.findById(conversationId)
        .populate({
          path: "participants",
          select: "firstName lastName profile email",
        })
        .populate({
          path: "messages",
          select: "message isRead createdAt",
        });
  
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
  
      // Prepare a response that separates participants and messages
      res.status(200).json({
        conversationId,
        participants: conversation.participants, // Participant details
        messages: conversation.messages, // List of messages without repeated participant info
      });
    } catch (error) {
      console.error("Error retrieving messages:", error);
      res.status(500).json({ message: "Error retrieving messages", error });
    }
  };
  

//   controller for marked as read unread messages
  const markMessagesAsReadController = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;
  
      // Update all unread messages in the conversation where the user is the receiver
      const result = await messageModel.updateMany(
        { receiverId: userId, isRead: false },
        { $set: { isRead: true } }
      );
  
      res.status(200).json({
        success: true,
        message: "Messages marked as read successfully",
        updatedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ success: false, message: "Error marking messages as read", error });
    }
  };


//   controller for delete single message 
const deleteMessageController = async (req, res) => {
    try {
      const { messageId } = req.params;
  
      // Find and delete the message
      const deletedMessage = await messageModel.findByIdAndDelete(messageId);
  
      if (!deletedMessage) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }
  
      // Optionally, remove the message reference from the conversation
      await conversationModel.updateMany(
        { messages: messageId },
        { $pull: { messages: messageId } }
      );
  
      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
        data: deletedMessage,
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ success: false, message: "Error deleting message", error });
    }
  };
  

//   controller for delete conversation 
const deleteConversationController = async (req, res) => {
    try {
      const { conversationId } = req.params;
  
      // Find and delete the conversation
      const deletedConversation = await conversationModel.findByIdAndDelete(conversationId);
  
      if (!deletedConversation) {
        return res.status(404).json({ success: false, message: "Conversation not found" });
      }
  
      // Delete all messages associated with the conversation
      await messageModel.deleteMany({ _id: { $in: deletedConversation.messages } });
  
      res.status(200).json({
        success: true,
        message: "Conversation and associated messages deleted successfully",
        data: deletedConversation,
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ success: false, message: "Error deleting conversation", error });
    }
  };
  

  

  module.exports = {sendMessageController,getMessagesController,getConversationController,markMessagesAsReadController,deleteMessageController,deleteConversationController}
  