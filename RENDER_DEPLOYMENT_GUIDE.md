# Deploying Plant Marketplace on Render.com

This guide will help you deploy your Plant Marketplace application to Render.com using Docker.

## Prerequisites

1. **GitHub Account** - You'll need a GitHub account to connect with Render
2. **Render Account** - Sign up at [https://render.com](https://render.com)
3. **Repository** - Your code should be in a public GitHub repository

## Step-by-Step Deployment Guide

### Step 1: Prepare Your GitHub Repository

1. Ensure all your files are committed to your GitHub repository
2. Make sure you have these files in your repository root:
   - `Dockerfile` (already created)
   - `render.yaml` (already created)
   - `docker-compose.yml`
   - `client/` folder
   - `server/` folder
   - `.gitignore`

### Step 2: Sign Up/Log In to Render

1. Go to [https://render.com](https://render.com)
2. Sign up using your GitHub account or log in if you already have an account

### Step 3: Create a New Web Service

1. Click on "New +" button in your Render dashboard
2. Select "Web Service"
3. Connect your GitHub account if prompted

### Step 4: Select Your Repository

1. Choose the repository containing your Plant Marketplace code
2. Select the branch you want to deploy (usually `main` or `master`)

### Step 5: Configure Your Web Service

Render will automatically detect that you're using Docker based on the `Dockerfile` and `render.yaml`:

- **Environment**: Docker (auto-detected)
- **Region**: Oregon (or your preferred region)
- **Plan**: Free (for the free tier)

### Step 6: Configure Environment Variables

In the "Environment Variables" section, add the following (these will be managed by the render.yaml file):

**Render will automatically set:**
- `PORT` - Render's assigned port (already configured in render.yaml)
- `MONGODB_URI` - Connection string for the database (already configured in render.yaml)

**You need to add manually (if required):**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key  
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

### Step 7: Set Build and Start Commands

These are handled automatically by the Dockerfile, so no changes needed.

### Step 8: Deploy!

1. Click "Create Web Service"
2. Render will start building your Docker image
3. Wait for the build to complete (this may take 5-10 minutes)
4. Your application will be deployed and accessible via the URL provided

## Important Notes

### Database Setup
- Render will automatically create a MongoDB database based on your `render.yaml`
- The database connection string will be automatically provided via the `MONGODB_URI` environment variable

### Port Configuration
- Your application is configured to use Render's PORT environment variable
- The health check endpoint `/api/health` is configured for Render monitoring

### Environment Variables
- Keep sensitive information like API keys secure using Render's environment variables
- Never commit API keys to your repository

## Accessing Your Deployed Application

Once deployed, you'll get a URL like:
`https://plant-marketplace-backend.onrender.com`

Your application will be accessible at this URL with:
- Frontend: `https://your-app-name.onrender.com`
- API: `https://your-app-name.onrender.com/api`
- Health check: `https://your-app-name.onrender.com/api/health`

## Troubleshooting

### Common Issues:

1. **Build fails**: Check the build logs in Render dashboard for specific errors
2. **Application crashes**: Verify all environment variables are set correctly
3. **Database connection issues**: Ensure `MONGODB_URI` is properly configured
4. **Port issues**: Your app is configured to use Render's PORT variable

### Health Check
The `/api/health` endpoint is configured to help Render monitor your application's health.

## Scaling and Maintenance

### Free Tier Limitations:
- Web services sleep after 15 minutes of inactivity
- Databases remain active
- 750 hours of web service usage per month

### Upgrading:
- You can upgrade to paid plans for more resources and features
- Paid plans offer faster builds and continuous uptime

## Updating Your Application

1. Make changes to your code locally
2. Commit and push changes to your GitHub repository
3. Render will automatically rebuild and deploy your application
4. Monitor the deployment in your Render dashboard

Your Plant Marketplace application is now ready for deployment on Render.com!
