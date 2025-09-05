// src/app/controllers/ProductControllers.js

import * as yup from 'yup';
import Product from '../models/product.js';
import Category from '../models/Category.js';
import User from '../models/Users.js';

class ProductControllers {
  async store(req, res) {
    const Schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório.'),
      price: yup
        .number()
        .required('Preço é obrigatório.')
        .min(0, 'Preço deve ser um número positivo.')
        .typeError('Preço deve ser um valor numérico válido.'),
      category_id: yup
        .number()
        .required('ID da categoria é obrigatório.')
        .typeError('ID da categoria deve ser um número inteiro.'),
      offer: yup.boolean().optional(),
      discount: yup.number().min(0).max(100).optional(),
    });

    try {
      await Schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(400).json({
        error: 'Erro de validação',
        details: err.errors,
      });
    }

    const { name, price, category_id, offer, discount } = req.body;
    const parsedPrice = parseFloat(price);
    const path = req.file ? req.file.filename : null;

    if (!path) {
      return res
        .status(400)
        .json({ error: 'Nenhum arquivo enviado para o campo "path".' });
    }

    try {
      const categoryExists = await Category.findByPk(category_id);
      if (!categoryExists) {
        return res.status(404).json({
          error: 'Categoria não encontrada. Forneça um ID de categoria válido.',
        });
      }

      const newProduct = await Product.create({
        name,
        price: parsedPrice,
        category_id,
        path,
        offer: offer || false,
        discount: discount || 0,
      });

      const productWithUrl = {
        ...newProduct.toJSON(),
        url: `https://devburger-back-end.onrender.com/category-file/${product.path}`,
      };

      return res.status(201).json({
        message: 'Produto criado com sucesso!',
        product: productWithUrl,
      });
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      return res.status(500).json({
        error: 'Erro interno ao criar produto.',
        details: err.message,
      });
    }
  }

  async index(req, res) {
    try {
      const allProducts = await Product.findAll({
        attributes: [
          'id',
          'name',
          'price',
          'offer',
          'discount',
          'path',
          'category_id',
        ], // <<<< Adicionado category_id aqui
      });

      if (!allProducts || allProducts.length === 0) {
        return res.status(200).json([]);
      }

      const productsWithUrls = allProducts.map((product) => {
        return {
          ...product.toJSON(),
          url: `https://devburger-back-end.onrender.com/category-file/${product.path}`,
        };
      });

      return res.status(200).json(productsWithUrls);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({
        error: 'Erro interno ao buscar produtos.',
        details: error.message,
      });
    }
  }

  async update(req, res) {
    const { id } = req.params;

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
            'Acesso negado. Apenas administradores podem atualizar produtos.',
        });
      }
    } catch (err) {
      console.error('Erro ao verificar permissões de admin:', err);
      return res.status(500).json({
        error: 'Erro interno ao verificar permissões.',
        details: err.message,
      });
    }

    const schema = yup.object().shape({
      name: yup.string().optional(),
      price: yup
        .number()
        .min(0, 'Preço deve ser um número positivo.')
        .typeError('Preço deve ser um valor numérico válido.')
        .optional(),
      category_id: yup
        .number()
        .typeError('ID da categoria deve ser um número inteiro.')
        .optional(),
      offer: yup.boolean().optional(),
      discount: yup.number().min(0).max(100).optional(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({
        error: 'Erro de validação',
        details: err.errors,
      });
    }

    const { name, price, category_id, offer, discount } = req.body;
    const path = req.file ? req.file.filename : null;

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      if (category_id) {
        const categoryExists = await Category.findByPk(category_id);
        if (!categoryExists) {
          return res.status(404).json({
            error:
              'Nova categoria não encontrada. Forneça um ID de categoria válido.',
          });
        }
      }

      const updateData = {
        name: name !== undefined ? name : product.name,
        price: price !== undefined ? parseFloat(price) : product.price,
        category_id:
          category_id !== undefined ? category_id : product.category_id,
        offer: offer !== undefined ? offer : product.offer,
        discount: discount !== undefined ? discount : product.discount,
      };

      if (path) {
        updateData.path = path;
      }

      await product.update(updateData);

      const updatedProduct = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      const productWithUrl = {
        ...updatedProduct.toJSON(),
        url: `https://devburger-back-end.onrender.com/category-file/${product.path}`,
      };

      return res.status(200).json({
        message: 'Produto atualizado com sucesso!',
        product: productWithUrl,
      });
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      return res.status(500).json({
        error: 'Erro interno ao atualizar produto.',
        details: err.message,
      });
    }
  }
}

export default new ProductControllers();
