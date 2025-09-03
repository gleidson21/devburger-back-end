// src/app/controllers/CategoryController.js

import Category from '../models/Category.js';
import * as yup from 'yup';
import User from '../models/Users.js'; // Importar o modelo User para a validação de admin

class CategoryController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required('O nome da categoria é obrigatório.'),
    });

    // 1. Validação de esquema (Yup)
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({
        error: 'Erro de validação',
        details: err.errors,
      });
    }

    // --- Validação de Admin AQUI, DENTRO DO CONTROLADOR ---
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ error: 'Não autorizado. Token de usuário não fornecido.' });
    }

    try {
      const user = await User.findByPk(userId);

      if (!user || !user.admin) {
        return res.status(403).json({
          error:
            'Acesso negado. Apenas administradores podem criar categorias.',
        });
      }

      // Se o usuário é um admin, prossegue com a lógica de criação da categoria
      const { name } = req.body;
      const formattedName =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      const path = req.file ? req.file.filename : null; // <<< INCLUI O PATH AQUI

      // 2. Validação de Categoria Duplicada
      const categoryExists = await Category.findOne({
        where: { name: formattedName },
      });

      if (categoryExists) {
        return res.status(409).json({ error: 'Categoria já existe.' });
      }

      // 3. Criação da Nova Categoria
      const newCategory = await Category.create({ name: formattedName, path }); // <<< PASSA O PATH PARA O MODELO

      // Retorna a categoria com a URL completa, se houver
      const categoryWithUrl = {
        ...newCategory.toJSON(),
        url: newCategory.url, // <<< USA O GETTER VIRTUAL DO MODELO
      };

      return res.status(201).json(categoryWithUrl);
    } catch (err) {
      console.error(
        'Erro ao criar categoria (verificação de admin ou DB):',
        err,
      );
      return res.status(500).json({
        error: 'Erro interno ao criar categoria.',
        details: err.message,
      });
    }
  }

  async index(req, res) {
    try {
      const categories = await Category.findAll();

      if (!categories || categories.length === 0) {
        return res.status(204).json();
      }

      // Mapeia para incluir a URL para cada categoria
      const categoriesWithUrls = categories.map((category) => ({
        ...category.toJSON(),
        url: category.url, // <<< USA O GETTER VIRTUAL DO MODELO AQUI
      }));

      return res.status(200).json(categoriesWithUrls);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      return res.status(500).json({
        error: 'Erro interno ao buscar categorias.',
        details: err.message,
      });
    }
  }

  // --- MÉTODO PARA ATUALIZAR CATEGORIA (COM VALIDAÇÃO DE ADMIN INTERNA) ---
  async update(req, res) {
    const { id } = req.params;

    // --- Validação de Admin AQUI, DENTRO DO CONTROLADOR (para o método update) ---
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ error: 'Não autorizado. Token de usuário não fornecido.' });
    }

    try {
      const user = await User.findByPk(userId);

      if (!user || !user.admin) {
        return res.status(403).json({
          error:
            'Acesso negado. Apenas administradores podem atualizar categorias.',
        });
      }

      // Se o usuário é um admin, prossegue com a lógica de atualização da categoria
      const schema = yup.object().shape({
        name: yup.string().required('O novo nome da categoria é obrigatório.'),
      });

      try {
        await schema.validate(req.body, { abortEarly: false });
      } catch (err) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: err.errors,
        });
      }

      const { name } = req.body;
      const formattedName =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      const path = req.file ? req.file.filename : null; // <<< PEGA O NOME DO NOVO ARQUIVO

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
      }

      if (formattedName !== category.name) {
        const categoryWithNewNameExists = await Category.findOne({
          where: { name: formattedName },
        });

        if (categoryWithNewNameExists) {
          return res
            .status(409)
            .json({ error: 'Já existe uma categoria com este nome.' });
        }
      }

      const updateData = { name: formattedName };
      if (path) {
        updateData.path = path; // <<< SE UM NOVO ARQUIVO FOI ENVIADO, ATUALIZA O 'PATH'
      }

      await category.update(updateData);

      // Re-busca a categoria para retornar a URL atualizada
      const updatedCategory = await Category.findByPk(id);
      const categoryWithUrl = {
        ...updatedCategory.toJSON(),
        url: updatedCategory.url,
      };

      return res.status(200).json({
        message: 'Categoria atualizada com sucesso!',
        category: categoryWithUrl,
      });
    } catch (err) {
      console.error(
        'Erro ao atualizar categoria (verificação de admin ou DB):',
        err,
      );
      return res.status(500).json({
        error: 'Erro interno ao atualizar categoria.',
        details: err.message,
      });
    }
  }
}

export default new CategoryController();
