# Portfolio

A linux-inspired developer portfolio built with Next.js, featuring an interactive desktop interface with draggable windows, a Finder-style file browser, and mini-games.

## Features

- **Fedora linux Desktop GUI** - Dock, menubar, draggable/resizable windows
- **Finder Window** - Browse projects fetched from GitHub with README previews
- **Terminal** - Interactive skill showcase
- **Mini-Games** - Snake, 2048, Memory, Tic-Tac-Toe
- **Resume Viewer** - PDF viewer integration
- **Contact Window** - Email contact form

## Tech Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS, GSAP (animations)
- Three.js / React Three Fiber (3D)
- Zustand (state management)

## Setup

```bash
npm install
```

Create `.env.local`:
```
GITHUB_TOKEN=your_github_token
```

Run development server:
```bash
npm run dev
```

## Configuration

Edit `constants/index.ts` to customize:
- `GITHUB_USERNAME` - Your GitHub username
- `FEATURED_PROJECTS` - Additional repos to display in Projects (beyond pinned)
- `CONTACT_EMAIL` - Your contact email
- `techStack` - Skills displayed in terminal
- `socials` - Social media links

## Project Structure

```
├── app/              # Next.js app router
├── components/       # UI components (Dock, Navbar, etc.)
├── windows/          # Window content (Finder, Terminal, Games)
├── constants/        # Configuration
├── lib/              # GitHub API utilities
├── store/            # Zustand state
└── public/           # Static assets
```
