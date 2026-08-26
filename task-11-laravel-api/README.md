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