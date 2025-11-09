# Paste-Life

A minimal, secure Pastebin clone with static React frontend and Supabase backend. Share code snippets with syntax highlighting, privacy controls, and expiration options.

## Features

- 📝 Create pastes with optional title, language selection, and expiration
- 🔒 Privacy levels: Public, Unlisted, Private
- 🎨 Syntax highlighting for 17+ languages
- 🔑 Secret token authentication for edit/delete
- 📊 View counter
- 🔗 Raw text and embeddable views
- ⚡ Rate limiting
- 🌓 Dark mode support

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Express.js (for development) or Supabase Edge Functions (for production)
- **Database**: Supabase (PostgreSQL with RLS)
- **Deployment**: GitHub Pages (frontend) + Supabase (backend)

## Quick Start

### 1. Prerequisites

- Node.js 20+
- Supabase account
- Git

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd paste-life
npm install
```

### 3. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the schema from `DATABASE_SETUP.md`
3. Copy your project URL and keys from Settings > API

### 4. Environment Variables

Create a `.env` file (or add to Replit Secrets):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: Never commit the service role key to git. Add `.env` to `.gitignore`.

### 5. Development

```bash
npm run dev
```

Visit http://localhost:5000

### 6. Build for Production

```bash
npm run build
```

The static site will be in `dist/` ready for GitHub Pages.

## GitHub Pages Deployment

### Setup

1. Push your code to GitHub
2. Go to repository Settings > Secrets and variables > Actions
3. Add secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Go to Settings > Pages
5. Set Source to "GitHub Actions"

### Deploy

The `.github/workflows/deploy.yml` workflow will automatically deploy on push to `main`.

## Security

### Row Level Security (RLS)

The database uses RLS policies to ensure:
- Public/unlisted pastes are viewable by anyone
- Private pastes require secret token verification (server-side)
- Anyone can create pastes
- Edit/delete operations must go through backend API with token verification

### Secret Token

- Generated server-side (32-character nanoid)
- Required for edit/delete operations
- Never exposed in frontend code
- Verified server-side only

### Rate Limiting

- 5 paste creations per minute per IP address
- In-memory implementation (resets on server restart)
- For production, consider Redis-backed rate limiting

## API Endpoints

All endpoints use `/api/pastes` prefix:

### POST `/api/pastes`
Create a new paste.

**Body:**
```json
{
  "title": "Optional title",
  "content": "Paste content (required)",
  "language": "javascript",
  "privacy": "unlisted",
  "expiration": "1w"
}
```

**Response:**
```json
{
  "slug": "abc12345",
  "secretToken": "long-secret-token-here"
}
```

### GET `/api/pastes/:slug`
View a paste. Include `?token=xxx` for private pastes.

### PATCH `/api/pastes/:slug`
Edit a paste (requires secret token).

### DELETE `/api/pastes/:slug`
Delete a paste (requires secret token).

### GET `/api/pastes/:slug/raw`
Get raw text content. Include `?token=xxx` for private pastes.

## Edge Functions (Optional)

For production deployment without a Node.js backend, use Supabase Edge Functions. See `supabase/functions/paste-operations/` for example implementation.

Deploy Edge Functions:
```bash
supabase functions deploy paste-operations
```

## Project Structure

```
paste-life/
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities (Supabase client)
│   │   └── App.tsx       # Root component
│   └── index.html
├── server/               # Backend Express server
│   ├── routes.ts        # API endpoints
│   ├── supabase.ts      # Supabase admin client
│   └── utils/           # Helpers (slug generation)
├── supabase/
│   └── functions/       # Edge Function examples
├── DATABASE_SETUP.md    # SQL schema
└── README.md
```

## Configuration

### Expiration Options

- `1h` - 1 hour
- `1d` - 1 day
- `1w` - 1 week
- `never` - No expiration

### Privacy Levels

- `public` - Listed in public feed (if implemented)
- `unlisted` - Accessible via direct link only
- `private` - Requires secret token to view

### Supported Languages

JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, Ruby, PHP, SQL, JSON, YAML, Markdown, Bash, and Plain Text.

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.
