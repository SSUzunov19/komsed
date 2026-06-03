# 🧸 КОМСЕД — Web (Next.js + Neon + Vercel)

Продукшън версия на КОМСЕД: пълнофункционален уеб магазин-административен панел с **реална** база данни, реални SQL заявки и persistence — хостваем безплатно на Vercel.

Това е модерна реимплементация на оригиналното Flask + DB2 приложение (което остава в основната папка на repo-то). Архитектурата е същата (релационна база, CRUD, SQL конзола), но базата е cloud Postgres (**Neon**) вместо университетския DB2, за да може да се хоства.

## Стек

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Neon** — serverless PostgreSQL
- **Vercel** — хостинг (auto-deploy от Git)

## Функционалност

- 📊 Начален панел със статистики (Server Components, реални `COUNT` заявки)
- 📦 Продукти — списък, добавяне и изтриване (Server Actions, запис в базата)
- 🗂️ Категории — йерархия + брой продукти
- 👤 Клиенти — списък + добавяне
- 🛒 Поръчки — списък и детайл с артикулите
- 🏷️ Промоции — активни/изтекли
- 💻 SQL конзола — изпълнява реални `SELECT` заявки (мутиращите са блокирани)

## Локално стартиране

```bash
cd web
npm install

# 1. Създай безплатна база в Neon → https://neon.tech
#    Копирай "Pooled" connection string.
cp .env.example .env.local
# Постави го в .env.local като DATABASE_URL=...

# 2. Създай схемата и зареди примерните данни
npm run db:setup

# 3. Стартирай dev сървъра
npm run dev
```

Отвори <http://localhost:3000>.

## Качване в production (Vercel)

1. **Neon база** — създай проект в <https://neon.tech> и вземи pooled connection string.
2. **Push на repo-то** в GitHub.
3. **Vercel** → *Add New Project* → избери repo-то.
   - **Root Directory: `web`** ⚠️ (важно — приложението е в подпапка)
   - Framework: Next.js (засича се автоматично)
   - **Environment Variables** → добави `DATABASE_URL` = connection string-а от Neon
4. **Deploy.**
5. Еднократно инициализирай базата (от твоя компютър, със същия `DATABASE_URL` в `.env.local`):
   ```bash
   npm run db:setup
   ```
   (Или изпълни `db/schema.sql` + `db/seed.sql` през Neon SQL Editor.)

Всеки следващ `git push` прави автоматичен re-deploy.

## Структура

```
web/
├── db/
│   ├── schema.sql        # Postgres DDL (мигрирана от DB2)
│   └── seed.sql          # примерни данни (INSERT/UPDATE/DELETE)
├── scripts/
│   └── setup-db.mjs      # създава схемата + зарежда данните
└── src/
    ├── lib/
    │   ├── db.ts         # Neon клиент
    │   └── format.ts     # форматиране (валута, дати, статуси)
    ├── components/
    │   ├── Navbar.tsx
    │   └── ui.tsx        # Card, Badge, PageHeader...
    └── app/
        ├── page.tsx              # начален панел
        ├── products/             # списък + actions + /new
        ├── categories/
        ├── customers/            # списък + actions + /new
        ├── orders/               # списък + /[id] детайл
        ├── promotions/
        └── sql/                  # SQL конзола (actions)
```

## Бележки по сигурността

- SQL конзолата приема **само** `SELECT`/`WITH` заявки; INSERT/UPDATE/DELETE/DDL са блокирани.
- Всички параметри в заявките минават през placeholder-и (`$1, $2…`) — защита срещу SQL injection.
- `DATABASE_URL` никога не се качва в Git (`.env.local` е в `.gitignore`).
