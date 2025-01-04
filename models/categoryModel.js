const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
        maxlength: [50, "Category name must not exceed 50 characters"],
      },
      description: {
        type: String,
        trim: true,
        maxlength: [500, "Description must not exceed 500 characters"],
      },
      isActive: {
        type: Boolean,
        default: true, // Mark category as active by default
      },


}, { timestamps: true })

module.exports = mongoose.model('CarCategory', categorySchema)