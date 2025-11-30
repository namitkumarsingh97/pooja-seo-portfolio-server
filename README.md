# Pooja Portfolio API

REST API backing the blog/admin experience. Built with Express + Mongo + MVC.

## Setup

```bash
cd server
npm install
```

Create `.env` in this folder:

```
PORT=5000
MONGODB_URI=your-mongodb-uri
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=superSecretPassword
ADMIN_SESSION_TTL_MS=3600000
CORS_ALLOW_ORIGINS=http://localhost:5173
SERVICE_JWT_SECRET=superSecretServiceToken
```

- `MONGODB_URI` – Atlas or local Mongo connection string.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – used during admin login, but the resulting session is stored server-side as an HttpOnly cookie (`adminSession`).
- `ADMIN_SESSION_TTL_MS` – optional session expiry (defaults to 1 hour).
- `CORS_ALLOW_ORIGINS` – optional CSV of origins allowed to send credentialed requests in dev.
- `SERVICE_JWT_SECRET` – required only if you plan to call the API from other services using JWTs.

## Scripts

| Command        | Description                 |
|----------------|-----------------------------|
| `npm run dev`  | Start nodemon API           |
| `npm run start`| Start API without nodemon   |

## Architecture

- `src/config/db.js` – DB connection helper.
- `src/controllers/postController.js` – CRUD logic (includes admin listing + status normalization).
- `src/routes/posts.js` – REST routes + cookie/JWT auth guard.
- `src/routes/admin.js` – Login/logout/session plus admin-only helpers.
- `src/models/Post.js` – Mongoose schema with `status` (`draft`/`published`) and legacy `published` flag.
- `src/middleware/authGuards.js` – Validates admin sessions (HttpOnly cookies) or service JWTs.
- `src/utils/jwt.js` – Helpers to sign/verify service tokens with `SERVICE_JWT_SECRET`.

## Key Routes

| Method & Path                 | Description                                   | Auth                |
|------------------------------|-----------------------------------------------|---------------------|
| `POST /api/admin/login`      | Start an admin session (sets HttpOnly cookie) | none                |
| `POST /api/admin/logout`     | Revoke current admin session                  | admin cookie        |
| `GET /api/admin/session`     | Validate admin session / fetch profile        | admin cookie        |
| `GET /api/admin/posts`       | List every post (draft + published)           | admin cookie        |
| `GET /api/posts`             | Public posts (published only)                 | public              |
| `POST /api/posts`            | Create post                                   | admin cookie / JWT  |
| `PUT /api/posts/:id`         | Update post                                   | admin cookie / JWT  |
| `DELETE /api/posts/:id`      | Delete post                                   | admin cookie / JWT  |

## Deploying

1. Push this folder to your host (Render, Railway, etc.).
2. Set the same env vars (`PORT`, `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.).
3. Expose `/api/posts` publicly; admin writes rely on the HttpOnly cookie session, while automated services can attach a JWT in the `Authorization: Bearer <token>` header.

Once deployed, point the frontend’s `VITE_API_URL` at the hosted API.
