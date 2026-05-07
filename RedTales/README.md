# 🌹 RedTales Frontend

This is the React-based frontend for **RedTales AI**, built with Vite, Tailwind CSS, and Framer Motion.

## 🚀 Development

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_AUTH0_DOMAIN=your_auth0_domain
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   ```

### Scripts
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview the production build.

## 🏗️ Architecture

- **CycleHub**: The central interface for managing cycle start dates and durations.
- **ReflectionNetwork**: A visual mapping of user reflections using a tree-like structure.
- **CharacterCards**: Individual cards representing each phase of the cycle with unique advice and animations.
- **Sync Logic**: Communicates with the FastAPI backend to fetch AI-generated recommendations and sync with Google services.

## 🎨 Styling
The project uses **Tailwind CSS** for layout and **Framer Motion** for smooth, organic transitions. Custom fonts like *Outfit* are used to give the application a premium, modern feel.
