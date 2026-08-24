# Task 10 - Frontend Regression QA

## Test Environment

* Development server: Vite development mode
* Production verification: Vite production build and preview
* Browsers: Google Chrome and Microsoft Edge
* Tested screen widths: 375px, 768px, 1024px, and 1440px
* API: JSONPlaceholder
* Automated testing: Vitest, Vue Test Utils, and jsdom

## Automated Testing Results

* [x] Vitest runs using the documented npm test command.
* [x] All test files pass without uncaught errors.
* [x] Pinia favorite add/remove behavior is tested.
* [x] Favorite IDs restoration from localStorage is tested.
* [x] Shared posts loading uses a mocked API service.
* [x] PostCard important content rendering is tested.
* [x] PostCard favorite interaction is tested.
* [x] Empty Create Post form submission is blocked.
* [x] Field-level validation messages are rendered.
* [x] Successful Create Post submission is tested with a mocked service.
* [x] Automated tests do not depend on the public API being available.

Final result:

```text
Test Files: 3 passed
Tests: 7 passed
```

## Routing and Navigation

* [x] Home route works.
* [x] Projects route works.
* [x] Posts route works.
* [x] Contact route works.
* [x] Favorites route works.
* [x] Create Post route works.
* [x] Dynamic Post Details route works with valid IDs.
* [x] Invalid post IDs show a controlled error state.
* [x] Unknown routes show the Not Found view.
* [x] Browser Back and Forward navigation works.
* [x] Direct refresh works with hash-based routing.
* [x] Active navigation states update correctly.

## Posts and API Integration

* [x] Posts load successfully through the configured API service.
* [x] Loading state appears correctly.
* [x] API error state displays understandable feedback.
* [x] Retry action works.
* [x] Posts search works.
* [x] Search value is synchronized with the route query string.
* [x] Search value remains available after refresh.
* [x] Post Details loads the selected post.
* [x] API base URL is read from `VITE_API_BASE_URL`.
* [x] `.env.example` documents the required API variable.

## Favorites and Pinia

* [x] Favorite state is shared through Pinia.
* [x] Posts can be added to Favorites from the Posts view.
* [x] Posts can be added or removed from the Post Details view.
* [x] Favorites update immediately across routes.
* [x] Shared favorite count updates immediately.
* [x] Favorite post IDs are stored in localStorage.
* [x] Favorites remain available after browser refresh.
* [x] Favorites view displays selected posts.
* [x] Favorites empty state appears when no posts are selected.
* [x] Favorite posts can be removed from the Favorites view.

## Create Post Form

* [x] Title is required.
* [x] Title rejects whitespace-only and short values.
* [x] Body is required.
* [x] Body rejects whitespace-only and short values.
* [x] User ID must be a positive whole number.
* [x] Field-level validation messages are visible and accessible.
* [x] Character counter updates while typing.
* [x] Invalid data is blocked before submission.
* [x] Submit button is disabled while processing.
* [x] Duplicate submissions are prevented.
* [x] Successful submission shows the returned post ID.
* [x] Failed submission preserves entered form values.
* [x] Retry works after a simulated API failure.
* [x] Create Another Post resets the form deliberately.
* [x] JSONPlaceholder simulated persistence is explained to the user.

## Production Build and Preview

* [x] `npm run build` completes successfully.
* [x] Generated production output runs using `npm run preview`.
* [x] Routes work from the production preview URL.
* [x] Styles and assets load correctly.
* [x] API requests work in production preview.
* [x] Pinia state works in production preview.
* [x] localStorage persistence works in production preview.
* [x] Create Post behavior works in production preview.
* [x] Browser Console contains no unresolved application errors.
* [x] Network panel contains no unexpected failed requests.
* [x] Generated `dist` folder is not committed.

## Responsive and Accessibility QA

* [x] Desktop layout works at 1440px.
* [x] Tablet layout works at 768px and 1024px.
* [x] Mobile layout works at 375px.
* [x] No horizontal scrolling is present.
* [x] No controls are clipped or hidden.
* [x] Navigation links are keyboard accessible.
* [x] Buttons and form fields are keyboard accessible.
* [x] Visible focus states are available.
* [x] Form fields have visible labels.
* [x] Validation feedback is associated with its fields.
* [x] Important status and error messages use accessible roles.

## Final Result

All automated tests, production-build verification, production-preview testing, and manual regression checks were completed successfully.

Known remaining issues: None.
