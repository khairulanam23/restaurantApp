# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB database
- Vercel account (recommended)

## Environment Setup

Create `.env.local` file with required variables:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fooddelivery

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Optional: Third-party Integrations
STRIPE_SECRET_KEY=sk_live_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
\`\`\`

## Vercel Deployment

### 1. Prepare Repository
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### 2. Deploy to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

### 3. Configure Environment Variables in Vercel
Add all environment variables from `.env.local` to Vercel dashboard.

## Database Setup

### MongoDB Atlas
1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access
4. Create database user
5. Get connection string

### Local MongoDB
\`\`\`bash
# Install MongoDB
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/fooddelivery
\`\`\`

## Production Checklist

### Security
- [ ] JWT secret is secure (32+ characters)
- [ ] Database credentials are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented

### Performance
- [ ] Images are optimized
- [ ] Bundle size is minimized
- [ ] Caching is configured
- [ ] Database queries are optimized
- [ ] CDN is configured

### Monitoring
- [ ] Error tracking is set up
- [ ] Analytics are configured
- [ ] Uptime monitoring is active
- [ ] Performance monitoring is enabled

## Custom Domain Setup

### 1. Add Domain to Vercel
1. Go to project settings
2. Add custom domain
3. Configure DNS records

### 2. SSL Certificate
Vercel automatically provides SSL certificates for custom domains.

## Scaling Considerations

### Database
- Use MongoDB Atlas for automatic scaling
- Implement database indexing
- Consider read replicas for high traffic

### Application
- Use Vercel's edge functions
- Implement caching strategies
- Consider microservices architecture

### File Storage
- Use cloud storage (AWS S3, Cloudinary)
- Implement CDN for static assets

## Backup Strategy

### Database Backups
\`\`\`bash
# MongoDB backup
mongodump --uri="mongodb+srv://..." --out=backup/

# Restore
mongorestore --uri="mongodb+srv://..." backup/
\`\`\`

### Code Backups
- Use Git for version control
- Regular repository backups
- Tag releases for rollback capability

## Monitoring and Maintenance

### Health Checks
Implement health check endpoints:
\`\`\`javascript
// /api/health
export async function GET() {
  return Response.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
}
\`\`\`

### Log Management
- Use structured logging
- Implement log rotation
- Monitor error rates

### Updates
- Regular dependency updates
- Security patch management
- Feature deployment pipeline

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

**Database Connection:**
- Verify connection string format
- Check network access rules
- Confirm database user permissions

**Environment Variables:**
- Ensure all required variables are set
- Check variable naming and values
- Verify deployment platform configuration

### Support Resources
- Vercel Documentation
- Next.js Deployment Guide
- MongoDB Atlas Documentation
