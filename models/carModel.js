const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "2022 Toyota Camry"
    carCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarCategory",
        required: true,
    },
    make: { type: String, required: true }, // e.g., "Toyota"
    model: { type: String, required: true }, // e.g., "Camry"
    year: { type: Number, required: true }, // e.g., 2022
    price: { type: Number, required: true }, // e.g., 20000
    mileage: { type: Number, required: true }, // e.g., 15000 (in kilometers or miles)
    fuelType: { type: String, required: true }, // e.g., "Petrol", "Diesel", "Electric"
    transmission: { type: String, required: true }, // e.g., "Manual", "Automatic"
    description: { type: String }, // Detailed description of the car
    color: { type: String, required: true }, // color of the car
    horsePower: { type: Number, required: true }, // HorsePower of the car
    engine: { type: String, required: true }, // HorsePower of the car
    gears: { type: String, required: true }, // HorsePower of the car
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
    },
    images: [{ type: String }], // Array of image URLs
    ownerDetails: {
        name: { type: String, required: true },
        contactNumber: { type: String, required: true },
        email: { type: String },
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
    carCondition: {
        type: String,
        enum: ['used', 'new'],
        default: 'new'
    },
    isActive: {
        type: Boolean,
        default:true
        },
    featured: {
        type: Boolean,
        default:false
        },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default:'pending'
        },
    
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema)
