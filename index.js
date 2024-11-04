const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Define port and JWT secret directly
const port = 3000;
const JWT_SECRET = "superSecretJWTKey123!";

// Routes
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');

app.use('/auth', signupRoutes);
app.use('/auth', loginRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
