// src/config/multer.js

import multer from 'multer';
import { extname, resolve, dirname } from 'node:path'; // Importe 'dirname' também
import { fileURLToPath } from 'node:url'; // Importe 'fileURLToPath'

import { v4 } from 'uuid';

// CORREÇÃO AQUI: Como obter __dirname em um módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'), // Agora __dirname está definido!

        filename: (req, file, callback) => {
            const fileExtension = extname(file.originalname);
            const newFileName = `${v4()}${fileExtension}`;

            return callback(null, newFileName);
        },
    }),
};