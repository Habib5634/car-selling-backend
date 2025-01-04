const userModel = require('../models/userModel')
const bcrypt = require("bcryptjs")
const JWT = require('jsonwebtoken')


// REGISTER
const registerController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, userType, answer, isBlock } = req.body
        // validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'please provide required fields'
            })
        }

        // user exist!!!
        const existingEmail = await userModel.findOne({ email })
        if (existingEmail) {
            return res.status(500).send({
                success: false,
                message: "Email Already taken"
            })
        }

        // hashing password
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userPayload = {
            firstName, lastName, email, password: hashedPassword, userType, answer, isBlock
        }

        // Filter out empty fields from the payload
        Object.keys(userPayload).forEach((key) => {
            if (!userPayload[key]) {
                delete userPayload[key];
            }
        });

        // save user
        const user = await userModel.create(userPayload);
        user.password = undefined
        user.isBlock = undefined
        res.status(201).send({
            success: true,
            message: "Successfully Registered",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in register API",
            error
        })
    }
}


// Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(500).send({
                succes: false,
                message: "email or password is missing",
                error
            })

        }

        // check user  and compare password
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'use Not Found'
            })
        }

        // check user password | compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Password"
            })
        }
        // create token
        const token = JWT.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "7d" })


        // for hiding password in response
        user.password = undefined
        user.isBlock = undefined
        res.status(200).send({
            success: true,
            mesage: "Login Succesfully",
            user,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Login API",
            error,
        });
    }
}
// get user profile controller
const getUserController = async (req, res) => {
    try {
        // find User
        const user = await userModel.findById({ _id: req.user._id })
        // validation
        if (!user) {
            res.status(500).send({
                success: false,
                message: "User Not Found",
                error,
            });
        }
        // for hiding the password in response
        user.password = undefined
        user.isBlock = undefined


        res.status(200).send({
            success: true,
            mesage: "Login Succesfully",
            user
        })
        // console.log(req.user._id)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In getUser API",
            error,
        });
    }

}


// UPDATE USER
const updateUserController = async (req, res) => {
    try {
        // Find user
        const user = await userModel.findById({ _id: req.user._id });

        // Validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Update fields
        const { firstName, lastName } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;




        // Save user
        await user.save();

        // Hide password in response
        user.password = undefined;

        res.status(200).send({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update User API",
            error,
        });
    }
};


// UPDATE USER PASSWORR
const updatePasswordController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({ _id: req.user._id });
        //valdiation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Usre Not Found",
            });
        }
        // get data from user
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Old or New PasswOrd",
            });
        }
        //check user password  | compare password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid old password",
            });
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Password Update API",
            error,
        });
    }
};

// RESET PASSWORd
const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword, answer } = req.body;
        // if (!email || !newPassword || !answer) {
        if (!email || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please Privide All Fields",
            });
        }
        // const user = await userModel.findOne({ email, answer });
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found or invlaid email",
            });
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Reset SUccessfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "eror in PASSWORD RESET API",
            error,
        });
    }
};






module.exports = { registerController, loginController, getUserController, updateUserController, updatePasswordController, resetPasswordController }
