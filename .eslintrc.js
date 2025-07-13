module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true, // Adiciona o ambiente do Jest
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error', // Mostra erros do Prettier como erros do ESLint
    'class-methods-use-this': 'off', // Permite que métodos de classe não usem 'this' (útil em controllers)
    'no-param-reassign': 'off', // Permite a reatribuição de parâmetros de função (comum em alguns padrões)
    camelcase: 'off', // Desliga a regra de camelCase (às vezes recebemos snake_case de APIs)
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }], // Permite 'next' como variável não usada (comum em middlewares)
  },
};
