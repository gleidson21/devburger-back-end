/* eslint-disable prettier/prettier */
// eslint.config.js

// Importa os módulos necessários// eslint-disable-next-line prettier/prettier
import globals from "globals"; // Para definir variáveis globais (ex: 'node' para ambiente Node.js)
import js from "@eslint/js"; // Regras recomendadas do ESLint para JavaScript
import prettierPlugin from "eslint-plugin-prettier"; // Plugin que roda o Prettier como uma regra do ESLint
import prettierConfig from "eslint-config-prettier"; // Configuração que desativa regras conflitantes do ESLint com o Prettier

// Exporta um array de configurações (o novo formato "Flat Config" do ESLint)
export default [
  {
    // Define quais arquivos esta configuração deve ser aplicada.
    // "**/*.js" significa todos os arquivos .js em qualquer subdiretório.
    files: ["**/*.js"],

    // Opções de linguagem para o parser do JavaScript
    languageOptions: {
      ecmaVersion: 2022, // Define a versão do ECMAScript (use a versão do Node.js ou mais recente)
      sourceType: "module", // Indica que você está usando módulos ES (import/export)
      globals: {
        ...globals.node, // Adiciona variáveis globais do ambiente Node.js (ex: console, process, require)
        // Se você também tiver código frontend (browser), você poderia adicionar: ...globals.browser,
      }
    },

    // Aplica as configurações recomendadas do ESLint para JavaScript
    ...js.configs.recommended,

    // Configura os plugins que serão usados
    plugins: {
      prettier: prettierPlugin, // Registra o plugin do Prettier
    },

    // Define regras específicas do ESLint
    rules: {
      // Ativa a regra 'prettier/prettier' para que o ESLint reporte diferenças de formatação
      // detectadas pelo Prettier como erros de lint.
      "prettier/prettier": "error",

      // Exemplo de uma regra adicional: força o uso de ponto e vírgula no final das declarações.
      // O Prettier já cuida disso se você tiver "semi": true no seu .prettierrc.json,
      // mas ter a regra aqui pode dar uma camada extra de segurança.
      "semi": ["error", "always"],

      // Outras regras úteis que você pode querer adicionar ou modificar:
      // "no-unused-vars": "warn", // Avisa sobre variáveis não utilizadas
      // "no-console": "off",     // Permite o uso de console.log
      // "indent": ["error", 2],  // Força indentação com 2 espaços (o Prettier também gerencia isso)
    },
  },

  // Importa a configuração do eslint-config-prettier.
  // Isso desativa todas as regras do ESLint que podem entrar em conflito com o Prettier,
  // garantindo que não haja duas ferramentas tentando formatar a mesma coisa de maneiras diferentes.
  prettierConfig,

  {
    // Define arquivos e diretórios que o ESLint deve ignorar durante a verificação
    ignores: [
      "node_modules/", // Ignora a pasta de dependências
      "dist/",         // Ignora a pasta de build (se você tiver uma)
      "build/",        // Outra pasta comum de build
      ".git/",         // Ignora o diretório do Git
    ],
  }
];