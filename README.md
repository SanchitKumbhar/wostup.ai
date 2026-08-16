# wostup.ai Frontend Workspace

Welcome to the frontend workspace for **wostup.ai**. This project is built using React, Vite, and Three.js, offering a modern, dynamic, and immersive user experience.

## Tech Stack
- **Framework:** React 19 + Vite
- **3D Rendering:** Three.js + React Three Fiber / Drei
- **State & Data Fetching:** TanStack React Query + Axios
- **Styling:** Custom CSS with GSAP for animations
- **Authentication:** Clerk
- **Real-time:** Socket.io

## Prerequisites
- Node.js (v18+)
- npm or yarn

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd wostup.ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the example environment file and fill in your credentials.
   ```bash
   cp .env.example .env.local
   ```
   Add your Clerk Publishable Key and API URL to `.env.local`.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## Security & Secrets
- Never commit `.env.local` or `.env` files. These are ignored by Git.
- All secrets are managed via environment variables.

## License
Proprietary software. All rights reserved.
