
// routes/auth.js
const express = require('express');
const { register, login, createCompany } = require('../controllers/authController');
const { authorize } = require('../middlewares/authorize'); // Crie um arquivo para middleware

const router = express.Router();

// Registro de empresa
router.post('/company', authorize(['admin-master']), createCompany);

// Registro de usuário
router.post('/register', register);

// Login de usuário
router.post('/login', login);

// Rotas protegidas
router.get('/admin', authorize(['admin-master', 'admin']), (req, res) => {
    res.send('Acesso permitido para admins.');
});

module.exports = router;
