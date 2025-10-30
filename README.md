# My Personal Web – Back-end

Express + Bun + Prisma + Zod + Cloudinary API server.

## Features
- Auth: register, login, refresh, logout (JWT)
- Validation: Zod middleware (body/query/params)
- File upload: Multer (memory) + Cloudinary
- Rate limit: express-rate-limit (IPv6-safe)
- Prisma (MySQL): migrations and typed client
- Security: Helmet, CORS, trust proxy
- Centralized env validation with Zod

## Tech Stack
- Runtime: Bun
- Framework: Express
- DB: MySQL + Prisma
- Validation: Zod
- Upload: Multer + Cloudinary
- Security: Helmet, CORS
- Logger: morgan

## Prerequisites
- Bun installed
- MySQL running (local or Docker)
- Cloudinary account (optional in dev, required if using upload)

## Getting Started
1) Install dependencies
```bash
bun install
```

2) Create environment file
```bash
cp .env.example .env
```

3) Generate Prisma client and run migrations
```bash
bunx prisma generate
bunx prisma migrate dev --name init
```

4) Run in development
```bash
bun run dev

# Or

bun run src/index.ts
```

5) Run in production (example)
```bash
NODE_ENV=production TRUST_PROXY=1 bun run src/index.ts
```

## Environment Variables
- FRONTEND_URL: Allowed CORS origin (e.g. http://localhost:5173)
- PORT: Server port (default 4000)
- TRUST_PROXY: Number of proxy hops (1 for Nginx or Cloudflare; 2 for Cloudflare→Nginx)
- DATABASE_URL: MySQL connection string (e.g. mysql://user:pass@localhost:3307/my_db)
- JWT_SECRET: Long random string (>= 32 chars)
- CLOUDINARY_CLOUD_NAME: Cloudinary cloud name
- CLOUDINARY_API_KEY: Cloudinary API key
- CLOUDINARY_API_SECRET: Cloudinary API secret
- CLOUDINARY_FOLDER: Base folder for uploads (default: my-personal-web)

Tip: This project use config/env/env.ts for checking env by Zod and import env instead process.env

## Project Structure (partial)
```
src/
  index.ts
  config/
    cors.ts
    errorHandler.ts
    helmetOption.ts
    prismaClient.ts
    rateLimit.ts
    env/
      env.ts
    upload/
      cloudinary.ts
  middleware/
    authMiddleware.ts
    uploadMiddleware.ts
    validateMiddleware.ts
  routes/
    auth/ authRoutes.ts
    badgeRoutes.ts
    certRoutes.ts
    ...
  schemas/
    auth/authSchema.ts
    badgeSchema.ts
    certSchema.ts
    ...
  controllers/
  services/
  tests/
    common/         # unit tests
    integration/    # integration tests
  types/
```
## Testing
  Run tests
  ```bash
  bun test
  bun test --watch
  bun test --coverage
  ```

  Integration tests with DB
  ```bash
  export NODE_ENV=test
  export DATABASE_URL="mysql://user:pass@localhost:3307/my_personal_web_test"
  bunx prisma migrate deploy
  bun test src/tests/integration
  ```

## Testing Notes
- put unit tests in src/tests/common and integration at src/tests/integration
- don't commit .env.test (use .env.test.example instead)
- if rate limit have test config please change to NODE_ENV === 'test' in createApp

## API Endpoints (overview)
- Auth
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - POST /api/auth/refresh
- Badges
  - GET /api/badges
  - POST /api/badges (auth, multipart/form-data)
  - PATCH /api/badges/:id (auth, multipart/form-data)
  - DELETE /api/badges/:id (auth)
- Certifications
  - GET /api/certs
  - POST /api/certs (auth, multipart/form-data)
  - PATCH /api/certs/:id (auth, multipart/form-data)
  - DELETE /api/certs/:id (auth)

Optional:
- Health checks: GET /healthz, /readyz
- API Docs: Swagger UI at /api/docs 

## Development Notes
- Trust proxy: set app.set('trust proxy', TRUST_PROXY) for req.ip/req.secure is correct when stay back Nginx/Cloudflare
- Rate limit: use express-rate-limit v8 ipKeyGenerator for protect IPv6 bypass
- Validation: use Zod + validateMiddleware, and z.infer for DTO in controller
- Upload: call multer before validate for multipart/form-data

## Common Commands
```bash
# Prisma
bunx prisma generate
bunx prisma migrate dev --name <name>
bunx prisma studio

## Troubleshooting
- IPv6 rate limit error (ERR_ERL_KEY_GEN_IPV6):
  use ipKeyGenerator in keyGenerator (detail src/config/rateLimit.ts)
- JWT types missing:
  bun add jsonwebtoken && bun add -d @types/jsonwebtoken
- dotenv logs duplicated:
  use Bun do not call dotenv.config();

## License
- This project is licensed under a **Custom View-Only / Non-Commercial License**.  
- You may view and learn from the code, but **you may not use, modify, or distribute it** for commercial purposes without permission.

© 2025 Khattiya Thongnak
