<div align="center">
  <img src="Front%20End/public/logo.png" alt="Scholarship Atlas Logo" width="110">

  <h1>Scholarship Atlas</h1>

  <h3>Discover opportunities. Build your passport. Track every application.</h3>

  <p>
    A full-stack scholarship management platform connecting students,
    employees, and administrators through one complete application journey.
  </p>

  <p>
    <a href="https://github.com/amotaz668-create/Scholarship_project">
      <strong>GitHub Repository</strong>
    </a>
    ·
    <a href="API_MAP.md">
      <strong>API Documentation</strong>
    </a>
    ·
    <a href="#getting-started">
      <strong>Getting Started</strong>
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Angular-22.1-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
    <img src="https://img.shields.io/badge/Node.js-24.15-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  </p>
</div>

---

## Overview

**Scholarship Atlas** is a full-stack scholarship management system developed as an NTI MEAN Stack final project.

The platform provides a complete scholarship journey where:

- Students discover scholarships, prepare their profiles, upload documents, submit applications, and track application decisions.
- Employees manage scholarship data and review assigned applications.
- Administrators manage users, scholarships, applications, statistics, notifications, and administrative logs.

The Angular frontend communicates with the Express REST API as its source of truth. Authentication is handled using JSON Web Tokens, while role-based authorization protects both frontend routes and backend endpoints.

---

## Table of Contents

- [Key Features](#key-features)
- [Roles and Permissions](#roles-and-permissions)
- [Application Workflow](#application-workflow)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [API Overview](#api-overview)
- [Available Commands](#available-commands)
- [Deployment](#deployment)
- [Security](#security)
- [Production Considerations](#production-considerations)
- [Roadmap](#roadmap)
- [Contributors](#contributors)

---

## Key Features

### Student Features

- Create a student account and securely log in.
- Browse all published scholarships.
- Search scholarships by name or provider.
- Filter scholarships by:
  - Country
  - University
  - Field
  - Funding type
  - Degree
  - Deadline
- Explore scholarship destinations using an interactive world map.
- View complete scholarship details.
- Check scholarship eligibility.
- Save scholarships for later.
- Build and update an Opportunity Passport.
- Manage academic, personal, language, and destination information.
- Upload PDF, JPG, and PNG documents.
- Create and update draft applications.
- Review application information before submission.
- Submit completed applications.
- Withdraw eligible applications.
- Fix applications with missing documents.
- Track every application status.
- View application progress and timeline.
- Receive application notifications.
- Mark notifications as read.
- Delete personal notifications.
- Switch between English and Arabic.
- Switch between dark and light themes.
- Use the platform on desktop, tablet, and mobile devices.

### Employee Features

- Access a protected employee dashboard.
- Create new scholarships.
- Update existing scholarships.
- Manage countries.
- Manage universities.
- Manage scholarship categories.
- View applications assigned to the employee.
- Open complete application details.
- View authorized student documents.
- Move applications through allowed review statuses.
- Add review notes to the application timeline.
- Request missing documents.
- Accept or reject reviewed applications.

### Administrator Features

- Access an administrator-only dashboard.
- View totals for:
  - Users
  - Students
  - Employees
  - Scholarships
  - Applications
- View application statistics.
- View scholarships grouped by degree.
- View employee workloads.
- Manage all scholarships.
- Publish or close scholarship opportunities.
- View and manage all applications.
- Apply controlled application status transitions.
- Search and filter users.
- Edit user information.
- Activate or deactivate user accounts.
- Delete eligible users.
- Create employee and administrator accounts.
- View administrative activity logs.
- View platform notifications.

---

## Roles and Permissions

| Capability | Guest | Student | Employee | Admin |
| --- | :---: | :---: | :---: | :---: |
| Browse published scholarships | ✅ | ✅ | ✅ | ✅ |
| View scholarship details | ✅ | ✅ | ✅ | ✅ |
| Check scholarship eligibility | ✅ | ✅ | ✅ | ✅ |
| Create an account | ✅ | — | — | — |
| Manage Opportunity Passport | ❌ | ✅ | ❌ | ❌ |
| Save scholarships | ❌ | ✅ | ❌ | ❌ |
| Upload personal documents | ❌ | ✅ | ❌ | ❌ |
| Create applications | ❌ | ✅ | ❌ | ❌ |
| Submit applications | ❌ | ✅ | ❌ | ❌ |
| Track application status | ❌ | ✅ | ❌ | ❌ |
| Review assigned applications | ❌ | ❌ | ✅ | ✅ |
| Manage scholarship reference data | ❌ | ❌ | ✅ | ✅ |
| Create and update scholarships | ❌ | ❌ | ✅ | ✅ |
| Delete scholarships | ❌ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Create staff accounts | ❌ | ❌ | ❌ | ✅ |
| View statistics | ❌ | ❌ | ❌ | ✅ |
| View admin logs | ❌ | ❌ | ❌ | ✅ |

> Public registration always creates a `student` account. Employee and administrator accounts can only be created through trusted administrative operations.

---

## Application Workflow

```mermaid
stateDiagram-v2
    [*] --> draft

    draft --> submitted: Student submits
    draft --> withdrawn: Student withdraws

    submitted --> under_review: Staff starts review
    submitted --> withdrawn: Student withdraws

    under_review --> missing_documents: Staff requests documents
    missing_documents --> under_review: Student updates application

    under_review --> accepted: Staff accepts
    under_review --> rejected: Staff rejects
    missing_documents --> rejected: Staff rejects
```

Application status transitions are validated by the backend.

The frontend only displays actions that are valid for the application's current status.

### Application Statuses

| Status | Description |
| --- | --- |
| `draft` | The application was created but has not been submitted |
| `submitted` | The student submitted the completed application |
| `under_review` | An employee or administrator started reviewing it |
| `missing_documents` | Additional documents or corrections are required |
| `accepted` | The application was accepted |
| `rejected` | The application was rejected |
| `withdrawn` | The student withdrew the application |

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 22 |
| Frontend language | TypeScript 6 |
| Styling | SCSS |
| Reactive programming | RxJS |
| State management | Angular Signals |
| Forms | Angular Reactive Forms |
| HTTP communication | Angular HttpClient |
| Backend | Node.js |
| Backend framework | Express 5 |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token |
| Password hashing | bcrypt |
| Validation | Joi and express-validator |
| File uploading | Multer |
| World map | `@svg-maps/world` |
| API testing | Postman |
| Version control | Git and GitHub |
| Deployment | Render and MongoDB Atlas |

### Angular Features Used

- Standalone components
- Lazy-loaded routes
- Angular Signals
- Reactive Forms
- HttpClient
- Functional HTTP interceptor
- Route Guards
- Role Guards
- Custom validators
- Reusable shared components
- Zoneless change detection
- Responsive SCSS
- Dark and light themes
- English and Arabic interface support

---

## System Architecture

```mermaid
flowchart LR
    Client["Angular Client"]
    API["Express REST API"]
    Database[("MongoDB")]
    Files["Document Storage"]
    Activity["Notifications & Admin Logs"]

    Client -->|"HTTPS + JWT"| API
    API --> Database
    API --> Files
    API --> Activity
```

### Frontend Architecture

The Angular application follows a feature-based structure:

- `core/` contains application-wide services, models, guards, interceptors, validators, internationalization, and theme management.
- `shared/` contains reusable navigation, cards, status badges, shells, progress indicators, and UI states.
- `features/` contains the public, authentication, student, employee, and administrator pages.
- Page-level components are lazy-loaded using `loadComponent`.
- `authGuard` protects authenticated pages.
- `roleGuard` restricts pages according to the authenticated user role.
- A JWT interceptor automatically attaches the access token to protected API requests.

### Backend Architecture

The backend follows a layered architecture:

- Routes define endpoints and access rules.
- Controllers handle requests and responses.
- Services contain business rules and database operations.
- Mongoose models define database collections.
- Validators reject malformed request data.
- Middleware handles authentication, authorization, and file uploads.
- Notifications inform users about application updates.
- Administrative logs record sensitive system operations.

---

## Project Structure

```text
Scholarship_project/
├── BackEnd/
│   ├── controller/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── seed/
│   ├── services/
│   ├── validators/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Front End/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── models/
│   │   │   │   ├── services/
│   │   │   │   └── validators/
│   │   │   ├── features/
│   │   │   │   ├── admin/
│   │   │   │   ├── auth/
│   │   │   │   ├── employee/
│   │   │   │   ├── public/
│   │   │   │   └── student/
│   │   │   └── shared/
│   │   │       ├── components/
│   │   │       └── layouts/
│   │   ├── environments/
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   └── package.json
│
├── postman/
├── scripts/
├── API_MAP.md
└── README.md
```

> The frontend directory is named `Front End` with a space. Keep the quotation marks around this path when using it in terminal commands.

---

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js `24.15.0` or a newer compatible Node 24 version.
- npm.
- Git.
- MongoDB Atlas account or a local MongoDB server.

Check the installed versions:

```bash
node -v
npm -v
git --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/amotaz668-create/Scholarship_project.git
cd Scholarship_project
```

### 2. Configure the Backend

Open the backend directory:

```bash
cd BackEnd
```

Install dependencies:

```bash
npm install
```

Create a file named `.env` inside `BackEnd/` and add the required environment variables.

Start the backend:

```bash
npm start
```

The API will run at:

```text
http://localhost:3000
```

The exact port can be changed using the `PORT` environment variable.

### 3. Configure the Frontend

Open another terminal from the project root:

```bash
cd "Front End"
```

Install dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
npm start
```

You can also use:

```bash
npx ng serve
```

Open the application at:

```text
http://localhost:4200
```

### 4. Frontend API Configuration

The development API URL is located in:

```text
Front End/src/environments/environment.ts
```

Development configuration:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  uploadsUrl: 'http://localhost:3000'
};
```

---

## Environment Variables

Create a `.env` file inside the `BackEnd` directory:

```env
PORT=3000
MONGODBURL=mongodb://127.0.0.1:27017/scholarship_atlas
JWT_SECRET=replace_with_a_long_random_secret
```

For MongoDB Atlas, replace `MONGODBURL` with your MongoDB Atlas connection string:

```env
MONGODBURL=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/scholarship_atlas
```

### Environment Variables Description

| Variable | Required | Description |
| --- | :---: | --- |
| `MONGODBURL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens |
| `PORT` | No | Backend port; defaults to `3000` |

The backend also recognizes the legacy environment variable names:

```text
SECRETKAY
SECRET_KEY
```

New environments should use:

```text
JWT_SECRET
```

> Never upload `.env`, database credentials, JWT secrets, or private keys to GitHub.

---

## Database Seeding

The project contains an idempotent scholarship seeder with 15 scholarship programmes.

The seed data includes:

- Scholarship name
- Official programme link
- Provider
- Country
- University
- Available degrees
- Eligibility information
- Application deadline
- Funding information
- Required documents
- Publication status

Run the scholarship seeder:

```bash
cd BackEnd
npm run seed:scholarships
```

The seeder updates scholarships with matching titles and does not delete unrelated records.

Scholarships marked as `draft` or `closed` should be checked against their official website before publishing a new application cycle.

---

## Creating Staff Accounts

Trusted employee and administrator accounts can be created using the staff creation script.

### Create an Administrator

```bash
cd BackEnd
npm run create:staff -- admin admin@example.com StrongPassword123
```

### Create an Employee

```bash
cd BackEnd
npm run create:staff -- employee employee@example.com StrongPassword123
```

This script should only be used in a trusted development or administrative environment.

Administrators can also create staff accounts from the user management section inside the application.

---

## API Overview

Base API URL:

```text
http://localhost:3000/api
```

Protected endpoints require a JWT access token:

```http
Authorization: Bearer <token>
```

### Authentication and Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a new student |
| `POST` | `/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/users/me` | Authenticated | Get the current user |
| `PATCH` | `/users/me` | Authenticated | Update the current user |
| `PATCH` | `/users/me/password` | Authenticated | Change the current password |
| `GET` | `/users` | Admin | Get and filter users |
| `POST` | `/users/staff` | Admin | Create an employee or admin |
| `PATCH` | `/users/:id/status` | Admin | Activate or deactivate a user |
| `DELETE` | `/users/:id` | Admin | Delete an eligible user |

### Scholarships

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/scholarships` | Public | Get published scholarships |
| `GET` | `/scholarships/:id` | Public | Get scholarship details |
| `POST` | `/scholarships/check-eligibility` | Public | Check eligibility |
| `POST` | `/scholarships` | Employee/Admin | Create a scholarship |
| `PATCH` | `/scholarships/:id` | Employee/Admin | Update a scholarship |
| `DELETE` | `/scholarships/:id` | Admin | Delete a scholarship |

### Reference Data

| Method | Endpoint | Read Access | Write Access |
| --- | --- | --- | --- |
| `GET/POST/PATCH/DELETE` | `/categories` | Public | Employee/Admin |
| `GET/POST/PATCH/DELETE` | `/countries` | Public | Employee/Admin |
| `GET/POST/PATCH/DELETE` | `/universities` | Public | Employee/Admin |

### Student Profile

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/student/profile` | Student | Get the Opportunity Passport |
| `POST` | `/student/profile` | Student | Create the Opportunity Passport |
| `PATCH` | `/student/profile` | Student | Update the Opportunity Passport |

### Student Documents

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/student/documents` | Student | Get document wallet |
| `POST` | `/student/documents` | Student | Upload a document |
| `GET` | `/student/documents/:id/file` | Authorized | View a document |
| `DELETE` | `/student/documents/:id` | Student | Delete an unused document |

Uploaded files support:

```text
PDF, JPG and PNG
```

Maximum file size:

```text
5 MB
```

### Applications

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/applications` | Student | Create a draft application |
| `GET` | `/applications/my` | Student | Get the student's applications |
| `GET` | `/applications/:id/prepare` | Student | Load application requirements |
| `PATCH` | `/applications/:id` | Student | Update an editable application |
| `PATCH` | `/applications/:id/submit` | Student | Submit an application |
| `PATCH` | `/applications/:id/withdraw` | Student | Withdraw an application |
| `GET` | `/applications/assigned/me` | Employee | Get assigned applications |
| `GET` | `/applications` | Admin | Get all applications |
| `GET` | `/applications/:id` | Authorized | Get application details |
| `PATCH` | `/applications/:id/status` | Employee/Admin | Change application status |

### Notifications

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/notifications` | Authenticated | Get personal notifications |
| `PATCH` | `/notifications/:id/read` | Authenticated | Mark one notification as read |
| `PATCH` | `/notifications/read-all` | Authenticated | Mark all notifications as read |
| `DELETE` | `/notifications/:id` | Authenticated | Delete a notification |

### Administration

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/admin/dashboard` | Admin | Get dashboard totals |
| `GET` | `/admin/statistics` | Admin | Get platform statistics |
| `GET` | `/admin/logs` | Admin | Get administrative logs |
| `GET` | `/admin/logs/:id` | Admin | Get one administrative log |

More request examples and validation scenarios are available in:

- [`API_MAP.md`](API_MAP.md)
- [`postman/`](postman/)

---

## Available Commands

### Backend Commands

```bash
cd BackEnd
```

| Command | Description |
| --- | --- |
| `npm install` | Install backend dependencies |
| `npm start` | Start the backend API |
| `npm run dev` | Start the backend using Nodemon |
| `npm run check` | Check backend JavaScript syntax |
| `npm run seed:scholarships` | Insert or update scholarship data |
| `npm run create:staff` | Create an employee or admin account |

### Frontend Commands

```bash
cd "Front End"
```

| Command | Description |
| --- | --- |
| `npm install` | Install frontend dependencies |
| `npm start` | Start the Angular development server |
| `npx ng serve` | Start Angular directly using the local CLI |
| `npm run build` | Create a production build |
| `npm run verify` | Run the production verification build |

---

## Deployment

Recommended deployment services:

| Application Part | Recommended Service |
| --- | --- |
| Angular frontend | Render Static Site |
| Express backend | Render Web Service |
| MongoDB database | MongoDB Atlas |
| Uploaded documents | Cloudinary, Amazon S3, or persistent storage |

### Backend Deployment on Render

Use the following Render Web Service settings:

| Setting | Value |
| --- | --- |
| Language | Node |
| Branch | `main` |
| Root Directory | `BackEnd` |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Region | Frankfurt |
| Node version | `24.15.0` |

Add these environment variables:

```env
MONGODBURL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_VERSION=24.15.0
```

Render automatically provides the `PORT` variable.

### Frontend Deployment on Render

Create a Render Static Site using:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root Directory | `Front End` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist/scholarship-atlas/browser` |

Before deploying, update the Angular production environment with the deployed backend URL.

Example:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-name.onrender.com/api',
  uploadsUrl: 'https://your-backend-name.onrender.com'
};
```

Add the following rewrite rule for Angular routing:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

After deploying the frontend, update the backend CORS configuration so that it only accepts requests from the deployed frontend domain.

---

## Security

Scholarship Atlas implements the following security measures:

- Passwords are hashed using bcrypt.
- JWT tokens expire after one day.
- Authentication middleware validates every protected request.
- Inactive user accounts are blocked.
- Role-based middleware protects restricted endpoints.
- Public registration cannot create privileged accounts.
- Request bodies are validated before business logic runs.
- File types and file sizes are validated before upload.
- Document access requires ownership or authorized assignment.
- Application transitions are controlled by backend rules.
- Administrative operations can be recorded in audit logs.
- Environment variables protect database credentials and JWT secrets.

---

## Production Considerations

Before using the platform in production, review the following points:

1. **Document storage**

   Uploaded documents are currently stored on the backend filesystem. Free cloud services may remove local files after restarts or deployments.

   Use Cloudinary, Amazon S3, or persistent storage for production.

2. **CORS configuration**

   Development currently allows requests from every origin.

   Replace:

   ```js
   origin: '*'
   ```

   With the deployed frontend domain.

3. **Frontend environment**

   The development environment currently points to:

   ```text
   http://localhost:3000/api
   ```

   Configure a separate production environment before deployment.

4. **Frontend directory name**

   The frontend folder is named:

   ```text
   Front End
   ```

   Remember to use quotation marks around the directory path in terminal commands.

5. **Automated testing**

   The project contains a Postman workspace and build verification commands. Unit, integration, and end-to-end tests should be added before large-scale production use.

6. **Database indexes**

   Review MongoDB indexes for frequently searched scholarship, user, and application fields before scaling.

7. **Logging and monitoring**

   Add centralized logging, uptime monitoring, and error reporting for production deployments.

---

## Roadmap

Future improvements can include:

- Save the selected study level on applications that support multiple degrees.
- Allow administrators to assign and reassign applications to employees.
- Move uploaded documents to managed cloud storage.
- Add real-time notifications using WebSockets.
- Add email notifications for important application updates.
- Add password reset using secure email tokens.
- Add automatic scholarship deadline reminders.
- Add advanced reporting and data export.
- Add automated unit, API, component, and end-to-end tests.
- Add a complete CI/CD pipeline.
- Add infrastructure-as-code deployment configuration.

---

## Contributors

Scholarship Atlas was developed as a collaborative NTI MEAN Stack final project.

- [Moataz Ahmed](https://github.com/amotaz668-create) — Repository owner and contributor.
- Ali Ibrahim — Contributor.
- View the complete [GitHub contributors history](https://github.com/amotaz668-create/Scholarship_project/graphs/contributors).

Contributions should be developed on a separate feature branch and submitted through a pull request with a clear description and verification steps.

---

<div align="center">
  <p>
    Built with Angular, Express, MongoDB, and Node.js.
  </p>

  <p>
    <strong>Scholarship Atlas — Your journey to the right opportunity starts here.</strong>
  </p>
</div>
