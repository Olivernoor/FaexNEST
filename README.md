<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

**Projeto**: Pousadas (backend)

- **Descrição**: API backend construída com NestJS e MongoDB (Mongoose) para gerenciamento de usuários (exemplo/estrutura inicial).

**Stack**: Node.js, TypeScript, NestJS, Mongoose, bcrypt, class-validator, Jest

**Rápido**
- **Instalar dependências**: `npm install`
- **Rodar em desenvolvimento**: `npm run dev` (equivalente a `nest start --watch`)
- **Rodar produção**: `npm run start:prod`
- **Testes unitários**: `npm run test`
- **Testes e2e**: `npm run test:e2e`

**Scripts importantes** (do `package.json`):
- **`build`**: `nest build`
- **`start`**: `nest start`
- **`dev`**: `nest start --watch`
- **`lint`**: `eslint "{src,apps,libs,test}/**/*.ts" --fix`
- **`test`**, **`test:e2e`**, **`test:cov`**

**Como configurar o banco**
- O projeto atualmente conecta diretamente a `mongodb://localhost:27017/pont` em `src/app.module.ts`.
- Para usar outra URI, substitua essa string por uma variável de ambiente (ex.: use `process.env.MONGODB_URI`) ou configure o `ConfigModule` do Nest.

**Endpoints principais (módulo `users`)**
- `POST /users` — cria usuário. Body esperado (exemplo):
  ```json
  { "name": "Nome", "email": "email@ex.com", "password": "SenhaForte123!" }
  ```
- `GET /users` — lista todos os usuários
- `GET /users/:id` — obtém usuário por id
- `PATCH /users/:id` — atualiza usuário (parcial)
- `DELETE /users/:id` — remove usuário

**Estrutura do projeto (resumo)**
- `src/app.module.ts`: módulo raiz; configura `MongooseModule.forRoot(...)`.
- `src/main.ts`: bootstrap da aplicação (usa `process.env.PORT ?? 3000`).
- `src/users/`:
  - `Users.controller.ts`: controladora com endpoints REST para usuários.
  - `users.service.ts`: lógica de negócio e validações.
  - `repository/users.repository.ts`: camada de persistência (Mongoose).
  - `schema/users.schema.ts`: definição do schema Mongoose.
  - `helpers/bcrypt.helper.ts`: wrapper para `bcrypt` (hash/compare).
  - `dto/`: DTOs (validação com `class-validator`).

**Observações e problemas conhecidos (importante)**
> Durante a análise encontrei inconsistências que podem quebrar a execução. Recomendo corrigir os itens abaixo.

1) **Inconsistência entre nomes de campos (schema vs DTOs)**
   - `src/users/schema/users.schema.ts` define os campos `nome`, `email`, `senha` (em português).
   - `src/users/dto/create-users.dto.ts` e controladores usam `name` e `password` (inglês).
   - Impacto: os dados enviados como `name`/`password` podem não ser salvos conforme esperado no schema atual.
   - Sugestão: alinhar para um padrão. Exemplo (preferível) — atualizar o schema para `name` e `password`:
     ```ts
     @Prop() name: string;
     @Prop() email: string;
     @Prop() password: string;
     ```

2) **Export / import do DTO**
   - `create-users.dto.ts` exporta a classe como `export default CreateUsersDto`.
   - `users.service.ts` faz `import { CreateUsersDto } from './dto/create-users.dto'` (import nomeado) — isso está incorreto.
   - Correção: preferir export nomeado no DTO (`export class CreateUsersDto {...}`) e usar `import { CreateUsersDto } ...` em todo o projeto, ou ajustar as importações para default.

3) **Erro de sintaxe em `users.repository.ts`**
   - Linha com `findByIdAndUpdate` apresenta sintaxe inválida:
     ```ts
     return this.usermodel.findByIdAndUpdate(id, data{
         new: true
     })
     ```
   - Deve ser corrigido para:
     ```ts
     return this.usermodel.findByIdAndUpdate(id, data, { new: true });
     ```

4) **Nomes de campos usados em código (service/controller)**
   - Em `users.service.ts` a propriedade `data.password` é usada, e o payload é gerado com `...data`. Por causa da inconsistência de nomes (ver item 1), o campo salvo pode ficar `password` enquanto o schema espera `senha`.

5) **Sugestão de melhorias (opcionais)**
   - Usar `ConfigModule` e variáveis de ambiente (`.env`) para `PORT` e `MONGODB_URI`.
   - Adicionar `ValidationPipe` global em `main.ts` para validar DTOs automaticamente:
     ```ts
     app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
     ```
   - Evitar export default em DTOs e preferir export nomeado para consistência e melhores autocompletions.
   - Adicionar `Dockerfile` e `docker-compose.yml` para facilitar o desenvolvimento com Mongo local.

**Segurança**
- A biblioteca `bcrypt` é usada (`helpers/bcrypt.helper.ts`) com salt `10`. Considere mover o número do salt para variável de ambiente se desejar configurabilidade.

**Como contribuir / próximos passos sugeridos**
- Corrigir as inconsistências listadas (schema, DTO export/import, bug no repository).
- Adicionar testes unitários cobrindo service e repository.
- Adicionar documentação de API (ex.: Postman collection ou OpenAPI/Swagger). Nest tem `@nestjs/swagger` para gerar docs automáticas.

**Contato / Autor**
- Projeto local do desenvolvedor.

Se desejar, eu posso:
- aplicar as correções de código (pequenas mudanças seguras como corrigir o `findByIdAndUpdate` e alinhar o DTO export/import),
- ou gerar uma coleção Postman / um arquivo `docs/` com exemplos de requests.

---
Gerado automaticamente — resumo da análise estática do projeto e instruções para usar e corrigir problemas detectados.
