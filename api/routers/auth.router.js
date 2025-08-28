const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const Joi = require("joi");

const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required().messages({
        "string.alphanum": "Username chỉ được chứa chữ và số",
        "string.min": "Username phải ít nhất 4 ký tự",
        "string.max": "Username tối đa 30 ký tự",
        "any.required": "Username là bắt buộc",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password phải ít nhất 6 ký tự",
        "any.required": "Password là bắt buộc",
    }),
});

// Middleware validate body
function validateUser(req, res, next) {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            errors: error.details.map((err) => err.message),
        });
    }
    next();
}

router.post("/login", validateUser, authController.login);

module.exports = router;
