# Deployment Guide for AI Ticket Assistant

This guide will help you deploy your AI Ticket Assistant project on Render with Inngest integration.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **Inngest Account**: Sign up at [inngest.com](https://inngest.com)
3. **MongoDB Database**: Use MongoDB Atlas (free tier available)
4. **Email Service**: Configure Mailtrap or similar SMTP service
5. **AI Service**: Get a Gemini API key from Google AI Studio

## Environment Variables Setup

### Backend Environment Variables (Required in Render)

Set these in your Render backend service environment variables:

#### Database
- `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/database`)

#### Authentication
- `JWT_SECRET`: A secure random string for JWT token signing

#### AI Service
- `GEMINI_API_KEY`: Your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### Email Service (Mailtrap)
- `MAILTRAP_SMTP_HOST`: SMTP host (e.g., `smtp.mailtrap.io`)
- `MAILTRAP_SMTP_PORT`: SMTP port (e.g., `2525`)
- `MAILTRAP_SMTP_USER`: SMTP username
- `MAILTRAP_SMTP_PASS`: SMTP password

#### Inngest Configuration
- `INNGEST_EVENT_KEY`: Your Inngest event key (from Inngest dashboard)
- `INNGEST_SIGNING_KEY`: Your Inngest signing key (from Inngest dashboard)
- `INNGEST_APP_URL`: Your deployed backend URL (e.g., `https://ai-ticket-backend.onrender.com`)

#### System
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `10000` (Render will override this)

### Frontend Environment Variables

Set these in your Render frontend service:

- `VITE_API_URL`: Your backend URL (e.g., `https://ai-ticket-backend.onrender.com`)

## Deployment Steps

### 1. Deploy Backend to Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `ai-ticket-assistant` folder as the root directory

2. **Configure Service**:
   - **Name**: `ai-ticket-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Starter (free tier)

3. **Set Environment Variables**:
   - Add all the backend environment variables listed above
   - Make sure to mark sensitive variables as "Secret"

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your service URL (e.g., `https://ai-ticket-backend.onrender.com`)

### 2. Deploy Frontend to Render

1. **Create Static Site**:
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the `ai-ticket-frontend` folder as the root directory

2. **Configure Site**:
   - **Name**: `ai-ticket-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Starter (free tier)

3. **Set Environment Variables**:
   - Add `VITE_API_URL` with your backend URL

4. **Deploy**:
   - Click "Create Static Site"
   - Wait for deployment to complete

### 3. Configure Inngest

1. **Create Inngest App**:
   - Go to [Inngest Dashboard](https://app.inngest.com)
   - Create a new app
   - Note your Event Key and Signing Key

2. **Set Up Functions**:
   - Your functions are already configured in the code
   - Inngest will automatically discover them via the `/api/inngest` endpoint

3. **Configure Webhook**:
   - In Inngest dashboard, set your app URL to: `https://ai-ticket-backend.onrender.com/api/inngest`

## Testing the Deployment

### 1. Test Backend
```bash
# Test health endpoint
curl https://ai-ticket-backend.onrender.com/api/auth/health

# Test Inngest endpoint
curl https://ai-ticket-backend.onrender.com/api/inngest
```

### 2. Test Frontend
- Visit your frontend URL
- Try creating an account and logging in
- Create a test ticket to verify the full flow

### 3. Test Inngest Functions
- Create a user account (should trigger welcome email)
- Create a ticket (should trigger AI analysis and assignment)

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all environment variables are set
   - Verify MongoDB connection string format
   - Ensure all required dependencies are in package.json

2. **Inngest Functions Not Working**:
   - Verify INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY are correct
   - Check that INNGEST_APP_URL points to your deployed backend
   - Ensure the `/api/inngest` endpoint is accessible

3. **Database Connection Issues**:
   - Verify MongoDB URI format
   - Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Render)
   - Ensure database user has proper permissions

4. **Email Not Sending**:
   - Verify Mailtrap credentials
   - Check SMTP settings
   - Test with a simple email first

### Logs and Monitoring

- **Render Logs**: Check your service logs in Render dashboard
- **Inngest Logs**: Monitor function executions in Inngest dashboard
- **MongoDB Logs**: Check MongoDB Atlas logs for connection issues

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to git
2. **CORS**: Update CORS settings for production domains
3. **Rate Limiting**: Consider adding rate limiting for production
4. **HTTPS**: Render provides HTTPS by default
5. **Database**: Use MongoDB Atlas with proper security settings

## Scaling Considerations

- **Render Free Tier**: Limited to 750 hours/month
- **MongoDB Atlas**: Free tier has connection limits
- **Inngest**: Check pricing for high-volume usage
- **Email**: Monitor email service limits

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Inngest Documentation**: [inngest.com/docs](https://inngest.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
