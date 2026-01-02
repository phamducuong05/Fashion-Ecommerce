# Fashion-Ecommerce 
Merge version of admin backend and user backend.

- Read Note-Schema.md and Note-Merge.md for more detail.

- Quick setup:
```sh
.env: PORT="4000" (backend default port)
      DATABASE_URL="..."

cd server
npm install
npx prisma generate
npm run dev
```


+ Test admin:
```sh
cd admin
npm install && npm run dev
```

+ Test client:
```sh
cd client
npm install && npm run dev
```