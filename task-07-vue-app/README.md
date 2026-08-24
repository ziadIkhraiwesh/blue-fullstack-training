# NexaTech Vue Application

## Project Overview

This project was created for Task 07 of the Blue Full-Stack Development Training Program. It rebuilds selected parts of the existing NexaTech website as a Vue 3 application using Vite, reusable components, props, custom events, reactive state, computed values, and REST API integration.

The original vanilla JavaScript website from Tasks 01-06 remains unchanged in the `task-01-responsive-website` folder.

## Technologies

- Vue 3
- Vite
- JavaScript
- Composition API
- HTML5
- CSS3
- Fetch API
- JSONPlaceholder REST API

## Setup and Run Commands

Install the project dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
task-07-vue-app/
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- screenshots/
|   |-- task-07-vue-page.png
|   |-- task-07-filter-event.png
|   |-- task-07-api-posts.png
|   |-- task-08-navigation.png
|   |-- task-08-post-details.png
|   |-- task-08-route-query.png
|   |-- task-09-favorite-count.png
|   |-- task-09-favorites-view.png
|   |-- task-09-invalid-form.png
|   |-- task-09-successful-post.png
|   |-- task-10-tests-passing.png
|   |-- task-10-production-preview.png
|   `-- task-10-tested-flow.png
|-- src/
|   |-- __tests__/
|   |   |-- setup.js
|   |   |-- postsStore.spec.js
|   |   |-- PostCard.spec.js
|   |   `-- CreatePostView.spec.js
|   |-- assets/
|   |   |-- hero.png
|   |   |-- vite.svg
|   |   `-- vue.svg
|   |-- components/
|   |   |-- HeroSection.vue
|   |   |-- PostCard.vue
|   |   |-- PostsSection.vue
|   |   |-- ProjectCard.vue
|   |   |-- ProjectFilter.vue
|   |   |-- ProjectsSection.vue
|   |   `-- SiteHeader.vue
|   |-- router/
|   |   `-- index.js
|   |-- services/
|   |   `-- postsApi.js
|   |-- stores/
|   |   `-- posts.js
|   |-- views/
|   |   |-- ContactView.vue
|   |   |-- CreatePostView.vue
|   |   |-- FavoritesView.vue
|   |   |-- HomeView.vue
|   |   |-- NotFoundView.vue
|   |   |-- PostDetailsView.vue
|   |   |-- PostsView.vue
|   |   `-- ProjectsView.vue
|   |-- App.vue
|   |-- main.js
|   `-- style.css
|-- .env.example
|-- .gitignore
|-- frontend-qa-task-10.md
|-- index.html
|-- package-lock.json
|-- package.json
|-- README.md
`-- vite.config.js
```



## Vue Components

### SiteHeader

Displays the NexaTech brand and navigation links.

### HeroSection

Displays the main page introduction and links to the projects and API sections.

### ProjectsSection

Stores eight project records in the parent component, manages reactive category state, computes the visible project list, and displays the selected project details.

### ProjectFilter

Receives category data and the selected category through props. It emits a `filter-change` custom event when the user selects a category.

### ProjectCard

Receives an individual project through props and emits a `view-details` custom event when the user selects the View Details action.

### PostsSection

Loads JSONPlaceholder posts when the component is mounted and manages loading, success, empty, error, Retry, search, and no-results states.

## Props and Custom-Event Flow

The projects feature follows this component flow:

1. `ProjectsSection` stores the project data and selected category.
2. Category data is passed to `ProjectFilter` through props.
3. `ProjectFilter` emits `filter-change` to the parent.
4. The parent updates the selected category using `ref()`.
5. `computed()` automatically produces the filtered project list.
6. Each project is passed to `ProjectCard` through props.
7. `ProjectCard` emits `view-details`.
8. The parent updates and displays the selected project state.

## Reactive Vue Features

The application uses:

- `ref()` for selected categories, selected projects, API data, loading state, errors, and search values.
- `computed()` for filtered projects, filtered posts, and result messages.
- `v-for` with stable unique IDs.
- `v-if`, `v-else-if`, and `v-else` for UI states.
- `v-bind` for props, classes, disabled states, and accessibility attributes.
- `v-model` for API post search.
- `defineProps()` for child-component inputs.
- `defineEmits()` for child-to-parent communication.
- `onMounted()` for the initial API request.

## Project Filtering

The Featured Projects section contains eight records across these categories:

- All
- Web
- Mobile
- UI/UX

The selected category is stored with `ref()`, and the displayed cards are derived using `computed()`. Selecting View Details emits a custom event and displays the selected project in the parent component.

## REST API Integration

The Posts section uses:

https://jsonplaceholder.typicode.com/posts

The request is implemented with `fetch()`, `async/await`, an HTTP status check, and JSON parsing.

The component supports:

- Loading state
- Successful data state
- Empty state
- Error state
- Retry without reloading the page
- Title search using `v-model`
- Computed search results
- Visible result count
- Clear Search action
- No-matching-results state

## Testing

The application was tested at:

- 320px
- 375px
- 768px
- 1024px
- 1440px

The following behaviors were tested:

- Component rendering
- Props flow
- Category filtering
- Custom emitted events
- Selected-project state
- API loading and successful rendering
- Simulated API failure
- Retry behavior
- API title search
- No-results behavior
- Keyboard navigation
- Visible focus states
- Responsive layouts
- Production build
- Browser console and Vue warnings

## Screenshots

### Vue Page and Components

![Vue page and components](screenshots/task-07-vue-page.png)

### Category Filter and Custom Event

![Vue filter and event interaction](screenshots/task-07-filter-event.png)

### API Posts Section

![Vue API posts](screenshots/task-07-api-posts.png)

## Task 08 - Vue Router and SPA Navigation

During Task 08, the existing Vue application was converted into a routed Single Page Application using Vue Router.

### Router Setup

- Installed and registered Vue Router 4.
- Created the router configuration inside `src/router/index.js`.
- Kept `App.vue` focused on the shared header and `RouterView`.
- Used `RouterLink` for internal navigation without full page reloads.
- Added active navigation styles for the current route.
- Lazy-loaded the Projects, Posts, Contact, Post Details, and Not Found views.

### Route Structure

| Route | View | Purpose |
|---|---|---|
| `/` | `HomeView.vue` | Displays the Vue landing page |
| `/projects` | `ProjectsView.vue` | Displays reactive project filtering and custom events |
| `/posts` | `PostsView.vue` | Displays API posts and route-aware search |
| `/posts/:id` | `PostDetailsView.vue` | Loads one post using the dynamic route ID |
| `/contact` | `ContactView.vue` | Displays company contact information |
| `/:pathMatch(.*)*` | `NotFoundView.vue` | Handles unknown application routes |

### Dynamic Post Routes

- Added a dynamic `/posts/:id` route.
- Added a Read More action to every API post card.
- Read the selected ID using `useRoute()`.
- Loaded the matching post from JSONPlaceholder.
- Displayed the post ID, title, and body.
- Added loading, API error, invalid-ID, and not-found states.
- Added programmatic Back to Posts navigation using `useRouter()`.
- Preserved the previous search value when returning from post details.

### Reusable API Composable

Reusable API logic was moved to:

```text
src/composables/usePosts.js
```

The composable:

- Stores the JSONPlaceholder base URL in one location.
- Exposes reactive post data.
- Exposes loading and error states.
- Provides reusable list and single-post loading functions.
- Supports Retry without reloading the application.
- Handles invalid and missing post IDs.

### Route-Aware Search

- The posts search value is synchronized with the `q` query parameter.
- Searching updates the URL without a full page reload.
- Refreshing or sharing the route restores the search value.
- Clearing the search removes the query parameter.
- The search value is preserved when opening post details and returning to the posts list.

Example:

```text
#/posts?q=qui
```

### History and Static Hosting Decision

The application uses `createWebHashHistory()` because the training repository uses static hosting. Hash history keeps direct route refreshes usable without requiring server-side SPA fallback configuration.

Example routes:

```text
#/projects
#/posts
#/posts/1
#/contact
```

### Router Testing

The following behavior was tested:

- RouterLink navigation without full reloads.
- Active navigation states.
- Browser Back and Forward.
- Direct access to static and dynamic routes.
- Refreshing valid routes.
- Valid and invalid post IDs.
- Unknown routes and the 404 page.
- Route-query search restoration.
- API loading, error, Retry, and not-found states.
- Responsive layouts at 320px, 375px, 768px, 1024px, and 1440px.
- Production build.
- Browser console and Vue Router warnings.

### Task 08 Screenshots

#### SPA Navigation and Active Route

![Task 08 SPA navigation](screenshots/task-08-navigation.png)

#### Dynamic Post Details Route

![Task 08 dynamic post details](screenshots/task-08-post-details.png)

#### Route-Aware Search Query

![Task 08 route query search](screenshots/task-08-route-query.png)

## Task 09 - Pinia, Forms & API Mutations

During Task 09, I extended the existing Vue application with shared state management, persistent favorites, validated form handling, and a simulated API mutation.

### Pinia Store Architecture

Pinia was installed and registered with the existing Vue application.

The shared posts state is managed in:

`src/stores/posts.js`

The store contains shared state for:

* Posts loaded from the API.
* Posts loading and error states.
* The currently selected post.
* Favorite post IDs.
* Create-post submission, success, and error states.

The store also provides getters for the favorite count, favorite posts, and checking whether a specific post is currently selected as a favorite.

Reusable API request functions are kept separately in:

`src/services/postsApi.js`

This service contains the GET and POST request logic, while the Pinia store remains the single source of truth for shared posts and favorites state. The previous posts composable was removed to avoid duplicating API and shared-state logic.

Temporary form fields and field-level validation messages remain local to `CreatePostView.vue` because they are only required by that page.

### Persistent Favorites

A favorite action was added to post cards and the Post Details view.

The implementation includes:

* Adding and removing favorite posts.
* Immediate synchronization between Posts, Post Details, Favorites, and the shared header count.
* A dedicated Favorites route and view.
* An empty state when no posts are selected.
* Persistence of only the favorite post IDs in `localStorage`.
* Restoration of saved favorites when the application starts.
* Preservation of favorites after a browser refresh.

### Create Post Form

A new route-level view was added at:

`#/posts/create`

The form uses `v-model` and includes:

* Title.
* Body / Content.
* User ID.
* Field-level validation messages.
* Accessible invalid states using `aria-invalid` and `aria-describedby`.
* A live character counter for the post body.
* Disabled and loading button states during submission.
* Prevention of duplicate submissions.

### Validation Rules

The following rules are applied before submission:

* Title is required and cannot contain whitespace only.
* Title must contain between 5 and 100 characters.
* Body is required and cannot contain whitespace only.
* Body must contain between 20 and 500 characters.
* User ID is required.
* User ID must be a positive whole number.

### POST API Mutation

Valid form data is submitted to:

`https://jsonplaceholder.typicode.com/posts`

The request uses `fetch()`, `async/await`, the `POST` method, a JSON request body, and the correct `Content-Type` header.

The interface handles:

* Submitting/loading state.
* Successful submission and returned record ID.
* Failed submission with preserved form values.
* Retry after an API error.
* Resetting the form through a deliberate Create Another Post action.
* Duplicate-submit prevention.

JSONPlaceholder simulates post creation and usually returns an ID such as `101`. The created post is not permanently stored on the JSONPlaceholder server.

### Testing Completed

The following scenarios were tested:

* Posts loading after Pinia integration.
* Favorites synchronization across multiple routes.
* Favorite persistence after browser refresh.
* Favorites empty and content states.
* Empty, whitespace-only, short, long, and invalid form values.
* Valid POST submission and returned result.
* Forced API failure and Retry behavior.
* Preservation of form values after failure.
* Existing Vue Router navigation and dynamic post routes.
* Query-string search and direct page refresh.
* Not Found and invalid post states.
* Desktop, tablet, and mobile layouts.
* Production build and browser console output.

### Task 09 Screenshots

#### Shared Favorite Count

![Task 09 favorite count](screenshots/task-09-favorite-count.png)

#### Favorites View

![Task 09 favorites view](screenshots/task-09-favorites-view.png)

#### Invalid Create Post Form

![Task 09 invalid form](screenshots/task-09-invalid-form.png)

#### Successful POST Submission

![Task 09 successful post](screenshots/task-09-successful-post.png)

### Challenges and Blockers

The favorite action was initially placed inside the Post Details Not Found state, so it did not appear for valid posts. The button was moved into the successful post-details state and retested across the Posts, Post Details, and Favorites views.

No remaining blockers were encountered during Task 09.


## Frontend Handover - Task 10

Task 10 completes the current Vue.js frontend phase developed during Tasks 07-09. The application was finalized with automated testing, environment-based API configuration, production-build verification, regression QA, and handover documentation.

### Current Frontend Features

The frontend currently includes:

* Vue 3 application created with Vite.
* Vue Router Single Page Application navigation.
* Home, Projects, Posts, Contact, Favorites, Create Post, Post Details, and Not Found views.
* Dynamic post routes using post IDs.
* Posts search synchronized with the route query string.
* Pinia shared state management.
* Persistent favorite post IDs using localStorage.
* Shared Favorites count across routes.
* Validated Create Post form using `v-model`.
* Loading, success, error, Retry, and empty states.
* GET and POST integration with JSONPlaceholder.
* Responsive layouts for desktop, tablet, and mobile.
* Automated tests using Vitest and Vue Test Utils.

### Main Architecture

The main frontend areas are organized as follows:

* `src/components/` contains reusable interface components such as the shared header, project cards, project filters, post cards, and page sections.
* `src/views/` contains route-level pages coordinated by Vue Router.
* `src/router/index.js` defines the application routes, dynamic post route, lazy-loaded views, and Not Found handling.
* `src/stores/posts.js` is the Pinia source of truth for shared posts, favorites, loading, error, and post-submission state.
* `src/services/postsApi.js` contains reusable API request logic and endpoint-specific paths.
* `src/__tests__/` contains the automated Vitest test suite.
* `frontend-qa-task-10.md` contains the final manual regression QA checklist and results.

### Installation

Clone or download the repository, then open the Vue application folder:

```bash
cd task-07-vue-app
```

Install the required dependencies:

```bash
npm install
```

On Windows PowerShell systems that block `npm.ps1`, use:

```powershell
npm.cmd install
```

### Environment Configuration

Create a local `.env` file inside `task-07-vue-app` using the provided `.env.example` file.

Required variable:

```env
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

The API service reads this variable using:

```js
import.meta.env.VITE_API_BASE_URL
```

The local `.env` file is ignored by Git, while `.env.example` is committed as safe configuration documentation.

### Development Server

Run the application in development mode:

```bash
npm run dev
```

Windows PowerShell alternative:

```powershell
npm.cmd run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173/
```

### Automated Testing

The project uses:

* Vitest.
* Vue Test Utils.
* jsdom.
* Mocked API service functions.

Run the complete automated test suite:

```bash
npm test
```

Windows PowerShell alternative:

```powershell
npm.cmd test
```

The automated tests cover:

* Adding and removing favorite posts.
* Restoring favorite IDs from localStorage.
* Loading shared posts through a mocked service.
* Rendering important PostCard content.
* PostCard favorite interaction.
* Blocking an empty Create Post submission.
* Rendering field-level validation feedback.
* Successful Create Post submission using a mocked API response.

Final automated test result:

```text
Test Files: 3 passed
Tests: 7 passed
```

### Production Build

Create the optimized production build:

```bash
npm run build
```

Windows PowerShell alternative:

```powershell
npm.cmd run build
```

The generated files are placed in the `dist` folder. The generated `dist` folder is not committed to the repository.

### Production Preview

Run the generated production build locally:

```bash
npm run preview
```

Windows PowerShell alternative:

```powershell
npm.cmd run preview
```

Open the preview URL displayed by Vite, usually:

```text
http://localhost:4173/
```

Routes, assets, styles, API requests, Pinia state, localStorage persistence, and form behavior were verified using the production preview.

### Regression QA

A complete frontend regression test was performed for:

* Route navigation and Not Found handling.
* Direct route refresh.
* Posts loading, search, query synchronization, error, Retry, and empty states.
* Dynamic Post Details.
* Favorites synchronization and localStorage persistence.
* Create Post validation and submission states.
* Keyboard navigation and visible focus styles.
* Desktop, tablet, and mobile layouts.
* Browser Console and Network output.
* Production build and preview behavior.

The complete checklist is available at:

```text
frontend-qa-task-10.md
```

Final regression result:

```text
All automated and manual frontend checks passed.
Known remaining issues: None.
```

### Task 10 Screenshots

#### Automated Tests Passing

![Task 10 tests passing](screenshots/task-10-tests-passing.png)

#### Production Preview

![Task 10 production preview](screenshots/task-10-production-preview.png)

#### Tested Frontend Flow

![Task 10 tested flow](screenshots/task-10-tested-flow.png)

### Known Limitations

* JSONPlaceholder simulates successful POST requests but does not permanently store newly created posts.
* Favorite post IDs are stored in the current browser's localStorage and are not synchronized between devices.
* The application uses hash-based routing to support direct refresh when used with static hosting.
* The displayed posts are testing data provided by JSONPlaceholder.

No unresolved frontend blockers or known application issues remain.

