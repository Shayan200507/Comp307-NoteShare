<!-- Shayan Sheikh -->
# NoteShare

NoteShare is a student platform for sharing PDF course notes. Users can register for courses, upload notes, browse and download PDFs, and receive notifications about new notes in their courses.

This document describes the features implemented as of November 25, 2026.

## Main navigation

The header contains Home, Browse, Upload, Request, Log out, and a hamburger dropdown. The active main navigation item is highlighted.

| Menu item | Route | Current functionality |
| --- | --- | --- |
| Home | `/home` | Introduction, books illustration, and a course search bar. The search sends the query to Browse, but filtering is not implemented yet. |
| Browse | `/browse` | Fetches all notes and displays clickable note cards, newest first. |
| Upload | `/upload` | Uploads a PDF with a course, title, and description. |
| Request | `/request` | Placeholder page with a login check. Note requests are not implemented yet. |
| Log out | No separate page | Ends the session and reloads the current page. Its session check then redirects to signup. |

## Hamburger dropdown

Clicking the hamburger button toggles the dropdown using React state and conditional rendering. Selecting an available page closes the menu.

| Option | Route | Current functionality |
| --- | --- | --- |
| My Courses | `/my-courses` | Shows registered courses and available courses, with Add and Remove buttons. |
| My Uploads | Not implemented | Disabled menu option. |
| Saved Notes | Not implemented | Disabled menu option. |
| Notifications | `/notifications` | Shows notifications for the logged-in user as clickable note cards. |

## Authentication

- Signup is available at `/`, and login at `/login`.
- Authentication uses a server session and cookies.
- Private pages check `/api/auth/me`. A failed session check redirects to signup.
- Content API routes use the `LoginCheck` middleware.
- Requests that need the session include credentials.

## Course subscriptions

My Courses displays the user's registered courses first, followed by available courses. Already registered courses are filtered out of the available list.

- **Add** registers the user for one course.
- **Remove** removes that course subscription, not the course itself.
- Successful additions and removals update a refresh dependency so both course lists are fetched again.
- **Back to Home** returns to the home page.

## Uploading notes

The upload form contains four required fields: Course, Title, Description, and File (PDF). The course dropdown fetches the user's registered courses from the backend.

The form uses React's `action` prop to send a `FormData` object. Multer processes the file field named `file`, saves the PDF, and the controller stores the note metadata in SQLite. The form shows uploading, success, and error messages.

After the note is saved, a notification is inserted for every user subscribed to that course, including the uploader if subscribed. These are in-app notifications, not email or push notifications.

The file picker works; drag-and-drop uploading is not implemented.

## Browsing, reading, and downloading

Browse uses a reusable `NoteCard` component. Each card displays the course code, title, description, PDF label, and upload date.

- Clicking a card, or pressing Enter while it is focused, opens `/readNote/:noteId`.
- Read Note checks the session and fetches the selected note in separate effects.
- The page displays the note details and embeds the PDF in an iframe.
- The Download button downloads the PDF using the note title as its filename.
- Back to Browse returns to the note list.

## Notifications

The Notifications page checks the session, then uses a separate effect to fetch notifications for that user. Results are ordered by notification creation time, newest first.

Notifications reuse the same `NoteCard` as Browse and include the associated note's course, title, description, and upload date. Clicking a card opens that note. Loading, error, and empty states are included. Notifications are fetched when the page loads; live updates and read/unread tracking are not implemented.

## Responsive layout and request handling

- Browse uses a three-column CSS grid, two columns below 900px, and one column below 600px.
- Notifications uses a single-column flex layout.
- The home hero and upload card stack vertically on smaller screens.
- Fetch effects use abort signals and cleanup to cancel requests when the component unmounts or dependencies change.
- Cancelled requests are ignored. Other data-fetch failures display an error; unauthorized responses redirect to signup.

## Backend endpoints

Authentication endpoints use the `/api/auth` prefix:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/signup` | Create an account. |
| POST | `/login` | Start a session. |
| POST | `/logout` | End the session. |
| GET | `/me` | Get the logged-in user's ID and email. |

Content endpoints use the `/api/Content` prefix and require login:

| Method | Path | Purpose / payload |
| --- | --- | --- |
| GET | `/getAllCourses` | List all courses. |
| GET | `/getUserCourse` | List the session user's registered courses. |
| POST | `/getUserCourse` | List registered courses using `{ "userId": 1 }`, checked against the session. |
| POST | `/registerCourses` | Register for one course using `{ "courseId": 3 }`. |
| DELETE | `/removeCourses` | Remove one subscription using `{ "courseId": 3 }`. |
| POST | `/uploadNotes` | Multipart form with `courseId`, `title`, `description`, and `file`. |
| GET | `/getAllNotes` | List note metadata and course codes without PDF URLs. |
| GET | `/retrieveFile/:noteId` | Get one note's details and PDF URL. |
| POST | `/getUserNotifications` | Get notifications using `{ "userId": 1 }`, checked against the session. |

## Technology and storage

- Frontend: React 19, React Router, Vite, and CSS Modules.
- Backend: Express, express-session, Multer, and SQLite.
- Database: `Backend/Database/Users.db`.
- Tables: `User`, `Course`, `Subscription`, `Note`, and `Notification`.
- PDF files are stored separately from their database metadata and served under `/Uploads`.

## Features still to implement

- Search filtering on Browse.
- My Uploads page and upload management.
- Saved Notes functionality.
- Creating and viewing note requests.
- Drag-and-drop uploads.
- Notification read/unread tracking and live updates.
