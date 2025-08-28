// src/controllers/userController.js
const { sendUserCreatedEvent } = require("../config/kafka");
const redisClient = require("../config/redis");
const { User } = require("../models");
const { Op } = require("sequelize");

const flushUsersCache = async () => {
    const keys = await redisClient.keys("users*");
    if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(" Redis cache cleared");
    }
};

const flushUserCache = async (id) => {
    const key = `user:${id}`;
    const exists = await redisClient.del(key);
    if (exists) console.log(`Redis cache cleared user id=${id}`);
};

exports.getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, name, email, username, gender } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const cacheKey = `users:${page}:${limit}:${name || ""}:${email || ""}:${username || ""}:${gender || ""}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const where = { isDeleted: false };
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (email) where.email = { [Op.like]: `%${email}%` };
        if (username) where.username = { [Op.like]: `%${username}%` };
        if (gender) where.gender = gender;

        const { count, rows } = await User.findAndCountAll({
            where,
            offset,
            limit,
            order: [["createdAt", "DESC"]],
        });

        const result = {
            total: count,
            page,
            limit,
            data: rows,
        };

        await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
        res.json(result);
    } catch (err) {
        console.error("getUsers error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const cacheKey = `user:${id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const user = await User.findOne({ where: { id, isDeleted: false } });
        if (!user) return res.status(404).json({ error: "User not found" });

        await redisClient.setEx(cacheKey, 300, JSON.stringify(user));
        res.json(user);
    } catch (err) {
        console.error("getUserById error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const exists = await User.findOne({ where: { email: req.body.email } });
        if (exists) return res.status(400).json({ error: "Email already exists" });

        const user = await User.create(req.body);
        sendUserCreatedEvent(user); // Gửi sự kiện đến Kafka

        await flushUsersCache(); // Xóa cache danh sách

        res.status(201).json(user);
    } catch (err) {
        console.error("createUser error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id, isDeleted: false } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const updatableFields = [
            "name", "age", "address", "gender", "email",
            "phoneNumber", "username", "password", "role"
        ];

        const updatedData = {};
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) updatedData[field] = req.body[field];
        });

        await user.update(updatedData);

        await flushUsersCache(); // Xóa cache danh sách
        await flushUserCache(id); // Xóa cache user cụ thể

        res.json(user);
    } catch (err) {
        console.error("updateUser error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await User.update({ isDeleted: true }, { where: { id } });

        if (!updated) return res.status(404).json({ error: "User not found" });


        await flushUsersCache();
        await flushUserCache(id);

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("deleteUser error:", err);
        res.status(500).json({ error: err.message });
    }
};
