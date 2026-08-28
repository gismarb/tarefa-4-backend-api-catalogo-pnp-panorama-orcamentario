# API de Catálogo do Panorama Orçamentário da PNP

Este projeto foi desenvolvido como atividade avaliativa da disciplina de Tecnologias Back-End da Pós-Graduação em Desenvolvimento Web e Mobile do IF Sudeste MG.

A atividade propõe a criação de uma API back-end com Node.js, TypeScript, Express, PostgreSQL, Docker, Prisma e Insomnia. Em vez de utilizar um catálogo convencional de produtos, foi adotado um domínio relacionado ao projeto de TCC: um catálogo simplificado de indicadores do Panorama Orçamentário da Plataforma Nilo Peçanha (PNP).

A solução utiliza uma amostra consolidada de dados orçamentários para demonstrar o fluxo completo:

**cliente HTTP → API Express → Prisma ORM → PostgreSQL em container Docker**

---

## 1. Contexto da Atividade

A atividade solicita a implementação de uma API back-end capaz de persistir e consultar dados em um banco PostgreSQL.

Os principais requisitos são:

- projeto Node.js com TypeScript;
- servidor Express funcional;
- endpoint `GET /` para status da API;
- endpoint para listagem dos registros;
- endpoint para consulta por `id`;
- retorno HTTP `404` quando o registro não for encontrado;
- PostgreSQL 15 executado por Docker Compose;
- persistência do banco por volume Docker;
- Prisma ORM para modelagem, migrations, seed e consultas;
- uso de `Decimal` para valores monetários;
- Prisma Studio para inspeção da base;
- Insomnia para testes dos endpoints;
- documentação suficiente para permitir a execução do projeto em outra máquina.

O enunciado permite substituir o domínio "produto" por outro domínio análogo, especialmente quando relacionado ao TCC.

---

## 2. Relação com o TCC

Este projeto utiliza como domínio uma parte do contexto do TCC, atualmente direcionado à construção de um **portal Web para gestão de dados educacionais**, tendo a Plataforma Nilo Peçanha como uma das fontes de dados previstas.

Dentro desse contexto, o Panorama Orçamentário representa um conjunto de informações que pode ser utilizado futuramente em processos de:

- ingestão;
- tratamento;
- consolidação;
- persistência;
- análise;
- consulta;
- construção de indicadores;
- disponibilização por APIs;
- visualização em painéis.

A atividade não representa a arquitetura final do TCC. Ela funciona como um exercício isolado de back-end, persistência e disponibilização de dados por API REST.

---

## 3. Descrição da Solução Implementada

A solução implementada consiste em uma API de consulta de indicadores orçamentários da PNP.

O fluxo principal é:

```text
Insomnia / cliente HTTP -> Express + TypeScript -> Prisma Client -> @prisma/adapter-pg + pg -> PostgreSQL 15 Alpine -> Volume persistente Docker
```

A API disponibiliza:

- verificação de status;
- listagem dos indicadores cadastrados;
- consulta de indicador por `id`;
- validação de `id` numérico;
- resposta `404` para registro inexistente;
- tratamento básico de erro interno.

Os dados iniciais são carregados por seed e representam uma amostra consolidada do Panorama Orçamentário.

---

## 4. Tecnologias Utilizadas

| Tecnologia | Uso no projeto |
|---|---|
| Node.js | Ambiente de execução da aplicação back-end |
| TypeScript | Tipagem, organização e compilação do código |
| Express | Criação do servidor HTTP e definição das rotas REST |
| PostgreSQL 15 | Banco de dados relacional |
| PostgreSQL 15 Alpine | Imagem Docker utilizada para o banco |
| Docker | Execução isolada do PostgreSQL |
| Docker Compose | Definição e orquestração do serviço PostgreSQL |
| Prisma ORM 7.10 | Modelagem, migrations, seed e acesso tipado ao banco |
| Prisma Client | Consultas ao PostgreSQL a partir do TypeScript |
| `@prisma/adapter-pg` | Adapter requerido pelo Prisma 7 para conexão direta com PostgreSQL |
| `pg` | Driver PostgreSQL utilizado pelo adapter |
| dotenv | Leitura da variável `DATABASE_URL` |
| TSX | Execução de TypeScript em desenvolvimento e no seed |
| Prisma Studio | Inspeção visual dos dados persistidos |
| Insomnia | Testes manuais dos endpoints da API |
| Git | Versionamento local |
| GitHub | Hospedagem do código-fonte |

---

## 5. Requisitos da Atividade e Onde Foram Atendidos

| Requisito | Implementação |
|---|---|
| Node.js + TypeScript | `package.json`, `tsconfig.json` e arquivos em `src/` |
| Express funcional | `src/server.ts` |
| `GET /` | Rota de status em `src/server.ts` |
| Listagem dos registros | `GET /budget` |
| Consulta por `id` | `GET /budget/:id` |
| Retorno 404 | Tratamento da rota `GET /budget/:id` |
| Validação básica | Retorno `400` quando o `id` não é numérico |
| PostgreSQL 15 | Serviço `postgres` em `docker-compose.yml` |
| Docker Compose | `docker-compose.yml` |
| Porta do PostgreSQL | Mapeamento `5432:5432` |
| Persistência | Volume `postgres_data` |
| Prisma Schema | `prisma/schema.prisma` |
| Migration inicial | `prisma/migrations/` |
| Seed | `prisma/seed.ts` |
| Configuração Prisma | `prisma.config.ts` |
| Variável de ambiente | `.env` local e `.env.example` versionado |
| Decimal para valores monetários | `Decimal @db.Decimal(18, 2)` |
| Prisma Studio | Utilizado para validação dos registros |
| Insomnia | Coleção exportada em `insomnia/` |
| Build TypeScript | `npm run build` |
| Execução compilada | `npm start` |

---

## 6. Modelo de Dados

O modelo principal da aplicação é `BudgetIndicator`.

```prisma
model BudgetIndicator {
  id                Int      @id @default(autoincrement())
  year              Int
  institutionCode   String   @map("institution_code")
  institutionName   String   @map("institution_name")
  region            String
  state             String
  stateCode         String   @map("state_code")
  updatedBudget     Decimal  @map("updated_budget") @db.Decimal(18, 2)
  committedExpense  Decimal  @map("committed_expense") @db.Decimal(18, 2)
  liquidatedExpense Decimal  @map("liquidated_expense") @db.Decimal(18, 2)
  paidExpense       Decimal  @map("paid_expense") @db.Decimal(18, 2)
  availableCredit   Decimal  @map("available_credit") @db.Decimal(18, 2)
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("budget_indicators")
}
```

### 6.1. Convenção de nomes

Foi utilizada separação entre a nomenclatura da aplicação e a nomenclatura física do banco.

No TypeScript/Prisma é utilizado `camelCase`:

```text
institutionCode
updatedBudget
createdAt
```

No PostgreSQL é utilizado `snake_case`:

```text
institution_code
updated_budget
created_at
```

O mapeamento é realizado pelo Prisma com `@map`.

O nome do model também é separado do nome físico da tabela com:

```prisma
@@map("budget_indicators")
```

Dessa forma:

```text
Prisma / TypeScript: BudgetIndicator
PostgreSQL:          budget_indicators
```

Essa abordagem mantém uma convenção adequada para o código TypeScript sem exigir a mesma convenção de nomes na estrutura relacional.

### 6.2. Valores monetários

Os campos financeiros utilizam:

```prisma
Decimal @db.Decimal(18, 2)
```

No PostgreSQL, esses campos são criados como:

```text
numeric(18,2)
```

O tipo foi escolhido para evitar o uso de ponto flutuante em valores monetários.

No seed, os valores são fornecidos como strings numéricas:

```ts
updatedBudget: "416480326.62"
```

Essa escolha evita uma conversão intermediária pelo tipo `number` do JavaScript antes que o valor seja tratado pelo Prisma como decimal.

Por esse mesmo motivo, ao serializar o resultado da consulta em JSON, os valores `Decimal` podem aparecer como strings:

```json
{
  "updatedBudget": "416480326.62"
}
```

Isso não significa que a coluna seja textual. No PostgreSQL ela permanece armazenada como `numeric(18,2)`.

---

## 7. Origem e Preparação dos Dados

Os dados utilizados no seed foram obtidos a partir do arquivo `PanoramaOrcamentario.csv`, utilizado como fonte de trabalho desta atividade.

O arquivo original possui estrutura analítica e granularidade superior à necessária para um catálogo simples de API.

Para manter o projeto compatível com o objetivo acadêmico, foi criada uma amostra consolidada.

### 7.1. Critérios da amostra

Foram utilizados:

- ano de referência: **2025**;
- uma instituição de cada região do Brasil;
- registros relacionados a **Órgão da UO**;
- consolidação dos valores financeiros por instituição;
- cinco registros finais no seed.

As instituições utilizadas são:

| Região | Instituição | Código |
|---|---|---|
| Centro-Oeste | Instituto Federal de Brasília | IFB |
| Nordeste | Instituto Federal da Bahia | IFBA |
| Norte | Instituto Federal do Pará | IFPA |
| Sudeste | Instituto Federal do Sudeste de Minas Gerais | IF SUDESTE MG |
| Sul | Instituto Federal de Santa Catarina | IFSC |

A amostra não pretende reproduzir toda a granularidade analítica da fonte original. O objetivo é fornecer dados reais e coerentes para demonstrar persistência e consulta via API.

---

## 8. Estrutura Principal do Projeto

```text
tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario/
├── insomnia/
│   └── api-panorama-orcamentario-pnp.yaml
├── prisma/
│   ├── migrations/
│   │   └── 20260826220140_init/
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   └── prisma.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

> `node_modules/`, `dist/`, `.env` e `src/generated/` são artefatos locais ou gerados e não são versionados.

---

## 9. Arquivos Principais

### 9.1. `src/server.ts`

Responsável por:

- criar a aplicação Express;
- configurar `express.json()`;
- definir a porta `3001`;
- disponibilizar os endpoints;
- consultar o Prisma Client;
- tratar erros básicos;
- iniciar o servidor HTTP.

### 9.2. `src/lib/prisma.ts`

Centraliza a criação do Prisma Client.

O arquivo:

- carrega `DATABASE_URL`;
- cria o `PrismaPg`;
- utiliza `@prisma/adapter-pg`;
- cria uma instância reutilizável de `PrismaClient`.

A instância é importada pelas rotas em vez de criar um novo client a cada requisição.

### 9.3. `prisma/schema.prisma`

Define:

- provider PostgreSQL;
- geração do Prisma Client;
- model `BudgetIndicator`;
- tipos;
- precisão decimal;
- mapeamentos com `@map`;
- mapeamento da tabela com `@@map`.

### 9.4. `prisma/seed.ts`

Insere os cinco registros consolidados utilizados como amostra inicial.

### 9.5. `prisma.config.ts`

Centraliza configurações utilizadas pela CLI do Prisma 7:

- caminho do schema;
- diretório de migrations;
- comando de seed;
- leitura da `DATABASE_URL`.

### 9.6. `docker-compose.yml`

Define o serviço PostgreSQL utilizando:

```text
postgres:15-alpine
```

Também configura:

- usuário;
- senha;
- banco inicial;
- porta;
- volume persistente.

### 9.7. `insomnia/`

Contém a coleção exportada do Insomnia utilizada na validação manual da API.

---

## 10. Endpoints da API

A API utiliza por padrão:

```text
http://localhost:3001
```

### 10.1. Status

```http
GET /
```

Exemplo:

```json
{
  "status": "ok",
  "message": "API do Panorama Orçamentário da PNP em execução"
}
```

### 10.2. Listar indicadores

```http
GET /budget
```

Retorna todos os registros armazenados no banco.

### 10.3. Buscar indicador por ID

```http
GET /budget/1
```

Retorna um indicador específico.

### 10.4. ID inexistente

```http
GET /budget/99999
```

Retorno:

```json
{
  "error": "Indicador orçamentário não encontrado."
}
```

Status HTTP:

```text
404 Not Found
```

### 10.5. ID inválido

Exemplo:

```http
GET /budget/abc
```

Retorno:

```json
{
  "error": "O id informado deve ser numérico."
}
```

Status HTTP:

```text
400 Bad Request
```

---

## 11. Como Executar o Projeto do Zero

### 11.1. Pré-requisitos

É necessário possuir:

- Node.js;
- npm;
- Docker;
- Docker Compose.

O Prisma, TSX, TypeScript e demais dependências são instalados pelo `npm install`.

### 11.2. Clonar o repositório

```bash
git clone https://github.com/gismarb/tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario.git
```

### 11.3. Entrar no diretório

```bash
cd tarefa-4-backend-api-catalogo-pnp-panorama-orcamentario
```

### 11.4. Instalar as dependências

```bash
npm install
```

### 11.5. Criar o arquivo de ambiente

Copiar o arquivo de exemplo:

```bash
cp .env.example .env
```

O valor utilizado no ambiente local é:

```env
DATABASE_URL="postgresql://pnp_user:pnp_password@localhost:5432/pnp_panorama?schema=public"
```

O `.env` real não é versionado.

### 11.6. Subir o PostgreSQL

```bash
docker compose up -d
```

Validar:

```bash
docker compose ps
```

### 11.7. Gerar o Prisma Client

```bash
npx prisma generate
```

O client é gerado em:

```text
src/generated/prisma/
```

### 11.8. Aplicar as migrations

Como a migration inicial já é versionada no projeto, para reproduzir o banco pode ser utilizado:

```bash
npx prisma migrate deploy
```

Durante o desenvolvimento de novas alterações de schema pode ser utilizado:

```bash
npm run prisma:migrate -- --name nome_da_migration
```

A migration inicial deste projeto foi criada originalmente com:

```bash
npx prisma migrate dev --name init
```

### 11.9. Popular o banco

Pode ser utilizado o script npm:

```bash
npm run seed
```

ou o comando do Prisma:

```bash
npx prisma db seed
```

### 11.10. Conferir os dados com Prisma Studio

```bash
npx prisma studio
```

O model `BudgetIndicator` deve apresentar os cinco registros da amostra.

### 11.11. Executar a API em desenvolvimento

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3001
```

---

## 12. Scripts Disponíveis

| Script | Função |
|---|---|
| `npm run dev` | Executa o servidor com TSX em modo watch |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa a versão JavaScript compilada |
| `npm run seed` | Executa `prisma/seed.ts` |
| `npm run prisma:migrate -- --name <nome>` | Cria/aplica migration em desenvolvimento |

Comandos Prisma utilizados diretamente:

```bash
npx prisma generate
npx prisma validate
npx prisma format
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma db seed
npx prisma studio
```

---

## 13. Build e Execução Compilada

Para validar a compilação TypeScript:

```bash
npm run build
```

Os arquivos JavaScript são gerados em:

```text
dist/
```

Para executar a aplicação compilada:

```bash
npm start
```

O fluxo fica:

```text
src/*.ts -> npm run build -> dist/*.js -> npm start -> Node.js
```

---

## 14. Testes com Insomnia

Foi criado um projeto/coleção no Insomnia contendo as principais requisições da API.

Requisições utilizadas:

```text
GET http://localhost:3001/
GET http://localhost:3001/budget
GET http://localhost:3001/budget/1
GET http://localhost:3001/budget/99999
```

A coleção exportada está disponível em:

```text
insomnia/api-panorama-orcamentario-pnp.yaml
```

O arquivo pode ser importado pelo Insomnia para recriar as requisições utilizadas durante a validação.

---

## 15. Validações Realizadas

Durante o desenvolvimento foram validados:

### Docker/PostgreSQL

```bash
docker compose ps
```

A estrutura do banco também foi consultada diretamente com `psql`.

Tabelas verificadas:

```text
_prisma_migrations
budget_indicators
```

### Prisma

Foram executados:

```bash
npx prisma validate
npx prisma format
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

### API

Foram validados:

```text
GET /
GET /budget
GET /budget/1
GET /budget/99999
```

### Build

Foi validado:

```bash
npm run build
npm start
```

---

## 16. Decisões de Desenvolvimento

### 16.1. Uso da porta 3001

A API utiliza a porta:

```text
3001
```

A decisão segue a organização apresentada em aula, deixando a porta `3000` disponível para uma futura aplicação front-end.

Mesmo que esta atividade seja exclusivamente back-end, a separação evita conflito caso um cliente Web seja integrado posteriormente.

### 16.2. PostgreSQL 15 Alpine

O enunciado solicita PostgreSQL 15.

Foi utilizada a imagem:

```text
postgres:15-alpine
```

Ela mantém a versão principal solicitada e utiliza uma base Alpine mais enxuta (também utilizado e/ou apresentado em aula).

### 16.3. Prisma 7.10.0

Durante a configuração inicial, o gerenciador instalou uma versão `8.0.0-rc`, enquanto o `@prisma/client` estava em outra versão.

Para evitar utilizar uma release candidate e manter CLI e Client compatíveis, ambos foram fixados em:

```text
Prisma CLI:     7.10.0
Prisma Client:  7.10.0
```

Essa decisão também permitiu utilizar um fluxo estável de:

```text
schema
migration
generate
seed
studio
```

### 16.4. Diferença entre Prisma 6 da aula e Prisma 7 do projeto

O material da aula foi construído com uma versão anterior do Prisma.

No Prisma utilizado neste projeto, algumas configurações passaram a ser centralizadas em:

```text
prisma.config.ts
```

Por isso o seed é declarado em:

```ts
migrations: {
  path: "prisma/migrations",
  seed: "tsx prisma/seed.ts",
}
```

Foi mantido também o script:

```json
"seed": "tsx prisma/seed.ts"
```

no `package.json`, permitindo executar o seed diretamente com:

```bash
npm run seed
```

Essa combinação mantém praticidade semelhante à aula sem abandonar a configuração prevista pela versão utilizada.

### 16.5. Driver adapter do Prisma 7

O Prisma 7 exige driver adapter para conexões diretas.

Para PostgreSQL foram utilizados:

```text
@prisma/adapter-pg
pg
```

A configuração é centralizada em:

```text
src/lib/prisma.ts
```

### 16.6. Prisma Client gerado dentro de `src/`

Inicialmente o client havia sido gerado em:

```text
generated/prisma/
```

Durante o teste com:

```bash
npm run build
```

o TypeScript informou que esse código estava fora de:

```json
"rootDir": "./src"
```

Como os arquivos gerados participam da compilação, o output foi alterado para:

```prisma
output = "../src/generated/prisma"
```

Essa decisão mantém todos os arquivos TypeScript necessários ao build dentro do `rootDir`.

O diretório gerado continua fora do Git, pois pode ser recriado com:

```bash
npx prisma generate
```

### 16.7. Uso de `@map` e `@@map`

Foi mantida a convenção:

```text
TypeScript / Prisma -> camelCase
PostgreSQL          -> snake_case
```

Exemplo:

```text
institutionCode -> institution_code
updatedBudget   -> updated_budget
```

O model:

```text
BudgetIndicator
```

é armazenado na tabela:

```text
budget_indicators
```

### 16.8. Uso de Decimal

Valores financeiros foram definidos como:

```text
Decimal(18,2)
```

em vez de `Float` ou `Double`.

A decisão segue o requisito da atividade e evita utilizar tipos de ponto flutuante para valores monetários.

### 16.9. Valores decimais no seed como string

O Prisma aceita valores compatíveis com Decimal, mas nesta aplicação os valores monetários foram declarados como strings:

```ts
paidExpense: "344492173.07"
```

O objetivo é preservar a representação decimal antes da conversão pelo Prisma, principalmente porque os valores orçamentários utilizados são elevados.

### 16.10. Apenas endpoints GET

A atividade define `POST`, `PUT` e `DELETE` como opcionais.

Neste projeto os dados representam uma amostra de uma fonte analítica externa. Por esse motivo, o foco foi mantido na carga por seed e na consulta.

Foram implementados somente:

```text
GET /
GET /budget
GET /budget/:id
```

Essa decisão foi tomada para, inicialmente, reduzir a complexidade mas, sem remover requisitos obrigatórios.

### 16.11. Tratamento adicional de ID inválido

Além do `404` solicitado, foi implementada validação para IDs não numéricos.

Exemplo:

```text
GET /budget/abc
```

retorna HTTP `400`.

### 16.12. `.env` e `.env.example`

O `.env` contém a configuração local utilizada pela aplicação e não é versionado.

O `.env.example` é versionado para documentar quais variáveis devem ser configuradas por quem clonar o projeto.

---

## 17. Relação com a Aula

O projeto mantém o fluxo conceitual trabalhado na aula:

```text
PostgreSQL -> Docker Compose -> Prisma Schema -> Migration -> Seed -> Prisma Studio -> Prisma Client -> Node.js / TypeScript / Express
```

Os principais conceitos aplicados foram:

- criação do PostgreSQL com Docker Compose;
- uso de volume persistente;
- configuração da `DATABASE_URL`;
- definição do schema Prisma;
- mapeamento entre nomes da aplicação e nomes do banco;
- uso de Decimal para valores monetários;
- criação e aplicação de migration;
- população inicial por seed;
- inspeção com Prisma Studio;
- acesso ao banco através de Prisma Client;
- integração do banco com uma API Express;
- testes das rotas com Insomnia.

As diferenças de implementação existentes em relação ao repositório da aula decorrem principalmente da versão do Prisma utilizada e das características do domínio financeiro adotado.

---

## 18. Segurança e Arquivos Não Versionados

O `.gitignore` evita o versionamento de:

```text
node_modules/
dist/
.env
src/generated/
```

### `node_modules/`

É recriado por:

```bash
npm install
```

### `dist/`

É recriado por:

```bash
npm run build
```

### `.env`

Contém configuração local e deve ser recriado a partir de:

```text
.env.example
```

### `src/generated/`

Contém o Prisma Client gerado automaticamente por:

```bash
npx prisma generate
```

---

## 19. Observação sobre o Projeto de TCC

Esta API não representa a implementação final do TCC.

Ela funciona como um experimento acadêmico que aplica conceitos de back-end a um domínio relacionado ao projeto maior.

Uma arquitetura futura poderá incluir, entre outros recursos:

- ingestão automatizada de dados da PNP;
- outras fontes educacionais;
- pipelines de tratamento e consolidação;
- persistência de conjuntos completos;
- autenticação e autorização;
- filtros;
- consultas analíticas;
- dashboards;
- exportação;
- diferentes perfis de acesso;
- API organizada em camadas ou módulos;
- infraestrutura conteinerizada com múltiplos serviços.

Essas possibilidades não fazem parte do escopo desta atividade.

---

## 20. Autor

**Gismar Pereira Barbosa**

Pós-Graduação em Desenvolvimento Web e Mobile  
IF Sudeste MG

GitHub: https://github.com/gismarb

---

## 21. Referências Técnicas

As decisões e comandos utilizados no projeto foram baseados no material da disciplina e em documentação técnica oficial.

### Material da disciplina

- Repositório da Aula 2 - Tecnologias Back-End:  
  https://github.com/lucaslattari/tec_back_end_aula2

- Vídeo da Aula 2 - Banco de Dados no Back-End, PostgreSQL com Docker e Prisma:  
  https://youtu.be/0izh2dNN444

### Node.js

- Node.js Documentation:  
  https://nodejs.org/docs/latest/api/

- ECMAScript Modules:  
  https://nodejs.org/api/esm.html

A configuração:

```json
"type": "module"
```

segue o mecanismo documentado pelo Node.js para marcar arquivos JavaScript como ECMAScript Modules.

### TypeScript

- TypeScript Documentation:  
  https://www.typescriptlang.org/docs/

- TSConfig Reference:  
  https://www.typescriptlang.org/tsconfig/

- `rootDir`:  
  https://www.typescriptlang.org/tsconfig/rootDir.html

A alteração do output do Prisma Client para dentro de `src/` foi motivada pela regra do `rootDir`, que exige que arquivos TypeScript necessários à emissão estejam dentro da raiz configurada para compilação.

### Express

- Express Documentation:  
  https://expressjs.com/

- Routing:  
  https://expressjs.com/en/guide/routing.html

A definição das rotas `GET` segue o mecanismo `app.METHOD(PATH, HANDLER)` documentado pelo Express.

### Docker

- Docker Documentation:  
  https://docs.docker.com/

- Docker Compose:  
  https://docs.docker.com/compose/

- Docker Hub - PostgreSQL:  
  https://hub.docker.com/_/postgres

A infraestrutura local do banco foi declarada com Docker Compose para permitir que o ambiente possa ser recriado de maneira padronizada.

### PostgreSQL

- PostgreSQL Documentation:  
  https://www.postgresql.org/docs/15/

- Numeric Types:  
  https://www.postgresql.org/docs/15/datatype-numeric.html

A documentação do PostgreSQL diferencia tipos exatos, como `numeric`, de tipos de precisão inexata, como `real` e `double precision`. Essa característica fundamenta o uso de `numeric(18,2)` para os valores financeiros da atividade.

### Prisma ORM

- Prisma ORM Documentation:  
  https://www.prisma.io/docs/

- Prisma ORM 7:  
  https://www.prisma.io/docs/orm/v7

- PostgreSQL Quickstart - Prisma 7:  
  https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql

- Upgrade to Prisma ORM 7:  
  https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7

- Prisma Migrate:  
  https://www.prisma.io/docs/orm/prisma-migrate

- Seeding:  
  https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

- Database mapping (`@map` / `@@map`):  
  https://www.prisma.io/docs/orm/prisma-schema/data-model/database-mapping

A documentação do Prisma 7 foi utilizada especialmente para:

- configuração de `prisma.config.ts`;
- geração do Prisma Client;
- uso de `@prisma/adapter-pg`;
- conexão através do driver `pg`;
- migrations;
- seed;
- mapeamento de campos;
- customização do caminho de geração do Client.

### Insomnia

- Insomnia Documentation:  
  https://developer.konghq.com/insomnia/

- Import and Export:  
  https://developer.konghq.com/insomnia/import-export/

A coleção utilizada nos testes foi exportada em formato compatível com o Insomnia para permitir sua importação e reutilização.

---

## 22. Licença

A licença do projeto é definida pelo arquivo [`LICENSE`](LICENSE) presente no repositório.
