const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient'); // Importando o cliente Supabase

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
        const { data, error } = await supabase
            .from('users') // Nome da tabela
            .insert([newUser]);

        if (error) {
            return res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
        }

        res.status(201).json({ message: 'Usuário criado com sucesso!', user: data });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar usuário.', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single(); // Obtém apenas um único usuário

    if (error || !users) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const user = users; // O usuário retornado

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.id, role: user.userType, companyId: user.companyId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

exports.createCompany = async (req, res) => {
    const { name, isMaster } = req.body;

    // Permitir que apenas um admin master crie uma empresa master
    if (isMaster && req.user.role !== 'admin-master') {
        return res.status(403).json({ message: 'Somente admin master pode criar uma empresa master.' });
    }

    try {
        const { data, error } = await supabase
            .from('companies') // Nome da tabela
            .insert([{ name, isMaster }]);

        if (error) {
            return res.status(500).json({ message: 'Erro ao criar empresa.', error: error.message });
        }

        res.status(201).json({ message: 'Empresa criada com sucesso!', company: data });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar empresa.', error: err.message });
    }
};
