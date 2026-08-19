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

## Component Structure

```text
task-07-vue-app/
|-- public/
|-- screenshots/
|   |-- task-07-vue-page.png
|   |-- task-07-filter-event.png
|   |-- task-07-api-posts.png
|   |-- task-08-navigation.png
|   |-- task-08-post-details.png
|   `-- task-08-route-query.png
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- SiteHeader.vue
|   |   |-- HeroSection.vue
|   |   |-- ProjectFilter.vue
|   |   |-- ProjectCard.vue
|   |   |-- ProjectsSection.vue
|   |   `-- PostsSection.vue
|   |-- composables/
|   |   `-- usePosts.js
|   |-- router/
|   |   `-- index.js
|   |-- views/
|   |   |-- HomeView.vue
|   |   |-- ProjectsView.vue
|   |   |-- PostsView.vue
|   |   |-- PostDetailsView.vue
|   |   |-- ContactView.vue
|   |   `-- NotFoundView.vue
|   |-- App.vue
|   |-- main.js
|   `-- style.css
|-- index.html
|-- package.json
|-- package-lock.json
|-- vite.config.js
`-- README.md
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

## Known Limitations

- The posts section depends on the external JSONPlaceholder API and requires an internet connection.
- JSONPlaceholder provides demonstration content rather than real company posts.
- The application does not use Vue Router or a state-management library because they are outside the scope of Task 07.
- The application uses hash-based routing so route refreshes remain compatible with static hosting.