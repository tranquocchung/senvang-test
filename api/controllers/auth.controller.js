const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === "admin" && password === "123456") {
            const token = jwt.sign(
                {
                    username: 'admin',
                    role: 'admin',
                    email: 'admin@gmail.com'
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            return res.json({
                message: "Đăng nhập thành công",
                data: {
                    token
                }
            });
        } else {
            return res.status(401).json({ error: "Username hoặc password không đúng" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
};