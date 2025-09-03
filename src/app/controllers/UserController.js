// src/app/controllers/UserController.js
/**esse eo meu oitavio que configuro */

import User from '../models/Users.js';
// Instale bcryptjs: npm install bcryptjs
import bcryptjs from 'bcryptjs'; // <-- Importe bcryptjs (mais comum que apenas 'bcrypt')
import * as yup from 'yup';

class UserController {
  async store(req, res) {
    const Schema = yup.object().shape({
      name: yup.string().required('name is required'),
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
      admin: yup.boolean(),
    });
    console.log('Requisição para criar usuário recebida!');
    console.log('Dados recebidos:', req.body);

    try {
      Schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({
        error: err.errors,
      });
    }

    // Receba 'password' em texto puro, e NÃO 'password_hash'
    const { name, email, password, admin } = req.body;

    try {
      // 1. Verificar se o usuário já existe pelo email
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: 'User with this email already exists.' });
      }

      // 2. Gerar o hash da senha no servidor
      const password_hash = await bcryptjs.hash(password, 8); // '8' é o número de rounds de salt

      // 3. Criar o usuário
      const user = await User.create({
        // Se seu ID for AUTO_INCREMENT ou UUID gerado pelo Sequelize,
        // REMOVA a linha 'id: crypto.randomUUID(),' daqui.
        // Exemplo se seu model gerencia o UUID automaticamente:
        // id: undefined, // Ou simplesmente não inclua o 'id'
        name,
        email,
        password_hash,
        // Garantir que 'admin' tenha um valor (usa o do body ou 'false' por padrão)
        admin: admin || false,
      });

      // 4. Retornar a resposta (sem expor o password_hash)
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin, // Inclua admin na resposta se desejar
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);

      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Erro de validação ao criar usuário.',
          details: error.errors.map((err) => err.message),
        });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          error: 'E-mail já cadastrado. Por favor, use um e-mail diferente.',
        });
      }

      return res
        .status(500)
        .json({ error: 'Erro interno do servidor.', details: error.message });
    }
  }
}

export default new UserController();
