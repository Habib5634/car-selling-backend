const carModel = require("../models/carModel");
const categoryModel = require("../models/categoryModel")


//  add categories controller
const addCategoryController = async (req, res) => {
    try {
        const categories = req.body.categories;

        // Validation: Check if categories is an array and not empty
        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Please provide an array of categories with required fields',
            });
        }

        // Track results for each category
        const results = [];
        for (const categoryData of categories) {
            const { name, description, isActive } = categoryData;

            // Validate individual category fields
            if (!name || !description) {
                results.push({
                    success: false,
                    message: 'Missing required fields for category',
                    categoryData,
                });
                continue;
            }

            // Check if category already exists
            const existing = await categoryModel.findOne({ name });
            if (existing) {
                results.push({
                    success: false,
                    message: 'Category already exists',
                    name,
                });
                continue;
            }

            // Save the category
            const category = await categoryModel.create({ name, description, isActive });
            results.push({
                success: true,
                message: 'Category created successfully',
                category,
            });
        }

        // Response with overall status
        res.status(201).send({
            success: true,
            message: 'Processed all categories',
            results,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in adding categories',
            error,
        });
    }
};


// get all product categories controller
const getAllCategoriesController = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await categoryModel.find();

        if (!categories.length) {
            return res.status(404).send({
                success: false,
                message: "No car categories found",
            });
        }

        res.status(200).send({
            success: true,
            message: "car categories retrieved successfully",
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving car categories",
            error,
        });
    }
};

// Get Category By Id
const getCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const category = await categoryModel.findOne({ _id: id});

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "category not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "category retrieved successfully",
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving product",
            error,
        });
    }
};


// post car for sell controller
const addCarController = async (req, res) => {
    try {
        const {
            title,
            carCategory,
            make,
            model,
            year,
            price,
            mileage,
            fuelType,
            transmission,
            description,
            color,
            horsePower,
            engine,
            gears,
            location,
            images,
            ownerDetails,
            sellerId,
            carCondition,
            isActive,
            status,
            featured
        } = req.body;

        // Validation for required fields
        if (!sellerId || !title || !location || !carCategory || !ownerDetails.contactNumber || !price || !ownerDetails?.name || !carCondition) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if the product already exists
        const existing = await carModel.findOne({
            sellerId,
            title,
            price,
            carCategory
        });

        if (existing) {
            return res.status(400).send({
                success: false,
                message: "This Car already posted",
            });
        }

        // Save product
        const car = await carModel.create({
            title,
            carCategory,
            make,
            model,
            year,
            price,
            mileage,
            fuelType,
            transmission,
            description,
            color,
            horsePower,
            engine,
            gears,
            location,
            images,
            ownerDetails,
            sellerId,
            carCondition,
            isActive,
            status,
            featured
        });

        res.status(201).send({
            success: true,
            message: "Car added successfully. Please wait for Admin confirmation",
            car
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in add car API",
            error
        });
    }
};


// Fetch all accepted cars
const getAcceptedCars = async (req, res) => {
    try {
        const acceptedCars = await carModel.find({ status: 'accepted' })
            .populate('sellerId', 'firstName lastName email') // Populate seller information
            .populate('carCategory', 'name'); // Populate category information

        res.status(200).json({ success: true, cars: acceptedCars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch accepted cars' });
    }
};

// Fetch single car post by ID
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        const car = await carModel.findById(id)
            .populate('sellerId', 'firstName lastName email') // Populate seller information
            .populate('carCategory', 'name'); // Populate category information

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        res.status(200).json({ success: true, car });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch car details' });
    }
};

// Fetch the latest 10 accepted and active cars
const getLatestAcceptedCars = async (req, res) => {
    try {
      const latestCars = await carModel.find({ status: 'accepted', isActive: true })
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
        .limit(10)
        .populate('sellerId', 'frstName lastName email') // Populate seller information
        .populate('carCategory', 'name'); // Populate category information
  
      res.status(200).json({ success: true, cars: latestCars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch latest cars' });
    }
  };

  // Delete a car by ID
const deleteCarById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedCar = await carModel.findByIdAndDelete(id);
  
      if (!deletedCar) {
        return res.status(404).json({ success: false, message: 'Car not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Car deleted successfully',
        car: deletedCar,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to delete car' });
    }
  };

  // Update car details by ID
const updateCarDetailsById = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedCar = await carModel.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      })
        .populate('sellerId', 'name email contactNumber') // Populate seller information
        .populate('carCategory', 'name'); // Populate category information
  
      if (!updatedCar) {
        return res.status(404).json({ success: false, message: 'Car not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Car details updated successfully',
        car: updatedCar,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update car details' });
    }
  };
  

// get products by category
const getProductsByCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find products matching the given category ID
        const cars = await carModel.find({ carCategory: categoryId, status: "accepted" }).populate('carCategory', 'name').populate('sellerId', 'firstName lastName email ');;

        if (cars.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No cars found in this category",
            });
        }

        res.status(200).send({
            success: true,
            message: "cars retrieved successfully by category",
            cars,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving cars by category",
            error,
        });
    }
};




module.exports = { addCategoryController, addCarController, getAcceptedCars, getCarById,getAllCategoriesController,getCategoryByIdController,getLatestAcceptedCars,deleteCarById,updateCarDetailsById ,getProductsByCategoryController}