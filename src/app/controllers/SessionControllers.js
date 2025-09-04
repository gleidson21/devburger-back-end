/* eslint-disable prettier/prettier */
// src/app/controllers/SessionControllers.js

import User from '../models/Users.js';
import bcryptjs from 'bcryptjs';
import * as yup from 'yup';
import authConfig from '../../config/auth.js';
import jwt from 'jsonwebtoken'; // <<<<< IMPORTAR jsonwebtoken

class SessionControllers {
  async Store(req, res) {
    const Schema = yup.object().shape({
      email: yup.string().email().required('O e-mail é obrigatório.'), // Mensagens de erro mais claras
      password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').required('A senha é obrigatória.'),
    });

    // Validar o corpo da requisição com o Yup
    try {
      await Schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      // Retorna erros de validação do Yup
      return res.status(400).json({
        error: 'Erro de validação',
        details: err.errors,
      });
    }

    const { email, password } = req.body;

    // Buscar o usuário pelo e-mail
    const user = await User.findOne({
      where: { email },
    });

    // Se o usuário não for encontrado
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // Comparar a senha fornecida com a senha hash do usuário
    // Certifique-se de que 'user.password_hash' é o campo correto onde a senha hash está armazenada
    const isPasswordCorrect = await user.comparePassword(password, user.password_hash);

    // Se a senha estiver incorreta
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // >>>>>>> GERAR O TOKEN JWT AQUI <<<<<<<
    // 1. Defina um SECRET (chave secreta) - Idealmente, isso viria de variáveis de ambiente (.env)
    // Por enquanto, usaremos uma string fixa, mas MUDE ISSO em produção!
    const secret = process.env.JWT_SECRET || 'a358a42316aac59ae0721a1b2ee2e49b'; // <<<< MUDE ISSO!

    // 2. Crie o payload do token (informações do usuário que você quer no token)
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
      authConfig.secret, // Sua chave secreta
      {
        expiresIn: authConfig.expiresIn,
      }
    );

    // >>>>>>> RETORNAR O TOKEN E OS DADOS DO USUÁRIO <<<<<<<
    return res.status(200).json({
      message: 'Login bem-sucedido!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
      token, // Retorna o token gerado
    });
  }
}

export default new SessionControllers();
