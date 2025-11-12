# MyApp - Next.js Google Authentication

A production-ready Next.js application with Google Authentication using NextAuth.js.

## Features

- 🔐 Google Authentication via NextAuth.js
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔒 Protected routes
- ⚡ Next.js 14 App Router
- 📝 TypeScript
- 🧹 ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gauth
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local` file with your Google OAuth credentials:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
```

### Getting Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen
6. Create an OAuth 2.0 Client ID (Web application)
7. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
8. Copy the Client ID and Client Secret to your `.env.local` file

### Generate NEXTAUTH_SECRET

You can generate a random secret using:
```bash
openssl rand -base64 32
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                 # Landing page (public)
│   ├── dashboard/
│   │   └── page.tsx             # Protected page (requires auth)
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts    # NextAuth API route
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── AuthButton.tsx
│   └── SessionProvider.tsx
├── lib/
│   └── auth.ts                  # NextAuth configuration
├── styles/
│   └── globals.css
└── ...
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
4. Update Google OAuth redirect URI to include your production URL:
   - `https://your-domain.vercel.app/api/auth/callback/google`
5. Deploy!

## License

MIT

