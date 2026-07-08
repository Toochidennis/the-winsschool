# News Admin Backend Contract

This project currently includes the frontend screens only. The admin area uses mock login and browser storage so the interface can be reviewed.

Before production, connect the screens to a real backend. Frontend route guards are not security.

## Authentication

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET /api/admin/csrf-token`

Production authentication should use server-side sessions or secure HttpOnly cookies, SameSite protection, Origin/Referer checks, and CSRF validation for unsafe actions.

## Public news

- `GET /api/news`
- `GET /api/news/:slug`

Only published posts should be returned publicly.

## Admin news CRUD

- `GET /api/admin/news`
- `POST /api/admin/news`
- `GET /api/admin/news/:id`
- `PUT /api/admin/news/:id`
- `DELETE /api/admin/news/:id`
- `POST /api/admin/news/:id/publish`
- `POST /api/admin/news/:id/unpublish`

## Uploads

- `POST /api/admin/uploads`

For now, the frontend uses existing school images from the project. File upload should be added only when the backend is ready.
