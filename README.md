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
- 🧪 Jest unit tests with React Testing Library

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
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run test:coverage` - Run Jest tests with coverage report

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

For a fully static site (note: API routes won't work):

```bash
./scripts/build-static.sh
cd infrastructure
cdk deploy
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

For production, you'll need to set environment variables. Since this is a static deployment, you have a few options:

1. **Use AWS Systems Manager Parameter Store** or **Secrets Manager**
2. **Build environment variables into the static build** (not recommended for secrets)
3. **Use Lambda@Edge** for API routes (requires additional setup)

#### Important Notes

- **API Routes**: Static export doesn't support API routes. For NextAuth to work, you'll need to:
  - Use a separate API service (e.g., API Gateway + Lambda)
  - Or deploy API routes separately using Lambda@Edge
  - Or use a hybrid approach with serverless functions

- **Environment Variables**: Static builds don't have access to runtime environment variables. You'll need to configure these at build time or use a different deployment strategy.

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

