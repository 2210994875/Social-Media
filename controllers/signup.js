const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const userFilePath = path.join(__dirname, '../data/users.json');
const adminFilePath = path.join(__dirname, '../data/admin.json');

let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8') || '[]');
let admins = JSON.parse(fs.readFileSync(adminFilePath, 'utf-8') || '[]');

const saveData = () => fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2), 'utf-8');
const saveAdminData = () => fs.writeFileSync(adminFilePath, JSON.stringify(admins, null, 2), 'utf-8');

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Please provide all details');

    const existingUser = users.find(user => user.email === email);
    const existingAdmin = admins.find(admin => admin.email === email);
    if (existingUser || existingAdmin) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = users.length + admins.length + 1; 

    if (id === 1) {
        const newAdmin = { id, email, password: hashedPassword, role: 'admin', registered: true };
        admins.push(newAdmin);
        saveAdminData();
        return res.status(201).send('First user registered as admin successfully');
    }

    const newUser = { id, email, password: hashedPassword, registered: true };
    users.push(newUser);
    saveData();
    return res.status(201).send('User registered successfully');
};
