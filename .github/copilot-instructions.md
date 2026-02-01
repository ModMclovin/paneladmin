# AdminSelect Codebase Guide for AI Coding Agents

## Project Overview
**AdminSelect** is a React + Vite web application for healthcare administration with role-based access control. It supports multiple user roles (SuperAdmin, HospitalAdmin, Reception, Helper) with separate login and registration flows.

## Architecture & Key Components

### Frontend Stack
- **Framework**: React 19 with Vite bundler (dev: `npm run dev`, build: `npm run build`)
- **Styling**: Tailwind CSS (configured in `tailwind.config.js`)
- **Icons**: lucide-react for UI icons
- **Routing**: React Router DOM v7 for multi-role navigation
- **HTTP Client**: axios for API calls (see [api/axios.js](api/axios.js))

### Critical Application Structure
- **Entry**: [src/main.jsx](src/main.jsx) → [src/App.jsx](src/App.jsx) sets up routing
- **Pages**: [src/pages/](src/pages/) contains role-specific views (HomePage, HospitalAdmin, Reception, LoginPage, RegisterPage, SuperLogin)
- **Components**: [src/components/](src/components/) has Navbar and Modal utilities
- **API Layer**: [src/api/axios.js](src/api/axios.js) provides axios instance with ngrok base URL

### Authentication & Authorization Pattern
1. **Login**: Routes via role returned from API (`navigateByRole` in LoginPage)
2. **Protection**: `ProtectedRoute` component checks `localStorage.isAdminLoggedIn`
3. **Logout**: Clears localStorage and redirects to `/login`
4. **Roles**: SuperAdmin → `/superadmin`, HospitalAdmin → `/hospital`, Reception → `/reception`, Helper → registered via `/register`

## API Integration Patterns

### API Endpoints
- **Base URL** (direct axios): `https://b63d0477cea0.ngrok-free.app/`
- **Base URL** (direct fetch): `https://localhost:7252` with `ngrok-skip-browser-warning` header
- **Auth**: Phone number + password (no JWT tokens observed)
- **Registration**: POST to `https://localhost:7252/registerUser/SpecifiedRole/{role}` with `fullName`, `phoneNumber`, `email`, `password`, `confirmPassword`, `role`

### Data Fetching Examples
- **HomePage.jsx**: Uses native `fetch()` with custom wrapper `fetchAPI()` for cleaner error handling
- **RegisterPage.jsx**: Uses `axios.post()` directly with headers including `ngrok-skip-browser-warning`
- **LoginPage.jsx**: Uses axios for credential validation and role-based routing

## Code Patterns & Conventions

### Component Structure
- Functional components with React hooks (`useState`, `useEffect`, `useCallback`)
- Props drilling for `onLogout` callbacks (see HomePage signature)
- No context API or state management (Redux not present)

### Form Handling
- **Controlled inputs**: `onChange` updates state, `disabled={loading}` during submission
- **Validation**: Client-side checks before API calls (email regex, phone format, password length)
- **Error display**: Red alert boxes with `bg-red-50 border border-red-200` styling
- **Loading states**: Loader spinner from lucide-react with disabled button styles

### UI Patterns
- **Gradients**: `bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50` backgrounds
- **Shadows**: `shadow-lg shadow-blue-200` for prominent elements
- **Responsive**: `grid grid-cols-1 md:grid-cols-2` for layout adaption
- **Disabled state styling**: `disabled:opacity-50 disabled:cursor-not-allowed`

## Development Workflow

### Commands
```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build to dist/
npm run lint      # Run ESLint on codebase
npm run preview   # Preview built app locally
```

### ESLint Config
- Uses `@eslint/js` with React plugin rules (see [eslint.config.js](eslint.config.js))
- React Fast Refresh enabled for HMR

### HTTPS/ngrok Setup
- Backend API requires HTTPS (localhost:7252)
- ngrok tunnel used for API base URL (`https://b63d0477cea0.ngrok-free.app/`)
- Always include `ngrok-skip-browser-warning: true` header in requests

## Common Tasks

### Adding a New Page
1. Create `.jsx` file in [src/pages/](src/pages/)
2. Import in [src/App.jsx](src/App.jsx)
3. Add Route with protected route if needed
4. Use `useNavigate()` hook for programmatic navigation

### Modifying API Calls
1. Check if endpoint returns role (for login routing) or user data
2. Use axios instance from [src/api/axios.js](src/api/axios.js) OR direct axios with headers
3. Always add `ngrok-skip-browser-warning` header for ngrok endpoints
4. Handle errors with try-catch and set error state for UI display

### Styling Updates
- Tailwind classes applied inline (no CSS modules observed)
- Use existing color scheme: blue-600, indigo-600, gray-700 for consistency
- Test responsive breakpoints with `md:` prefix

## Gotchas & Important Notes
- **localStorage** is the only auth persistence mechanism (no JWT/session storage observed)
- **Two API base URLs in use**: axios instance vs. direct fetch—maintain consistency per file
- **React 19**: May use newer hooks; check React 19 docs for breaking changes
- **Helper role**: Only registered, no direct login page (routes to registration)
- **Role navigation**: Must match exact case (`SuperAdmin`, not `superadmin`) in switch statements
