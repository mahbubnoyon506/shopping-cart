const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Helper function to generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
};

exports.signUp = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // console.log(req.body);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ email, password: hashedPassword, role })
        res.status(201).json({ message: "User created successfully", token: generateToken(user.id, user.role) })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        // console.log(user);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" })
        }
        res.json({ message: "Login successful", user: user, token: generateToken(user.id, user.role) })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getMe = async (req, res) => {
    try {
        const userId = req.user?.id
        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const user = await User.findById(userId).select('-password')
        if (!user) return res.status(404).json({ error: 'User not found' })

        res.json({ user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}