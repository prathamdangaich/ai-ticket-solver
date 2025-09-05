# Quick Start Deployment Guide

## 🚀 Deploy Your AI Ticket Assistant in 15 Minutes

### Step 1: Prepare Your Services (5 minutes)

1. **Get your API keys and credentials:**
   - MongoDB Atlas connection string
   - Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Mailtrap SMTP credentials
   - Create accounts on [Render](https://render.com) and [Inngest](https://inngest.com)

### Step 2: Deploy Backend (5 minutes)

1. **Go to Render Dashboard** → "New +" → "Web Service"
2. **Connect your GitHub repo** and select `ai-ticket-assistant` folder
3. **Configure:**
   - Name: `ai-ticket-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add Environment Variables:**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_random_string
   GEMINI_API_KEY=your_gemini_api_key
   MAILTRAP_SMTP_HOST=smtp.mailtrap.io
   MAILTRAP_SMTP_PORT=2525
   MAILTRAP_SMTP_USER=your_mailtrap_user
   MAILTRAP_SMTP_PASS=your_mailtrap_pass
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   NODE_ENV=production
   ```
5. **Deploy** and note your backend URL

### Step 3: Configure Inngest (2 minutes)

1. **In Inngest Dashboard:**
   - Create new app
   - Set App URL to: `https://your-backend-url.onrender.com/api/inngest`
   - Copy Event Key and Signing Key to your Render environment variables

### Step 4: Deploy Frontend (3 minutes)

1. **Go to Render Dashboard** → "New +" → "Static Site"
2. **Connect your GitHub repo** and select `ai-ticket-frontend` folder
3. **Configure:**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
5. **Deploy**

### Step 5: Test Everything

1. **Visit your frontend URL**
2. **Create an account** (should trigger welcome email)
3. **Create a ticket** (should trigger AI analysis and assignment)
4. **Check Inngest dashboard** for function executions

## ✅ You're Done!

Your AI Ticket Assistant is now live with:
- ✅ Backend API on Render
- ✅ Frontend on Render
- ✅ Inngest functions working
- ✅ AI-powered ticket analysis
- ✅ Email notifications
- ✅ MongoDB database
- ✅ User authentication

## 🔧 Troubleshooting

**Backend won't start?**
- Check all environment variables are set
- Verify MongoDB connection string format

**Inngest functions not working?**
- Verify Inngest keys are correct
- Check app URL in Inngest dashboard

**Frontend can't connect?**
- Verify `VITE_API_URL` points to your backend
- Check CORS settings

## 📚 Full Documentation

For detailed instructions, see:
- `DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

## 🆘 Need Help?

- Render Docs: [render.com/docs](https://render.com/docs)
- Inngest Docs: [inngest.com/docs](https://inngest.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
