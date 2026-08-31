# Frontend / Backend API Map

Base URL: `http://localhost:3000/api`

## Authentication and users

| Frontend action | Method and route | Access |
| --- | --- | --- |
| Register student | `POST /auth/register` | Public |
| Login | `POST /auth/login` | Public |
| Current account | `GET /users/me` | Authenticated |
| Update current account | `PATCH /users/me` | Authenticated |
| List/filter users | `GET /users` | Admin |
| Get/update/delete user | `GET/PATCH/DELETE /users/:id` | Admin |
| Create staff account | `POST /users/staff` | Admin |
| Activate/deactivate user | `PATCH /users/:id/status` | Admin |

## Scholarships and catalogues

| Frontend action | Method and route | Access |
| --- | --- | --- |
| Explore scholarships | `GET /scholarships` | Public; published only for guests/students |
| Scholarship details | `GET /scholarships/:id` | Public; published only for guests/students |
| Eligibility results | `POST /scholarships/check-eligibility` | Public |
| Create/update scholarship | `POST /scholarships`, `PATCH /scholarships/:id` | Employee/Admin |
| Delete scholarship | `DELETE /scholarships/:id` | Admin |
| Countries | `GET/POST/PATCH/DELETE /countries` | Reads public; writes Employee/Admin |
| Universities | `GET/POST/PATCH/DELETE /universities` | Reads public; writes Employee/Admin |
| Categories | `GET/POST/PATCH/DELETE /categories` | Reads public; writes Employee/Admin |

Supported scholarship filters are `search`, `country`, `category`, `university`, `fundingType`, `minGPA`, `deadline`, `status`, `page` and `limit`. Degree filtering is performed on the loaded results because the backend has no degree query parameter.

## Student profile and documents

| Frontend action | Method and route | Access |
| --- | --- | --- |
| Read/create/update profile | `GET/POST/PATCH /student/profile` | Student |
| List/upload/delete documents | `GET/POST/DELETE /student/documents` | Student |
| Saved scholarships | Stored in `StudentProfile.favorites` through the profile API | Student |

## Applications

| Frontend action | Method and route | Access |
| --- | --- | --- |
| Create draft | `POST /applications` | Student |
| My applications | `GET /applications/my` | Student |
| Update draft | `PATCH /applications/:id` | Student |
| Submit/withdraw | `PATCH /applications/:id/submit`, `PATCH /applications/:id/withdraw` | Student |
| List every application | `GET /applications` | Admin |
| Get one application | `GET /applications/:id` | Authenticated |
| Update status | `PATCH /applications/:id/status` | Employee/Admin |

The backend does not currently expose an assigned-employee queue or assignment route, so the employee page uses the supported application-ID lookup and status update routes.

## Notifications and admin

| Frontend action | Method and route | Access |
| --- | --- | --- |
| Notifications | `GET /notifications` | Authenticated |
| Mark one/all read | `PATCH /notifications/:id/read`, `PATCH /notifications/read-all` | Authenticated |
| Delete notification | `DELETE /notifications/:id` | Authenticated |
| Admin dashboard/statistics | `GET /admin/dashboard`, `GET /admin/statistics` | Admin |
| Admin logs | `GET /admin/logs`, `GET /admin/logs/:id` | Admin |
