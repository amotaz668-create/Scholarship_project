# Scholarship Atlas

Scholarship Atlas is a complete MEAN Stack scholarship management system with an Opportunity Passport experience for students and management workspaces for employees and admins.

## Project folders

- `FrontEnd/`: Angular standalone application.
- `BackEnd/`: Express, MongoDB and JWT API.
- `postman/`: API collections and local environment examples.
- `API_MAP.md`: exact frontend-to-backend endpoint map.

## First setup

1. Install Node.js 20 or newer and MongoDB, or use a MongoDB Atlas connection.
2. Copy `BackEnd/.env.example` to `BackEnd/.env`.
3. Set `MONGODBURL` and `JWT_SECRET` in `BackEnd/.env`.
4. From the project root run:

```bash
npm run install:all
npm run dev
```

The API runs on `http://localhost:3000` and Angular runs on `http://localhost:4200`.

## Useful commands

```bash
npm run dev
npm run verify
npm run seed:scholarships
```

`npm run dev` starts the backend and frontend together. Use `Ctrl+C` to stop both.

## Accounts and roles

- Public registration always creates a `student`.
- An `admin` creates employee/admin accounts from Admin → Users.
- Students use Atlas, Saved, Applications, Notifications and Opportunity Passport.
- Employees manage the scholarship catalog and review an application by ID using the currently exposed API.
- Admins manage scholarships, applications and users and can view statistics and audit logs.

## Real scholarship data

`BackEnd/seed/scholarships.seed.js` contains the researched scholarship catalogue and official provider links. Run the seed only after MongoDB is configured. The seed uses upserts and does not delete existing records.

## Notes

- The frontend uses the backend routes as the source of truth.
- No fake employee assignment endpoint or match-score endpoint is used.
- Change `FrontEnd/src/environments/environment.ts` if the API is not running on port `3000`.
- Never commit `BackEnd/.env`.
