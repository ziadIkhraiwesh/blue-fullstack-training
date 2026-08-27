# Laravel REST API Training Project

## Project Overview

This Laravel backend project was developed as part of Tasks 11 and 12 of the Blue Full-Stack Development Training Program.

Task 11 introduced Laravel project structure, controllers, API routes, JSON responses, HTTP status codes, and request validation.

Task 12 extended the same application into a database-driven CRUD REST API using MySQL, Laravel migrations, Eloquent ORM, seeders, validation, and Postman testing.

## Technologies and Tools

- PHP 8.3.30
- Laravel 13.26.1
- Composer 2.9.4
- MySQL 8.4.3
- Eloquent ORM
- Postman
- HeidiSQL
- Laragon
- Visual Studio Code
- Git and GitHub

## Project Structure

```text
task-11-laravel-api/
|-- app/
|   |-- Http/
|   |   `-- Controllers/
|   |       |-- ContactController.php
|   |       |-- HealthController.php
|   |       |-- PostController.php
|   |       `-- TrainingController.php
|   `-- Models/
|       |-- Post.php
|       `-- User.php
|-- bootstrap/
|   `-- app.php
|-- config/
|-- database/
|   |-- migrations/
|   `-- seeders/
|       |-- DatabaseSeeder.php
|       `-- PostSeeder.php
|-- public/
|-- resources/
|-- routes/
|   |-- api.php
|   `-- web.php
|-- storage/
|-- tests/
|-- .env.example
|-- artisan
|-- composer.json
`-- README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ziadIkhraiwesh/blue-fullstack-training.git
```

### 2. Open the Laravel project

```bash
cd blue-fullstack-training/task-11-laravel-api
```

### 3. Install the PHP dependencies

```bash
composer install
```

### 4. Create the local environment file

Using Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 5. Generate the Laravel application key

```bash
php artisan key:generate
```

## MySQL Database Setup

Start MySQL using Laragon and create a local database named:

```text
blue_training_api
```

Update the local `.env` file with the correct database information:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blue_training_api
DB_USERNAME=root
DB_PASSWORD=your_local_mysql_password
```

Do not commit the `.env` file, passwords, credentials, or other local secrets to GitHub.

### Run the migrations

```bash
php artisan migrate
```

### Seed the sample posts

```bash
php artisan db:seed
```

The migration creates the `posts` table, and the seeder adds several sample posts for development and testing.

### Reset and reseed the local database when needed

```bash
php artisan migrate:fresh --seed
```

Warning: this command deletes the existing local database tables and recreates them.

## Running the Application

Start the Laravel development server:

```bash
php artisan serve
```

The application will run at:

```text
http://127.0.0.1:8000
```

The API base URL is:

```text
http://127.0.0.1:8000/api
```

## Task 11 API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| `GET` | `/api/health` | Returns the API health status | `200 OK` |
| `GET` | `/api/profile` | Returns trainee profile information | `200 OK` |
| `GET` | `/api/skills` | Returns the technical skills | `200 OK` |
| `GET` | `/api/training/tasks` | Returns all training tasks | `200 OK` |
| `GET` | `/api/training/tasks/{id}` | Returns one training task | `200 OK` |
| `POST` | `/api/contact` | Validates and processes contact data | `201 Created` |

## Task 12 Posts CRUD Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| `GET` | `/api/posts` | Returns all posts | `200 OK` |
| `GET` | `/api/posts/{id}` | Returns one post by ID | `200 OK` |
| `POST` | `/api/posts` | Creates a new post | `201 Created` |
| `PUT` | `/api/posts/{id}` | Updates an existing post | `200 OK` |
| `PATCH` | `/api/posts/{id}` | Updates an existing post | `200 OK` |
| `DELETE` | `/api/posts/{id}` | Deletes an existing post | `200 OK` |

A missing post returns:

```text
404 Not Found
```

Invalid POST or PUT data returns:

```text
422 Unprocessable Content
```

## Posts Table

The `posts` migration creates the following fields:

| Field | Database Type | Description |
|---|---|---|
| `id` | BIGINT | Auto-incrementing primary key |
| `title` | VARCHAR(255) | Post title |
| `body` | TEXT | Post content |
| `status` | ENUM | Accepts `draft` or `published` |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

## Request Fields

The following fields are required when creating or updating a post:

| Field | Validation Rules |
|---|---|
| `title` | Required, string, maximum 255 characters |
| `body` | Required, string |
| `status` | Required, must be `draft` or `published` |

## Create Post Example

Request:

```http
POST /api/posts
```

Headers:

```text
Accept: application/json
Content-Type: application/json
```

Request body:

```json
{
  "title": "Laravel API Development",
  "body": "This post was created through the database-backed Laravel REST API.",
  "status": "published"
}
```

Successful response:

```json
{
  "status": "success",
  "message": "Post created successfully.",
  "data": {
    "id": 6,
    "title": "Laravel API Development",
    "body": "This post was created through the database-backed Laravel REST API.",
    "status": "published"
  }
}
```

## Update Post Example

Request:

```http
PUT /api/posts/6
```

Request body:

```json
{
  "title": "Updated Laravel API Development",
  "body": "This post was updated successfully through the Laravel CRUD REST API.",
  "status": "draft"
}
```

## Validation Error Example

Invalid request body:

```json
{
  "title": "",
  "body": "",
  "status": "archived"
}
```

Example response:

```json
{
  "message": "The title field is required. (and 2 more errors)",
  "errors": {
    "title": [
      "The title field is required."
    ],
    "body": [
      "The body field is required."
    ],
    "status": [
      "The selected status is invalid."
    ]
  }
}
```

## Not Found Response Example

Request:

```http
GET /api/posts/999
```

Response:

```json
{
  "status": "error",
  "message": "Post not found."
}
```

The same JSON `404` behavior is used when viewing, updating, or deleting a post that does not exist.

## Seeder

`PostSeeder` creates several sample records with both supported status values:

- `draft`
- `published`

Run the seeder using:

```bash
php artisan db:seed
```

The seeder uses Eloquent `updateOrCreate()` to avoid duplicating the same sample posts when it is executed more than once.

## API Testing

All required API operations were tested using Postman.

The testing covered:

- Listing all posts.
- Viewing one post.
- Creating a valid post.
- Attempting to create an invalid post.
- Updating an existing post.
- Deleting an existing post.
- Viewing a missing post.
- Updating a missing post.
- Deleting a missing post.
- Verifying the database records using HeidiSQL.

## Task 12 Screenshots

The Task 12 submission includes evidence of:

- Successful migrations.
- Sample records stored in MySQL.
- Listing posts.
- Viewing one post.
- Creating a post.
- Updating a post.
- Deleting a post.
- Validation errors.
- A JSON `404` response.

## What I Learned

During Tasks 11 and 12, I learned how to:

- Configure a Laravel application.
- Register API routes.
- Organize API logic inside controllers.
- Connect Laravel to a MySQL database.
- Create and execute database migrations.
- Define an Eloquent model and mass-assignable fields.
- Use Eloquent instead of raw SQL.
- Create and run database seeders.
- Implement database-backed CRUD operations.
- Validate JSON requests on the server.
- Return readable JSON responses and suitable HTTP status codes.
- Handle missing database records using JSON `404` responses.
- Test API operations using Postman.
- Verify persistent records using HeidiSQL.

## Challenges and Solutions

During the initial Laravel setup, the `bootstrap/cache` directory was not writable because the project was located inside a OneDrive folder. The directory permissions were corrected and Laravel was able to run successfully.

The project initially used SQLite. For Task 12, a new MySQL database was created using HeidiSQL, and the Laravel `.env` configuration was updated to use the MySQL connection.

A MySQL authentication error occurred when attempting to connect without a password. It was resolved by using the existing local MySQL root password.

No database credentials or local secrets were committed to GitHub.

## Known Limitations

- The API does not currently include authentication or authorization.
- The contact endpoint validates data but does not permanently store it.
- The project currently uses a local MySQL database.
- API pagination, filtering, and sorting are outside the scope of Task 12.

## Current Status

All requirements for Tasks 11 and 12 have been implemented and tested successfully.

No remaining implementation blockers were encountered.

## Task 13: Relationships, API Resources, Filtering and Pagination

Task 13 extends the database-backed Posts API by adding categories, Eloquent relationships, standardized API resources, filtering, sorting, and pagination.

### Category Entity

The `categories` table contains:

| Field | Description |
|---|---|
| `id` | Primary key |
| `name` | Unique category name |
| `slug` | Unique URL-friendly category identifier |
| `created_at` | Creation timestamp |
| `updated_at` | Update timestamp |

Sample categories include:

- Technology
- Business
- Education

### Post and Category Relationship

Each post belongs to one category, and each category can contain multiple posts.

```text
Category has many Posts
Post belongs to Category
```

The `posts` table contains a `category_id` foreign key that references the `categories` table.

Eloquent relationships are defined using:

```php
Category::posts()
Post::category()
```

Posts are retrieved with their category using eager loading to avoid repeated database queries.

### Categories Endpoint

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Retrieve all categories and their post counts |

Example:

```http
GET http://127.0.0.1:8000/api/categories
```

### Updated Posts Request Fields

Creating or updating a post requires:

```json
{
  "title": "Laravel Relationships",
  "body": "This post demonstrates Laravel Eloquent relationships.",
  "status": "published",
  "category_id": 1
}
```

Validation rules:

- `title`: required string, maximum 255 characters.
- `body`: required string.
- `status`: required and must be `draft` or `published`.
- `category_id`: required integer and must exist in the `categories` table.

An invalid category returns a `422 Unprocessable Content` response.

### Post API Resources

Laravel API Resources control the returned JSON structure.

Each post response includes:

- ID
- Title
- Body
- Status
- Category information
- Creation timestamp
- Update timestamp

Category responses include:

- ID
- Name
- Slug
- Post count
- Timestamps

### Posts Query Parameters

The posts endpoint supports the following query parameters:

| Parameter | Accepted Values | Description |
|---|---|---|
| `search` | Text | Search posts by title |
| `status` | `draft`, `published` | Filter by post status |
| `category_id` | Existing category ID | Filter by category |
| `sort_by` | `created_at`, `title` | Select the sorting field |
| `sort_direction` | `asc`, `desc` | Select sorting direction |
| `per_page` | `1` to `50` | Select page size |
| `page` | Positive page number | Select a pagination page |

### Filtering Examples

Search by title:

```http
GET /api/posts?search=laravel
```

Filter by status:

```http
GET /api/posts?status=published
```

Filter by category:

```http
GET /api/posts?category_id=1
```

Combine filters and sorting:

```http
GET /api/posts?status=published&category_id=1&sort_by=title&sort_direction=asc
```

### Pagination

The posts endpoint uses Laravel pagination and returns pagination links and metadata.

The default page size is five posts. A controlled `per_page` value can be provided, with a maximum of 50.

Examples:

```http
GET /api/posts?page=1
GET /api/posts?per_page=3&page=2
```

### Database Setup and Seeding

Run the migrations:

```bash
php artisan migrate
```

Seed categories and related posts:

```bash
php artisan db:seed
```

Rebuild and seed the complete database when necessary:

```bash
php artisan migrate:fresh --seed
```

### Task 13 Testing

The following scenarios were tested using Postman and HeidiSQL:

- Retrieving categories.
- Retrieving posts with category information.
- Creating a post with a valid category.
- Rejecting a nonexistent category.
- Updating a post and its category.
- Searching posts by title.
- Filtering by status.
- Filtering by category.
- Combining multiple filters.
- Sorting by title and creation date.
- Paginating the posts list and opening the second page.
- Confirming category relationships in MySQL.
- Retesting the existing CRUD operations from Task 12.

### Task 13 Screenshot Evidence

Testing screenshots are available in:

```text
screenshots/task-13/
```

The evidence includes category responses, related posts, validation, filtering, sorting, pagination, and database relationships.

### Task 13 Status

Task 13 is complete. Categories, Eloquent relationships, API Resources, filtering, controlled sorting, pagination, validation, eager loading, testing evidence, and documentation were implemented successfully.

No remaining implementation blockers were encountered.

## Task 14: Laravel Authentication, Authorization and Protected APIs

Task 14 extends the existing Laravel Posts API by adding token-based authentication with Laravel Sanctum, post ownership, protected write operations, and authorization policies.

### Laravel Sanctum Setup

Laravel Sanctum is used to authenticate API requests using personal access tokens.

Install and configure API authentication:

```bash
php artisan install:api
php artisan migrate
```

The `User` model uses the `HasApiTokens` trait to create and manage access tokens.

### Authentication Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/register` | Public | Register a new user and return an access token |
| POST | `/api/login` | Public | Authenticate a user and return an access token |
| GET | `/api/me` | Required | Return the authenticated user's information |
| POST | `/api/logout` | Required | Revoke the current access token |

### Register

```http
POST /api/register
```

Example request:

```json
{
  "name": "Example User",
  "email": "example@example.com",
  "password": "your-secure-password",
  "password_confirmation": "your-secure-password"
}
```

Registration validates the submitted data, hashes the password securely, creates the user, and returns an access token.

### Login

```http
POST /api/login
```

Example request:

```json
{
  "email": "example@example.com",
  "password": "your-secure-password"
}
```

A successful login returns the authenticated user's basic information and a Sanctum access token. Invalid credentials are rejected with a validation response.

### Bearer Token Authentication

Protected API requests must include the access token in the `Authorization` header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

In Postman, select:

```text
Authorization → Bearer Token
```

Then paste the access token into the token field.

Real passwords, personal credentials, and access tokens must never be committed to the repository.

### Authenticated User

```http
GET /api/me
```

This endpoint returns basic information about the currently authenticated user. Password hashes, remember tokens, and access tokens are not included in the response.

### Logout

```http
POST /api/logout
```

Logout deletes the current access token. After logout, the revoked token can no longer access `/api/me` or any other protected endpoint.

### Protected Posts Endpoints

Public read operations remain available without authentication:

| Method | Endpoint | Authentication |
|---|---|---|
| GET | `/api/posts` | Public |
| GET | `/api/posts/{id}` | Public |
| GET | `/api/categories` | Public |

Post write operations require a valid Sanctum token:

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/api/posts` | Required |
| PUT | `/api/posts/{id}` | Required |
| PATCH | `/api/posts/{id}` | Required |
| DELETE | `/api/posts/{id}` | Required |

### Post Ownership

A `user_id` foreign key connects each post to its owner.

The Eloquent relationships are:

```text
User has many Posts
Post belongs to User
```

When an authenticated user creates a post, the API automatically assigns the post to that user.

The client must not submit a `user_id`. Ownership is determined from the authenticated Sanctum token.

Example authenticated post request:

```json
{
  "title": "Protected Laravel Post",
  "body": "This post is assigned automatically to the authenticated user.",
  "status": "published",
  "category_id": 1
}
```

### Post Author Resource

Post API responses contain safe author information:

```json
{
  "author": {
    "id": 1,
    "name": "Example User"
  }
}
```

Sensitive user data such as password hashes, remember tokens, and access tokens is never returned inside post resources.

### Authorization Policy

`PostPolicy` controls update and delete permissions.

Authorization rules:

- An authenticated user may update their own posts.
- An authenticated user may delete their own posts.
- A user cannot update another user's posts.
- A user cannot delete another user's posts.
- Unauthorized ownership attempts return `403 Forbidden`.

### Unauthenticated Response

A protected request without a valid Bearer token returns:

```http
401 Unauthorized
```

```json
{
  "message": "Unauthenticated."
}
```

### Forbidden Response

When an authenticated user attempts to update or delete another user's post, the API returns:

```http
403 Forbidden
```

```json
{
  "message": "This action is unauthorized."
}
```

### Authentication and Authorization

Authentication determines who the user is.

Authorization determines what the authenticated user is allowed to do.

Laravel Sanctum handles token-based authentication, while `PostPolicy` handles ownership authorization.

### Database Setup and Seeding

Run all pending migrations:

```bash
php artisan migrate
```

Seed the database with categories, posts, and test users:

```bash
php artisan db:seed
```

Rebuild and seed the database when necessary:

```bash
php artisan migrate:fresh --seed
```

The included users are test accounts for local authentication and authorization testing only. No real user credentials are included.

### Run the Application

```bash
php artisan serve
```

The local API is available at:

```text
http://127.0.0.1:8000/api
```

### Task 14 Testing

The following scenarios were tested using Postman:

- Registering a new user.
- Logging in and receiving a Sanctum access token.
- Rejecting invalid login credentials.
- Retrieving the authenticated user through `/api/me`.
- Creating a post through an authenticated request.
- Automatically assigning the new post to the authenticated user.
- Updating a post successfully as its owner.
- Deleting a post successfully as its owner.
- Rejecting protected requests without an access token.
- Rejecting update attempts from a user who does not own the post.
- Logging out and invalidating the current access token.
- Confirming that an invalidated token can no longer access protected endpoints.
- Confirming that passwords and sensitive token data are not exposed.
- Retesting CRUD operations.
- Retesting categories and relationships.
- Retesting search, filtering, sorting, and pagination.

### Task 14 Screenshot Evidence

Authentication and authorization testing screenshots are available in:

```text
screenshots/task-14/
```

The evidence includes:

- Successful login and token response.
- Authenticated `/api/me` response.
- Authenticated post creation.
- Unauthenticated protected request.
- Forbidden ownership attempt by another user.
- Logout and token invalidation.

### Task 14 Status

Task 14 is complete. Laravel Sanctum authentication, access tokens, protected API routes, user-to-post ownership, automatic owner assignment, authorization policies, safe author resources, JSON authentication errors, testing evidence, and documentation were implemented successfully.

No remaining implementation blockers were encountered.