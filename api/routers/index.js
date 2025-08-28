const express = require("express");
const router = express.Router();

const userRoutes = require("./user.route");
const authRoutes = require("./auth.router");

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
