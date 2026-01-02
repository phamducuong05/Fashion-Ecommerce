# serverTest

A small TypeScript + Express mock backend for the admin frontend.

- API base: `/api/admin/*`
- Data is read from `data/` JSON files (copied from the project's `admin-json-server/data`)

How to run:

1. cd serverTest
2. npm install
3. npm run dev

Notes:
- The project uses `ts-node-dev` for a quick dev experience.
- Add a `.env` file in this folder to configure DB/Neon credentials later. For local testing the JSON files are used.
- If you want to connect `serverTest` to your NeonDB (Postgres) instance, add a `.env` file with a `DATABASE_URL` value and then run Prisma generate.

Quick setup for NeonDB / Prisma (after you add `.env` with DATABASE_URL):

1. Install deps

```powershell
cd .\serverTest
npm install
```

2. Generate Prisma client

```powershell
npx prisma generate
```

3. (Optional) Seed the database using the included seed script

```powershell
npx prisma db seed --preview-feature
```

The `AdminDataService` will automatically use Prisma when `DATABASE_URL` is present; otherwise it falls back to the local `data/` JSON files.

Full seed: There's also a more comprehensive seed script (copied from the project's `/server`) that creates many products, variants, vouchers and orders. Run it with:

```powershell
npm run seed:full
```

Be careful: `seed:full` will delete existing data in your connected database (it mirrors the original project's seeding behavior). Use on a test database only.
