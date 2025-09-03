// src/app/models/Users.js
/** Esse é o sétimo arquivo que configuro */
import bcryptjs from 'bcryptjs';
import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false, // Nome é obrigatório
        },
        email: {
          type: DataTypes.STRING,
          unique: true, // Garante que o e-mail seja único no banco de dados
          allowNull: false, // E-mail é obrigatório
        },
        password_hash: {
          type: DataTypes.STRING,
          allowNull: false, // Hash da senha é obrigatório
        },
        admin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false, // Define 'false' como padrão se não for fornecido
          allowNull: false, // Admin não pode ser nulo
        },
      },
      {
        sequelize,
        tableName: 'users', // Nome da tabela no banco de dados
        timestamps: true, // Adiciona automaticamente os campos `created_at` e `updated_at`
        createdAt: 'created_at', // Mapeia `createdAt` do Sequelize para `created_at` no DB
        updatedAt: 'updated_at', // Mapeia `updatedAt` do Sequelize para `updated_at` no DB
      },
    );

    // Hook `beforeSave` para fazer o hash da senha antes de salvar um usuário
    this.addHook('beforeSave', async (user) => {
      // Este `user.password` é uma propriedade temporária que você passa ao criar/atualizar um usuário.
      // O campo 'password' não deve existir no seu modelo, apenas 'password_hash'.
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 10); // 10 é o número de rounds de salt
      }
    });

    return this;
  }

  // --- CORREÇÃO AQUI: Método `comparePassword` na classe `User` ---
  // Este método é chamado em uma instância do usuário (e.g., `user.comparePassword(senha)`)
  async comparePassword(password) {
    // `this.password_hash` se refere ao hash da senha já salvo no banco de dados
    // para a instância específica do usuário.
    return await bcryptjs.compare(password, this.password_hash); // Use `bcryptjs.compare`
  }
}

export default User;
