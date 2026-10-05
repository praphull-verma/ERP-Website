# ERP API

ERP is a TypeScript/Express API backed by PostgreSQL and Prisma. It provides user authentication, cookie-based JWT sessions, media uploads to Cloudinary, and category management.

## Features

- User signup and login with bcrypt password hashing
- HTTP-only cookie authentication using JWTs
- Authenticated current-user endpoint
- Local multipart file handling with Multer
- Cloudinary media uploads
- Category creation with an associated image
- Category listing and name-based search
- Prisma migrations and generated Prisma Client

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL
- A Cloudinary account for media uploads

## Installation

```bash
npm install
```

Create a `.env` file in the project root:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
SECRET_KEY="replace-with-a-long-random-secret"
CLOUD_NAME="your-cloudinary-cloud-name"
CLOUD_API_KEY="your-cloudinary-api-key"
CLOUD_API_SECRET="your-cloudinary-api-secret"
```

Do not commit `.env` or expose `CLOUD_API_SECRET`, `SECRET_KEY`, or database credentials.

## Database setup

The Prisma schema is in [`prisma/schema.prisma`](./prisma/schema.prisma), and migrations are stored in [`prisma/migrations`](./prisma/migrations).

Apply existing migrations to a development database:

```bash
npx prisma migrate dev
```

Generate the Prisma Client after schema changes:

```bash
npx prisma generate
```

Validate the schema:

```bash
npx prisma validate
```

## Running the API

Start the development server:

```bash
npm run dev
```

Build the TypeScript source:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

The server listens on `http://localhost:3001`.

The configured CORS origin is `http://localhost:3000`, and credentials are enabled so a frontend can send the authentication cookie.

## API reference

Unless noted otherwise, request bodies use `Content-Type: application/json`.

### Sign up

`POST /signup`

Request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "a-secure-password"
}
```

The response contains the created user without its password. A JWT is also set in an HTTP-only `token` cookie.

### Log in

`POST /login`

Request:

```json
{
  "email": "jane@example.com",
  "password": "a-secure-password"
}
```

The response contains the authenticated user without its password, and the JWT is set in the `token` cookie.

### Get the current user

`GET /me`

Requires the `token` cookie created by `/signup` or `/login`.

### Upload media

`POST /upload`

Send a `multipart/form-data` request with:

- `file`: the file to upload
- `type`: one of `logo`, `profile`, `posts`, `documents`, or `category`

Example with cURL:

```bash
curl -X POST http://localhost:3001/upload ^
  -F "file=@C:\path\to\file.png" ^
  -F "type=profile"
```

The response includes the uploaded file URL and filename.

### Create a category

`POST /categories`

Send a `multipart/form-data` request with:

- `image`: the category image
- `name`: a non-empty category name
- `resourceCount`: a non-negative integer

Example with cURL:

```bash
curl -X POST http://localhost:3001/categories ^
  -F "image=@C:\path\to\category.png" ^
  -F "name=Technology" ^
  -F "resourceCount=12"
```

### List categories

`GET /categories`

Returns the available categories and their associated media where present.

### Search for a category

`GET /categories/search?name=Technology`

Returns the matching category or `404` when no category is found. The `name` query parameter is required.

## Data model

### `Users`

Stores the user identity, unique email address, bcrypt-hashed password, timestamps, and optional skill identifier.

### `Media`

Stores Cloudinary identifiers, URL, original filename, upload type, and timestamps. Upload types are `LOGO`, `PROFILE`, `POSTS`, `DOCUMENTS`, and `CATEGORY`.

### `Category`

Stores a unique category name, resource count, timestamps, and an optional one-to-one image relation through `imageId`.

## Project structure

```text
.
├── prisma/
│   ├── migrations/        Database migration history
│   └── schema.prisma      Prisma data model
├── src/
│   ├── app.ts             Express application and HTTP routes
│   ├── controllers/       Request controllers
│   ├── lib/               Prisma and JWT helpers
│   ├── middleware/        Authentication and multipart upload middleware
│   ├── routes/            Authentication, category, and media operations
│   ├── types/             Shared TypeScript types
│   ├── utils/              Cloudinary integration
│   └── validation/        Authentication input validation
├── generated/prisma/      Generated Prisma Client output
├── prisma.config.ts       Prisma CLI configuration
└── package.json           Scripts and dependencies
```

## File-by-file reference

This section explains the application-owned files. `node_modules/` contains installed third-party packages and should not be edited manually. `generated/prisma/` is produced by Prisma and is regenerated from `prisma/schema.prisma`.

### Root files

- [`package.json`](./package.json) — Defines the project metadata, ESM module setting, npm scripts, and runtime/development dependencies.
- [`package-lock.json`](./package-lock.json) — Locks the exact dependency versions installed by npm.
- [`tsconfig.json`](./tsconfig.json) — Configures TypeScript compilation, including the `dist` output directory, ES module settings, target version, and strict type checking.
- [`prisma.config.ts`](./prisma.config.ts) — Configures Prisma to use `prisma/schema.prisma`, store migrations in `prisma/migrations`, and read `DATABASE_URL` from the environment.
- [`.env`](./.env) — Local environment variables for the database, JWT signing key, and Cloudinary. This file must remain private and should not be committed.
- [`README.md`](./README.md) — Project setup, API usage, architecture, and file documentation.

### Application entry point

- [`src/app.ts`](./src/app.ts) — Creates and configures the Express server. It registers CORS, JSON parsing, cookies, category routing, authentication endpoints, `/me`, media upload, category creation, and the listener on port `3001`.
- [`src/index.ts`](./src/index.ts) — Currently contains no application logic. The active entry point is `src/app.ts`, as reflected by the `dev` and `start` scripts.

### Database and authentication libraries

- [`src/lib/prisma.ts`](./src/lib/prisma.ts) — Creates the Prisma PostgreSQL adapter using `DATABASE_URL`, constructs `PrismaClient`, and exports the shared `prisma` instance used by route and controller code.
- [`src/lib/auth/jwt.ts`](./src/lib/auth/jwt.ts) — Signs and verifies one-day JWTs using `SECRET_KEY`. The token payload contains a user ID and email.
- [`src/lib/auth/hash.ts`](./src/lib/auth/hash.ts) — Reserved for password-hashing helpers; it currently contains no implementation. Password hashing is currently performed directly with bcrypt in the signup route.

### Authentication routes and middleware

- [`src/routes/auth/signup.ts`](./src/routes/auth/signup.ts) — Validates signup input, checks for an existing email, hashes the password with bcrypt, creates a `Users` record, removes the password from the returned user, and creates a JWT.
- [`src/routes/auth/login.ts`](./src/routes/auth/login.ts) — Validates credentials, looks up the user by email, compares the submitted password with bcrypt, removes the password from the response, and creates a JWT.
- [`src/routes/auth/logout.ts`](./src/routes/auth/logout.ts) — Defines a logout handler that clears the `token` cookie. This module currently creates its own Express router/application and is not mounted by `src/app.ts`.
- [`src/middleware/requireAuth.ts`](./src/middleware/requireAuth.ts) — Reads the JWT from the `token` cookie, verifies it, attaches the payload to the request, and rejects missing or invalid tokens with `401`.
- [`src/validation/auth.ts`](./src/validation/auth.ts) — Provides signup and login validation, including required fields, basic email format validation, and the six-character minimum signup password length.

### Category and media modules

- [`src/controllers/getCategory.ts`](./src/controllers/getCategory.ts) — Handles `GET /categories` by querying categories ordered newest first and returning a JSON response.
- [`src/routes/categoryRoute.ts`](./src/routes/categoryRoute.ts) — Defines the `/categories` router. It connects the list endpoint and the `/search` endpoint.
- [`src/routes/category.ts`](./src/routes/category.ts) — Uploads a category image and creates a category record linked to the newly created media record.
- [`src/routes/searchCategory.ts`](./src/routes/searchCategory.ts) — Searches for the first category whose name matches the supplied value case-insensitively.
- [`src/routes/media/upload.ts`](./src/routes/media/upload.ts) — Uploads a temporary local file to Cloudinary, saves its identifiers and URL in the `Media` table, then deletes the temporary local file.
- [`src/middleware/multer.ts`](./src/middleware/multer.ts) — Configures Multer to save incoming multipart files in `public/tmp/uploads` with a timestamp and random suffix in the filename.
- [`src/utils/media-upload/cloudinaryUtil.ts`](./src/utils/media-upload/cloudinaryUtil.ts) — Configures Cloudinary from environment variables and uploads local files into a folder named after the upload type.

### Type declarations

- [`src/types/auth.d.ts`](./src/types/auth.d.ts) — Defines the `SignupInput` and `LoginInput` request shapes.
- [`src/types/authTokenPayload.ts`](./src/types/authTokenPayload.ts) — Defines the `id` and `email` fields stored in an authentication token.
- [`src/types/upload.types.ts`](./src/types/upload.types.ts) — Defines the accepted upload type strings: `logo`, `profile`, `posts`, `documents`, and `category`.

### Prisma files

- [`prisma/schema.prisma`](./prisma/schema.prisma) — Defines the PostgreSQL datasource, generated client location, `Users`, `Media`, and `Category` models, the `UploadType` enum, and the category-to-media relation.
- [`prisma/migrations/migration_lock.toml`](./prisma/migrations/migration_lock.toml) — Records the migration provider used by Prisma.
- [`prisma/migrations/20260804190859_init/migration.sql`](./prisma/migrations/20260804190859_init/migration.sql) — Creates the initial database structure.
- [`prisma/migrations/20260804201610_user_added/migration.sql`](./prisma/migrations/20260804201610_user_added/migration.sql) — Adds the user table changes from the user-model update.
- [`prisma/migrations/20260804203335_user_updated/migration.sql`](./prisma/migrations/20260804203335_user_updated/migration.sql) — Applies the subsequent user model update.
- [`prisma/migrations/20260804203822_email_unique_constraint/migration.sql`](./prisma/migrations/20260804203822_email_unique_constraint/migration.sql) — Adds the unique constraint for user email addresses.
- [`prisma/migrations/20260804212057_time_add/migration.sql`](./prisma/migrations/20260804212057_time_add/migration.sql) — Adds or updates timestamp fields in the user schema.
- [`prisma/migrations/20260806080634_update_user_fields/migration.sql`](./prisma/migrations/20260806080634_update_user_fields/migration.sql) — Applies the later user-field adjustments.
- [`prisma/migrations/20261001175808_add_media_upload/migration.sql`](./prisma/migrations/20261001175808_add_media_upload/migration.sql) — Adds the media upload table and upload-type support.
- [`prisma/migrations/20261001182505_add_category_media_relation/migration.sql`](./prisma/migrations/20261001182505_add_category_media_relation/migration.sql) — Adds the category image relation and its supporting constraint.

### Generated and temporary files

- [`generated/prisma/`](./generated/prisma/) — Generated Prisma Client code. Do not edit these files directly; run `npx prisma generate` after schema changes.
- [`dist/`](./dist/) — TypeScript build output. It is recreated by `npm run build`.
- [`public/tmp/uploads/`](./public/tmp/uploads/) — Temporary Multer upload storage. Files are normally removed after a successful Cloudinary upload.

## Development notes

- Passwords are never returned in API responses.
- Authentication tokens are stored in HTTP-only cookies.
- `secure` cookies are currently disabled for local HTTP development. Enable them when serving the API over HTTPS in production.
- The frontend origin is hard-coded to `http://localhost:3000` in `src/app.ts`; update the CORS configuration for another frontend host.
- The current `npm test` script is a placeholder and exits with an error. Add a test runner before relying on automated tests.

## License

This project currently declares the ISC license in `package.json`.
