# NTI Scholarship Management System - Backend

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODBURL` and `JWT_SECRET`.
3. Run `npm install`.
4. Start the API with `npm start`.

## Roles

- `student`: normal read access and public eligibility checking. Public scholarship browsing exposes published scholarships only.
- `employee`: full CRUD access to categories, countries, universities, and scholarships.
- `admin`: same resource-management permissions as employee.

Public registration always creates a `student` and rejects a supplied role. An admin can create employee/admin accounts through `POST /api/users/staff`. For trusted local/test setup, create an employee/admin directly with:

```bash
npm run create:staff -- employee employee@example.com StrongPassword123
npm run create:staff -- admin admin@example.com StrongPassword123
```

The staff script updates or creates the requested staff account in the configured database and is intended for trusted/local/admin setup only.

## Real scholarship catalogue

The researched catalogue is in `seed/scholarships.seed.js`. It contains the 15 programmes supplied for the project, with official application links, eligibility notes and document checklists. Run the idempotent seed after configuring MongoDB:

```bash
npm run seed:scholarships
```

Records marked `draft` use a historical or expected annual window and must be checked against the official portal before publishing. Records marked `published` have a currently announced deadline in the seed's verification window. The seed updates matching titles and does not delete existing records.

## Scholarship visibility

Unauthenticated users and students can only see `published` scholarships, including when using filters or fetching a scholarship by ID. Employee and admin users can view all supported statuses.

## Security

Never commit `.env`, real MongoDB connection strings, or JWT secrets. Use `.env.example` as the template.
