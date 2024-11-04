const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;
const userFilePath = path.join(__dirname, '../data/users.json');
const adminFilePath = path.join(__dirname, '../data/admin.json');

let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8') || '[]');
let admins = JSON.parse(fs.readFileSync(adminFilePath, 'utf-8') || '[]');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    let user = users.find(user => user.email === email);
    let isAdmin = false;

    if (!user) {
        user = admins.find(admin => admin.email === email);
        if (!user) return res.status(400).send('User not found');
        isAdmin = true;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user.id, role: isAdmin ? 'admin' : 'user' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
