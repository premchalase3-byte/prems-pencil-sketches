# PREM'S Pencil Sketches — Order Tracking Foundation

This is the first backend implementation layer for the existing Next.js website.

## Included in this phase

- MongoDB connection utility with connection caching for serverless deployments.
- Mongoose order and audit-log models.
- The 13 agreed artwork/order stages.
- Random tracking-code generation and SHA-256 code hashing.
- Admin login, logout and session-check API routes.
- Admin-only order creation and order-list API routes.
- Public tracking lookup API that returns a deliberately limited customer-safe DTO.
- Initial admin login page.

## 1. Install dependencies

Run this from the project root:

```bash
npm install mongoose bcryptjs jose zod
```

This also refreshes `package-lock.json` for your local npm environment.

## 2. Create MongoDB Atlas database

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with a strong password.
3. Configure Atlas Network Access for your deployment and development environment.
4. Copy the application connection string.
5. Replace the placeholders in `.env.local`.

Do not commit `.env.local` or share the connection string.

## 3. Configure environment variables

Copy `.env.example` to `.env.local`.

Generate a password hash:

```bash
node -e "require('bcryptjs').hash('REPLACE_WITH_A_STRONG_PASSWORD', 12).then(console.log)"
```

Generate a session secret:

```bash
openssl rand -base64 32
```

Set the resulting values in `.env.local`:

```env
MONGODB_URI=mongodb+srv://...
ADMIN_USERNAME=your-private-admin-username
ADMIN_PASSWORD_HASH=your-bcrypt-hash
SESSION_SECRET=your-generated-random-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use a different strong admin password and session secret in production. Add the production values to Vercel Environment Variables.

## 4. Start the application

```bash
npm run dev
```

Open:

- Public website: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

The admin dashboard and order-management UI are the next implementation phase.

## 5. API endpoints available in this foundation

### Admin authentication

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Login JSON:

```json
{
  "username": "your-admin-username",
  "password": "your-admin-password"
}
```

### Admin orders

- `GET /api/admin/orders` — requires admin session.
- `POST /api/admin/orders` — requires admin session.

Example create-order JSON:

```json
{
  "customerName": "Rahul",
  "customerPhone": "98XXXXXXXX",
  "artworkType": "Portrait Sketch",
  "artworkSize": "A4",
  "artworkDescription": "Single-person portrait",
  "totalAmount": 1500,
  "advancePaid": 500,
  "estimatedDelivery": "2026-11-16T12:00:00.000Z",
  "internalNotes": "Keep the background simple."
}
```

The successful response includes the one-time tracking code. Copy and send it to the customer; the original code is not stored in the database.

### Public tracking

- `POST /api/track`

Request JSON:

```json
{
  "code": "PREM-XXXX-XXXX-XXXX"
}
```

The response intentionally excludes customer phone numbers, internal notes, database identifiers and tracking-code hashes.

## Security notes

- The tracking code is a bearer secret: anyone who has it can view the limited public order information. Send it only to the intended customer.
- Tracking codes are stored as SHA-256 hashes and generated using Node.js cryptographic randomness.
- Admin sessions use signed JWTs in HttpOnly, Secure-in-production, SameSite=Strict cookies.
- Admin API routes verify the session server-side.
- Never expose `MONGODB_URI`, `ADMIN_PASSWORD_HASH`, or `SESSION_SECRET` through `NEXT_PUBLIC_` variables.
- Before production launch, add distributed rate limiting to public tracking lookups and login attempts, CSRF/origin checks for state-changing requests, and operational monitoring. The current foundation does not yet claim those protections are implemented.
- The admin dashboard and stage-update endpoints are not complete in this phase.
