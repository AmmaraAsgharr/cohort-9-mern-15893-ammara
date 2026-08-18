# NoteSpace 

A full-stack notes application where you can capture ideas, organize thoughts, and manage your notes — beautifully.

## Features

 **Authentication** — Secure signup/login with JWT
 **Notes CRUD** — Create, read, update, and delete notes
 **Color-coded notes** — Organize visually with 6 color themes
 **Tags** — Categorize notes (personal, work, ideas, urgent, reading, project, daily)
 **Pin notes** — Keep important notes at the top
 **Search & Filter** — Find notes by title/content, filter by tag
 **Sort** — By last edited, created date, or alphabetically
 **Grid/List view** — Switch between layouts
 **Profile** — View stats: total notes, words written, pinned count, top tags
 **Rich text editor** — Bold, italic, underline, headings, lists, text color

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB Atlas (Mongoose)
- JWT + bcrypt for authentication
- Pino for logging
- Mocha + Chai + Supertest for testing

**Frontend**
- React 18 + Vite
- Axios for API calls
- Jest + React Testing Library for testing

## Project Structure

NotesApplication/
├── backend/
│ ├── src/
│ │ ├── controllers/ # Request handling
│ │ ├── services/ # Business logic
│ │ ├── models/ # Mongoose schemas
│ │ ├── routes/ # API routes
│ │ ├── middleware/ # Auth, error handling
│ │ └── utils/ # Validators
│ └── tests/ # Backend tests (Mocha)
└── frontend/
├── src/
│ ├── pages/ # AuthScreen, Dashboard, NoteEditor, UserProfile
│ ├── components/ # NoteCard, NoteGrid, FilterChip, etc.
│ ├── api/ # Axios client + service functions
│ ├── Context/ # AuthContext
│ ├── hooks/ # useColorCycle
│ └── constants/ # Colors, tags
└── tests/ # Frontend tests (Jest + RTL)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173

Run the backend:
```bash
npm run dev
```

Run backend tests:
```bash
npm test
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

VITE_API_BASE_URL=http://localhost:5000/api
Run the frontend:
```bash
npm run dev
```

Run frontend tests:
```bash
npm test
```

The app will be available at `http://localhost:5173`.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in |

### Notes (requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes for the logged-in user |
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes/:id` | Get a specific note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Testing

- **Backend:** 12 tests covering auth (signup, login, validation, duplicate handling) and notes (CRUD operations, ownership checks)
- **Frontend:** 21 tests covering components (FilterChip, NoteCard, EmptyState, SectionLabel), hooks (useColorCycle), API services (notesService), and pages (AuthScreen)

## Author

Ammara Asghar — Cohort 9, React+Node.js Internship,10pearls
