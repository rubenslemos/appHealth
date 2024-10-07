// index.js
const express = require('express');
const supabase = require('./supabaseClient');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.post('/api/users', async (req, res) => {
    const { username, password, userType, companyId } = req.body;

    // Insere um novo usuário na tabela 'users'
    const { data, error } = await supabase
        .from('users') // Nome da tabela
        .insert([{ username, password, userType, companyId }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
});

app.get('/api/users', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*'); // Seleciona todos os usuários

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
});

app.post('/api/companies', async (req, res) => {
    const { name, isMaster } = req.body;

    // Insere uma nova empresa na tabela 'companies'
    const { data, error } = await supabase
        .from('companies') // Nome da tabela
        .insert([{ name, isMaster }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
});

app.get('/api/companies', async (req, res) => {
    const { data, error } = await supabase
        .from('companies')
        .select('*'); // Seleciona todas as empresas

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
