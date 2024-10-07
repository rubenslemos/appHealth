// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

// controllers/authController.js
exports.register = async (req, res) => {
  const { username, password, userType, companyId } = req.body;

  // Validações
  if (userType === 'admin' || userType === 'user') {
      if (!companyId) {
          return res.status(400).json({ message: 'Admins e users devem estar associados a uma empresa.' });
      }
  } else if (userType === 'admin-master' || userType === 'user-master') {
      // Para admin master e user master, companyId pode ser nulo
      if (userType === 'user-master' && companyId) {
          return res.status(400).json({ message: 'User master não deve estar associado a uma empresa.' });
      }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword, userType, companyId };

  try {
      const user = await User.create(newUser);
      res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (err) {
      res.status(500).json({ message: 'Erro ao criar usuário.', error: err.message });
  }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, companyId: user.companyId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

// controllers/authController.js
exports.createCompany = async (req, res) => {
  const { name, isMaster } = req.body;

  // Permitir que apenas um admin master crie uma empresa master
  if (isMaster && req.user.role !== 'admin-master') {
      return res.status(403).json({ message: 'Somente admin master pode criar uma empresa master.' });
  }

  try {
      const newCompany = await Company.create({ name, isMaster });
      res.status(201).json({ message: 'Empresa criada com sucesso!', company: newCompany });
  } catch (err) {
      res.status(500).json({ message: 'Erro ao criar empresa.', error: err.message });
  }
};

