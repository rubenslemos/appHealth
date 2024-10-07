// middlewares/authorize.js
const jwt = require('jsonwebtoken');

// middlewares/authorize.js
exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) return res.status(403).json({ message: 'Token não fornecido.' });

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return res.status(403).json({ message: 'Token inválido.' });
          req.user = user;

          // Verificação de acesso
          if (!allowedRoles.includes(user.userType)) {
              return res.status(403).json({ message: 'Acesso negado.' });
          }
          next();
      });
  };
};

