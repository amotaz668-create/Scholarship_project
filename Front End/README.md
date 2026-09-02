# Scholarship Atlas Angular Frontend

## Structure

```text
src/app/
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
├── shared/components/
└── features/
    ├── auth/
    ├── public/
    ├── student/
    ├── employee/
    └── admin/
```

- `core`: API models, services, JWT interceptor and route guards.
- `shared/components`: reusable navigation, cards, progress, statuses, notifications and UI states.
- `features`: pages grouped by role and business feature.

The app uses standalone Angular components, lazy route loading, Signals, Reactive Forms and HttpClient.

## Run

```bash
npm install
npm start
```

The frontend expects the backend at `http://localhost:3000/api`. Update `src/environments/environment.ts` when using another API origin.

## Verify

```bash
npm run verify
```
