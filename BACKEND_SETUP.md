# 🔧 Backend Integration Setup Guide

## Current Status

Your frontend is trying to connect to:
```
https://web-production-af44.up.railway.app
```

## ❌ Issue: CORS Error (Most Likely)

The articles aren't loading because your Railway backend needs to **allow requests from the Lovable frontend domain**.

## ✅ How to Fix

### Step 1: Add CORS to Your Railway Backend

Add this to your Express.js backend (typically in `server.js` or `index.js`):

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Add CORS BEFORE other middleware
app.use(cors({
  origin: [
    'https://gptengineer.app',
    'https://*.lovable.app',
    'https://*.gptengineer.app',
    'http://localhost:5173', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Your other middleware
app.use(express.json());

// Your routes...
```

### Step 2: Install CORS package (if not already installed)

```bash
npm install cors
```

### Step 3: Redeploy Your Railway Backend

After adding the CORS configuration, redeploy your backend on Railway.

## 🔍 How to Check if It Worked

1. **Open Browser Console** (Press F12)
2. **Refresh the page**
3. **Look for these logs:**

   ✅ **Success indicators:**
   - `🔗 API Base URL: https://web-production-af44.up.railway.app`
   - `✅ API Response: /api/articles`
   - `✅ Articles loaded: {...}`

   ❌ **Error indicators:**
   - `❌ API Error:` - Shows the exact problem
   - `🚫 CORS or Network Error` - Confirms CORS issue

4. **Check the Admin Panel** - The API Status card shows connection status

## 📋 All Admin Panel Features Available

Your admin panel includes:
- ✅ **Drag & Drop Image Upload** - Upload cover images
- ✅ **Article Form** - Title, slug, summary, body
- ✅ **Author Selection** - Choose from backend authors
- ✅ **Category Selection** - Multi-select categories
- ✅ **SEO Settings** - Meta title and description
- ✅ **Publishing Options** - Draft/Published status
- ✅ **Pin as Featured** - Feature articles on homepage
- ✅ **API Status Checker** - Shows connection status

## 🧪 Testing the Connection

Visit `/admin` and look at the **API Connection Status** card at the top. It will show:
- 🟢 **Connected** - Everything working
- 🔴 **Connection Failed** - Shows specific error and fix instructions

## 🆘 Still Having Issues?

1. **Check Railway logs** - See if requests are reaching your backend
2. **Verify the URL** - Make sure `https://web-production-af44.up.railway.app` is correct
3. **Test the API directly** - Try visiting the URL in your browser
4. **Check console logs** - Browser console (F12) shows detailed error info

## 📚 Additional Resources

- [Express CORS Documentation](https://expressjs.com/en/resources/middleware/cors.html)
- [Railway Deployment Guide](https://docs.railway.app/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
