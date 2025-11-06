# API Integration Troubleshooting

## Backend CORS Configuration Required

Your Railway backend needs to allow requests from the Lovable frontend. Add CORS headers to your backend:

### For Express.js:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-lovable-app.lovable.app',
    'http://localhost:5173', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Current API Base URL:
`https://web-production-af44.up.railway.app`

## Testing the API

1. Open browser console (F12)
2. Look for logs starting with:
   - 🔗 API Base URL
   - 📰 Fetching articles
   - ✅ Success indicators
   - ❌ Error indicators

## Common Issues:

1. **CORS Error**: Backend not configured to accept frontend requests
2. **Network Error**: Backend is down or URL is incorrect
3. **404 Error**: API endpoint path is wrong
4. **401/403**: Authentication required but not provided

## Environment Variables

Add to your project (if not already set):
```
VITE_API_URL=https://web-production-af44.up.railway.app
```
