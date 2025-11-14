# MyApp - Next.js Google Authentication

A production-ready Next.js application with Google Authentication using OAuth 2.0 PKCE (Proof Key for Code Exchange).

## Features

- 🔐 Google Authentication via OAuth 2.0 PKCE (works with static exports!)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔒 Protected routes
- ⚡ Next.js 14 App Router
- 📝 TypeScript
- 🧹 ESLint + Prettier
- 🧪 Jest unit tests with React Testing Library
- ☁️ Static export support for S3/CloudFront deployment

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
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

**Note:** Only the Client ID is needed for PKCE flow (no Client Secret required!)

### Getting Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen
6. Create an OAuth 2.0 Client ID (Web application)
7. Add authorized redirect URIs:
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.com/auth/callback`
8. Copy the Client ID to your `.env.local` file as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### OAuth 2.0 PKCE Flow

This application uses **OAuth 2.0 PKCE (Proof Key for Code Exchange)** which:
- ✅ Works with static site deployments (S3, CloudFront, etc.)
- ✅ No server-side API routes required
- ✅ More secure than traditional OAuth flows
- ✅ No Client Secret needed (public client)

The PKCE flow:
1. Client generates a code verifier and challenge
2. User is redirected to Google for authentication
3. Google redirects back with an authorization code
4. Client exchanges code + verifier for tokens
5. Tokens are stored client-side in localStorage

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
│   └── auth/
│       └── callback/
│           └── page.tsx         # OAuth callback handler
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── AuthButton.tsx
├── lib/
│   ├── pkce.ts                  # PKCE utilities
│   ├── auth-client.tsx          # Client-side auth context
│   └── auth.ts                  # Legacy NextAuth config (optional)
├── styles/
│   └── globals.css
└── ...
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (standalone)
- `npm run build:static` - Build for static export (S3/CloudFront)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run test:coverage` - Run Jest tests with coverage report
- `npm run deploy` - Build static export and deploy to AWS (CDK)

## Testing

This project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/react) for unit testing.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests are located in `__tests__` directories next to the components they test:

```
components/
├── __tests__/
│   ├── UserGrid.test.tsx
│   ├── AuthButton.test.tsx
│   ├── DashboardContent.test.tsx
│   ├── Footer.test.tsx
│   └── Navbar.test.tsx
lib/
└── __tests__/
    └── mockData.test.ts
```

### Writing Tests

Tests follow the pattern:
- Test files are named `*.test.tsx` or `*.test.ts`
- Tests use React Testing Library for component testing
- Mock data is used for testing components
- Next.js specific features (router, image, next-auth) are mocked in `jest.setup.js`

## Deployment

### Deploy to AWS using CDK

This project includes AWS CDK infrastructure to deploy the Next.js application to S3 and CloudFront.

#### Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured:
   ```bash
   aws configure
   ```
3. **Node.js 18+** and npm

#### Setup

1. **Install dependencies:**
   ```bash
   npm install
   cd infrastructure
   npm install
   cd ..
   ```

2. **Bootstrap CDK** (only needed once per AWS account/region):
   ```bash
   npm run cdk:bootstrap
   ```
   Or manually:
   ```bash
   cd infrastructure
   cdk bootstrap
   ```

3. **Build the Next.js application:**
   ```bash
   npm run build
   ```

#### Deployment Options

**Option 1: Static Export (Recommended for S3 + CloudFront)**

For a fully static site with OAuth 2.0 PKCE (authentication works!):

```bash
npm run build:static
cd infrastructure
cdk deploy
```

Or use the deploy script:
```bash
npm run deploy
```

**Option 2: Standalone Build**

For deploying with server-side features (requires additional Lambda setup):

```bash
npm run build
cd infrastructure
cdk deploy
```

#### Deploy

```bash
# Quick deploy (builds and deploys)
npm run deploy

# Or manually
cd infrastructure
cdk deploy
```

#### CDK Commands

- `npm run cdk:synth` - Synthesize CloudFormation template
- `npm run cdk:diff` - Compare deployed stack with current state
- `npm run cdk:deploy` - Deploy the stack
- `cdk destroy` - Destroy the stack

#### After Deployment

The CDK stack will output:
- **CloudFront Distribution URL** - Your application URL
- **S3 Bucket Name** - The bucket containing your assets
- **Distribution ID** - CloudFront distribution ID

#### Environment Variables

For production static deployment, set the environment variable at **build time**:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-client-id npm run build:static
```

Or set it in your CI/CD pipeline before building.

**Important:** Since this is a public variable (NEXT_PUBLIC_ prefix), it will be embedded in the static build. This is safe for OAuth Client IDs as they are meant to be public.

#### Important Notes

- **OAuth 2.0 PKCE**: This app uses PKCE flow which works perfectly with static exports! No API routes needed.
- **Client ID**: Only the Client ID is needed (no Client Secret required for PKCE)
- **Redirect URIs**: Make sure to add your production domain's callback URL in Google Cloud Console:
  - `https://your-cloudfront-domain.cloudfront.net/auth/callback`
- **Token Storage**: Tokens are stored in browser localStorage (secure for PKCE flow)

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (your Google OAuth Client ID)
4. Update Google OAuth redirect URI to include your production URL:
   - `https://your-domain.vercel.app/auth/callback`
5. Deploy!

**Note:** Vercel supports both static exports and server-side rendering. The PKCE flow works with both!

## License

MIT

