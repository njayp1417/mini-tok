# MiniTok - TikTok-Like App MVP

A prototype TikTok-style app built with React and Next.js.

## Features

- Scrollable feed of text clips
- Like interactions
- Simple UI/UX focused on mobile experience

## Tech Stack

- **Frontend**: React + Next.js
- **Styling**: Tailwind CSS
- **Backend**: Supabase (planned)
- **Hosting**: Vercel (planned)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
minitok/
├─ public/                # Static assets
├─ src/
│  ├─ components/         # UI components (Feed, ClipItem)
│  ├─ pages/              # Next.js pages
│  ├─ services/           # API helpers
│  └─ styles/             # CSS styles
├─ package.json
└─ README.md
```

## Development Roadmap

- [x] Basic project scaffold
- [x] Feed UI with text clips
- [x] Like interactions
- [ ] Upload form
- [ ] Supabase integration
- [ ] Video support
- [ ] AI features (captions, recommendations)