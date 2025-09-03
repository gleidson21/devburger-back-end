/* eslint-disable prettier/prettier */
/**esse eo nono que configuro */

import { Router } from 'express';
import multer from 'multer';
import multerconfig from './config/multer.js';

// --- Importar Controladores ---
import UserController from './app/controllers/UserController.js';
import SessionControllers from './app/controllers/SessionControllers.js';
import ProductController from './app/controllers/ProductCrontrollers.js'; // <<<<< CORRIGIDO AQUI!
import CategoryController from './app/controllers/CategoryController.js';
import OrderController from './app/controllers/OrderController.js';
import PaymentController from './app/controllers/PaymentController.js';

// --- Importar Middlewares ---
import authMiddleware from './app/middlewares/auth.js'; // Seu middleware de autenticação
import adminAuth from './app/middlewares/adminAuth.js'; // Seu middleware de admin

const routes = new Router();

const upload = multer(multerconfig);

// --- ROTAS PÚBLICAS (NÃO PRECISAM DE AUTENTICAÇÃO) ---
routes.post('/users', UserController.store);
routes.post('/session', SessionControllers.Store);
routes.post('/create-payment-intent', PaymentController.createPaymentIntent);

// --- APLICAÇÃO DO MIDDLEWARE DE AUTENTICAÇÃO (para todas as rotas abaixo) ---
// Todas as rotas definidas ABAIXO desta linha exigirão um token JWT válido.
routes.use(authMiddleware);

// --- ROTAS PROTEGIDAS POR ADMIN (VIA MIDDLEWARE 'adminAuth') ---
// Para criar produto: exige autenticação e permissão de admin
routes.post('/products', adminAuth, upload.single('file'), ProductController.store);
// Para atualizar produto: exige autenticação e permissão de admin
routes.put('/products/:id', adminAuth, upload.single('file'), ProductController.update); // Rota de update de produto

// Para criar categoria: exige autenticação e permissão de admin
routes.post('/categories', adminAuth, upload.single('file'), CategoryController.store); // <<<<< AGORA COM UPLOAD DE ARQUIVO
// Para atualizar categoria: exige autenticação e permissão de admin
routes.put('/categories/:id', adminAuth, upload.single('file'), CategoryController.update); // <<<<< NOVA ROTA DE UPDATE DE CATEGORIA

// Para listar TODOS os pedidos: exige autenticação e permissão de admin
routes.get('/orders', adminAuth, OrderController.index);
// Para atualizar status de pedido: exige autenticação e permissão de admin
routes.put('/orders/:id/status', adminAuth, OrderController.updateStatus);

// --- ROTAS PROTEGIDAS (APENAS AUTENTICAÇÃO, SEM NECESSIDADE DE ADMIN) ---
// Essas rotas não precisam de adminAuth, apenas de um token de usuário válido.
routes.get('/products', ProductController.index);
routes.get('/categories', CategoryController.index);
routes.post('/orders', OrderController.store);
routes.get('/my-orders', OrderController.show);

export default routes;