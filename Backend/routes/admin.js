const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body; 

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName, 
            lastName: lastName
        });
        
        res.json({ message: "Signup succeeded" });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

adminRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email: email });

        if (!admin) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (passwordMatch) {
            const token = jwt.sign({
                id: admin._id
            }, JWT_ADMIN_PASSWORD);

            res.json({ token: token });
        } else {
            res.status(403).json({ message: "Incorrect credentials" });
        }
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    try {
        const course = await courseModel.create({
            title: title, 
            description: description, 
            imageUrl: imageUrl, 
            price: price, 
            creatorId: adminId
        });

        res.json({
            message: "Course created",
            courseId: course._id
        });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    try {
        const course = await courseModel.updateOne({
            _id: courseId, 
            creatorId: adminId 
        }, {
            title: title, 
            description: description, 
            imageUrl: imageUrl, 
            price: price
        });

        res.json({
            message: "Course updated",
            courseId: courseId
        });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    try {
        const courses = await courseModel.find({
            creatorId: adminId 
        });

        res.json({ courses });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = {
    adminRouter: adminRouter
};