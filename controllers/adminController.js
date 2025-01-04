const carModel = require("../models/carModel");
const userModel = require("../models/userModel");


// Fetch all pending cars
const getPendingCars = async (req, res) => {
    try {
        const pendingCars = await carModel.find({ status: 'pending' })
            .populate('sellerId', 'firstName lastName email') // Populate seller information
            .populate('carCategory', 'name'); // Populate category information

        res.status(200).json({ success: true, cars: pendingCars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending cars' });
    }
};


// Change status from pending to accepted or rejected
const updateCarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const car = await carModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate('sellerId', 'firstName lastName email') // Populate seller information
            .populate('carCategory', 'name'); // Populate category information

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        res.status(200).json({
            success: true,
            message: `Car status updated to ${status}`,
            car,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update car status' });
    }
};


// Get All Users
const getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({})
        .select('-password') // Exclude password field
        .sort({ createdAt: -1 }); // Sort by most recent
  
      res.status(200).json({
        success: true,
        message: 'List of all users',
        users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error,
      });
    }
  };
  
  // Delete a User by ID
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await userModel.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        user: deletedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error,
      });
    }
  };
  
  // Block or Unblock a User by ID
  const blockUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { isBlock } = req.body; // Expecting `isBlock: true/false` in the body
  
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { isBlock },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: `User has been ${isBlock ? 'blocked' : 'unblocked'} successfully`,
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error updating user block status',
        error,
      });
    }
  };
  

module.exports = {getPendingCars,updateCarStatus,getAllUsers,deleteUser,blockUser}