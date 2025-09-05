# Deployment Checklist

## Pre-Deployment Setup

### 1. Accounts & Services
- [ ] Render account created
- [ ] Inngest account created
- [ ] MongoDB Atlas database set up
- [ ] Mailtrap account configured
- [ ] Gemini API key obtained

### 2. Environment Variables Prepared
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secure random string
- [ ] `GEMINI_API_KEY` - Google AI API key
- [ ] `MAILTRAP_SMTP_HOST` - SMTP host
- [ ] `MAILTRAP_SMTP_PORT` - SMTP port
- [ ] `MAILTRAP_SMTP_USER` - SMTP username
- [ ] `MAILTRAP_SMTP_PASS` - SMTP password
- [ ] `INNGEST_EVENT_KEY` - From Inngest dashboard
- [ ] `INNGEST_SIGNING_KEY` - From Inngest dashboard
- [ ] `INNGEST_APP_URL` - Will be set after backend deployment

## Backend Deployment

### 3. Render Backend Service
- [ ] Create new Web Service in Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `ai-ticket-assistant`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm start`
- [ ] Set environment variables (mark secrets as secret)
- [ ] Deploy and wait for completion
- [ ] Note the backend URL (e.g., `https://ai-ticket-backend.onrender.com`)

### 4. Update Environment Variables
- [ ] Set `INNGEST_APP_URL` to your backend URL
- [ ] Redeploy backend if needed

## Frontend Deployment

### 5. Render Frontend Service
- [ ] Create new Static Site in Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `ai-ticket-frontend`
- [ ] Configure build command: `npm install && npm run build`
- [ ] Set publish directory to `dist`
- [ ] Set `VITE_API_URL` environment variable to backend URL
- [ ] Deploy and wait for completion

## Inngest Configuration

### 6. Inngest Setup
- [ ] Create new app in Inngest dashboard
- [ ] Copy Event Key and Signing Key
- [ ] Set app URL to: `https://your-backend-url.onrender.com/api/inngest`
- [ ] Verify functions are discovered

## Testing

### 7. Backend Testing
- [ ] Test health endpoint: `GET /api/auth/health`
- [ ] Test Inngest endpoint: `GET /api/inngest`
- [ ] Check logs for any errors

### 8. Frontend Testing
- [ ] Visit frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test ticket creation

### 9. Inngest Function Testing
- [ ] Create a user account (should trigger welcome email)
- [ ] Create a ticket (should trigger AI analysis)
- [ ] Check Inngest dashboard for function executions
- [ ] Verify emails are being sent

## Post-Deployment

### 10. Monitoring
- [ ] Set up monitoring for both services
- [ ] Check Render service logs
- [ ] Monitor Inngest function executions
- [ ] Verify database connections
- [ ] Test email delivery

### 11. Security
- [ ] Verify HTTPS is working
- [ ] Check CORS settings
- [ ] Review environment variable security
- [ ] Test authentication flow

## Troubleshooting Common Issues

### If Backend Won't Start
- [ ] Check all environment variables are set
- [ ] Verify MongoDB connection string
- [ ] Check package.json dependencies
- [ ] Review Render build logs

### If Inngest Functions Don't Work
- [ ] Verify Inngest keys are correct
- [ ] Check app URL in Inngest dashboard
- [ ] Ensure `/api/inngest` endpoint is accessible
- [ ] Review Inngest function logs

### If Frontend Can't Connect to Backend
- [ ] Verify `VITE_API_URL` is set correctly
- [ ] Check CORS settings in backend
- [ ] Test backend endpoints directly
- [ ] Review browser console for errors

## Success Criteria
- [ ] Backend deploys successfully
- [ ] Frontend deploys successfully
- [ ] User registration works
- [ ] User login works
- [ ] Ticket creation works
- [ ] AI analysis triggers on ticket creation
- [ ] Email notifications are sent
- [ ] Inngest functions execute properly

## Next Steps
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring and alerts
- [ ] Set up automated backups
- [ ] Plan for scaling if needed
