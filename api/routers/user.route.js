const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const Joi = require("joi");
const authenticateToken = require("../middleware/auth");

// Schema Joi
const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    phoneNumber: Joi.string().pattern(/^[0-9]{9,11}$/).messages({
        "string.pattern.base": "Phone number must be 9-11 digits",
    }),
    username: Joi.string().alphanum().min(4).max(30).messages({
        "string.alphanum": "Username must contain only letters and numbers",
    }),
    role: Joi.string().valid("user", "admin").default("user"),
}).unknown(true);

// Middleware validate body
function validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

router.get("/", authenticateToken, userController.getUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.post("/", authenticateToken, validateUser, userController.createUser);
router.put("/:id", authenticateToken, validateUser, userController.updateUser);
router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;
