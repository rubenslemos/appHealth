// index.js
const express = require('express');
const sequelize = require('./database');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const Company = require('./models/Company');

// Define associações
User.associate({ Company });

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

// Sincronizando o banco de dados
sequelize.sync({ force: true }) // Use force: true apenas em desenvolvimento para recriar as tabelas
    .then(() => console.log('Banco de dados conectado e sincronizado!'))
    .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
