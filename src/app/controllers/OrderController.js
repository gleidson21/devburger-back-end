/* eslint-disable prettier/prettier */
import * as yup from 'yup';
import Order from '../schemas/Order.js'; // Importa o modelo de Order do MongoDB
import Product from '../models/product.js'; // Importa o modelo de Product do PostgreSQL
import User from '../models/Users.js'; // Importa o modelo de User do PostgreSQL
import Category from '../models/Category.js';

class OrderController {
  async store(req, res) {
    const schema = yup.object().shape({
      products: yup
        .array()
        .of(
          yup.object().shape({
            id: yup.string().required('ID do produto é obrigatório.'),
            quantity: yup
              .number()
              .required('Quantidade é obrigatória.')
              .min(1, 'Quantidade mínima é 1.'),
          }),
        )
        .required('Produtos são obrigatórios.')
        .min(1, 'Pelo menos um produto é necessário.'),
      address: yup
        .object()
        .shape({
          street: yup.string(),
          number: yup.string(),
          complement: yup.string(),
          city: yup.string(),
          state: yup.string(),
          zipCode: yup.string(),
        })
        .optional(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Erro de validação', details: err.errors });
    }

    const { products, address } = req.body;
    const userId = req.userId;

    try {
      // 1. Otimização: Evitar o problema de N+1 queries
      const productIds = products.map((item) => item.id);
      
      const productsFromDb = await Product.findAll({
        where: {
          id: productIds,
        },
      });

      if (productsFromDb.length !== productIds.length) {
        return res.status(404).json({
          error: 'Um ou mais produtos não foram encontrados.',
        });
      }

      let totalPrice = 0;
      const productsForOrder = [];
      
      for (const item of productsFromDb) {
        const orderedItem = products.find((p) => p.id === item.id);
        const itemPrice = parseFloat(item.price) * orderedItem.quantity;
        totalPrice += itemPrice;

        // --- CORREÇÃO AQUI ---
        // Acessa o objeto do Sequelize e converte para um objeto JSON
        // para que a propriedade virtual 'url' seja incluída.
          const productUrl = item.url; 

    productsForOrder.push({
      product_id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      quantity: orderedItem.quantity,
      url: productUrl, // <-- Salva a URL completa no MongoDB
    });
  }

      const newOrder = await Order.create({
        user: userId,
        products: productsForOrder,
        address: address,
        totalPrice: totalPrice,
        status: 'Pendente',
      });

      return res.status(201).json(newOrder);
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      return res
        .status(500)
        .json({ error: 'Erro interno ao criar pedido.', details: err.message });
    }
  }

  async index(req, res) {
    try {
      const orders = await Order.find();
      if (!orders || orders.length === 0) {
        return res.status(204).json();
      }
      const userIds = [...new Set(orders.map(order => order.user))];
      const users = await User.findAll({
        where: {
          id: userIds
        },
        attributes: ['id', 'name']
      });
      const userMap = new Map(users.map(user => [user.id, user.name]));
      const ordersWithUserName = orders.map(order => ({
        ...order.toJSON(),
        userName: userMap.get(order.user) || 'Nome não encontrado'
      }));
      return res.status(200).json(ordersWithUserName);
    } catch (err) {
      console.error('Erro ao listar pedidos:', err);
      return res.status(500).json({
        error: 'Erro interno ao listar pedidos.',
        details: err.message,
      });
    }
  }

  async show(req, res) {
    const userId = req.userId;
    try {
      const orders = await Order.find({ user: userId });
      if (!orders || orders.length === 0) {
        return res.status(204).json();
      }
      return res.status(200).json(orders);
    } catch (err) {
      console.error('Erro ao buscar pedidos do usuário:', err);
      return res.status(500).json({
        error: 'Erro interno ao buscar pedidos do usuário.',
        details: err.message,
      });
    }
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'Pendente',
      'Em Preparação',
      'Entregue',
      'Cancelado',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error:
          'Status inválido. Use Pendente, Em Preparação, Entregue ou Cancelado.',
      });
    }

    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      return res.status(200).json(order);
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
      return res.status(500).json({
        error: 'Erro interno ao atualizar status do pedido.',
        details: err.message,
      });
    }
  }
}

export default new OrderController();