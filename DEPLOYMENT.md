# Backend Server Deployment Guide

This is the standalone backend server for the Pooja SEO Portfolio. Deploy this separately from the frontend.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example` if available, or create new):
   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ADMIN_SESSION_TTL_MS=3600000
   CORS_ALLOW_ORIGINS=https://pooja-seo-portfolio.vercel.app,http://localhost:5173
   SERVICE_JWT_SECRET=your-jwt-secret-key
   ```

3. **Run Locally**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production mode
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add all variables from `.env` file
   - Make sure to set `CORS_ALLOW_ORIGINS` to your frontend URL

4. **Create `vercel.json`** in the backend root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

### Option 2: Render / Railway / Other Platforms

1. Connect your GitHub repository
2. Set the root directory to this folder
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `.env`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5001) |
| `MONGODB_URI` | **Yes** | MongoDB connection string |
| `ADMIN_EMAIL` | **Yes** | Admin login email |
| `ADMIN_PASSWORD` | **Yes** | Admin login password |
| `ADMIN_SESSION_TTL_MS` | No | Session expiry in milliseconds (default: 3600000 = 1 hour) |
| `CORS_ALLOW_ORIGINS` | **Yes** | Comma-separated list of allowed frontend origins |
| `SERVICE_JWT_SECRET` | No | Secret for service-to-service JWT auth |

## API Endpoints

- `GET /` - Health check
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check admin session
- `GET /api/admin/posts` - Get all posts including drafts (admin only)

## After Deployment

1. **Get your backend URL** (e.g., `https://pooja-api.vercel.app`)

2. **Update Frontend Environment Variable**:
   - In your frontend Vercel project, add environment variable:
   - `VITE_API_URL=https://pooja-api.vercel.app`
   - (Replace with your actual backend URL)

3. **Test the connection**:
   - Visit `https://your-backend-url/api/posts` - should return posts
   - Visit `https://your-backend-url/` - should return status message

## Troubleshooting

- **CORS Errors**: Make sure `CORS_ALLOW_ORIGINS` includes your frontend URL
- **Database Connection**: Verify `MONGODB_URI` is correct and accessible
- **404 on Routes**: Ensure all routes start with `/api/` prefix

