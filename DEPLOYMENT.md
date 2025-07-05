# Spotify Rewrapped - Deployment Guide

## 🚀 Production Deployment

### Prerequisites

1. **Spotify Developer Account**
   - Create an app at https://developer.spotify.com/dashboard
   - Note your Client ID and Client Secret
   - Add your production domain to the redirect URIs

2. **Vercel Account** (recommended deployment platform)
   - Sign up at https://vercel.com
   - Connect your GitHub repository

### Environment Variables

Set these environment variables in your production environment:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key_minimum_32_characters
```

### Deployment Steps

#### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Configure Spotify App**
   - Go to your Spotify app settings
   - Add your Vercel domain to redirect URIs:
     - `https://your-app.vercel.app/api/auth/callback/spotify`

#### Option 2: Manual Deployment

1. **Build the Application**
   ```bash
   npm run build
   npm run start
   ```

2. **Environment Setup**
   - Copy `.env.production` to `.env.local`
   - Fill in your production values

### Security Checklist

- [ ] Use strong NEXTAUTH_SECRET (minimum 32 characters)
- [ ] Verify all environment variables are set
- [ ] Confirm Spotify redirect URIs match your domain
- [ ] Enable HTTPS in production
- [ ] Test authentication flow

### Performance Optimizations

The app includes several performance optimizations:

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **API Caching**: Session storage for API responses
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA attributes and screen reader support

### Monitoring

The app includes built-in monitoring for:

- Web Vitals tracking
- Error boundary logging
- Network status monitoring
- Memory usage tracking (development)

### Troubleshooting

#### Common Issues

1. **Authentication Fails**
   - Check NEXTAUTH_URL matches your domain
   - Verify Spotify redirect URIs are correct
   - Ensure NEXTAUTH_SECRET is set

2. **API Errors**
   - Check Spotify app permissions
   - Verify client credentials
   - Check rate limiting

3. **Build Errors**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are installed

### Health Checks

Test these URLs after deployment:

- `https://your-domain.com/` - Landing page
- `https://your-domain.com/api/auth/signin` - Authentication
- `https://your-domain.com/top-songs` - Main functionality

### Support

For issues:

1. Check the console for error messages
2. Verify environment variables
3. Test locally with production build
4. Check Spotify API status

---

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start
```

### Testing

```bash
# Run type checking
npm run type-check

# Build test
npm run build
```

---

## 📦 Features

- ✅ Spotify OAuth authentication
- ✅ Top tracks and artists analysis
- ✅ Recently played history
- ✅ Listening statistics and charts
- ✅ Responsive design
- ✅ Error handling and retry logic
- ✅ Accessibility support
- ✅ Performance optimizations
- ✅ Production-ready deployment
