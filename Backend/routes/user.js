const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const { JWT_USER_PASSWORD } = require("../config");

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });
        res.json({
            message: "Signup succeeded"
        });
    } catch(e) {
        console.error("Error in signup", e);
        res.status(500).json({
            message: "Server error"
        });
    }
});

userRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({
                id: user._id 
            }, JWT_USER_PASSWORD);

            res.json({ token: token });
        } else {
            res.status(403).json({ message: "Incorrect credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    try {
        const purchases = await purchaseModel.find({
            userId: userId, 
        });

        let purchasedCourseIds = [];

        for (let i = 0; i < purchases.length; i++) { 
            purchasedCourseIds.push(purchases[i].courseId)
        }

        const coursesData = await courseModel.find({
            _id: { $in: purchasedCourseIds }
        });

        res.json({
            purchases,
            coursesData
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = {
    userRouter: userRouter
}