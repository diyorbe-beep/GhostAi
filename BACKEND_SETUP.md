# Backend Connection Setup

## Overview
This project is now connected to the deployed backend at `https://gemini-backen.onrender.com`.

## Changes Made

### 1. Backend Configuration
- Created `src/config/backend.js` with the deployed backend URL
- Updated API endpoints to use the deployed backend

### 2. Removed Local Proxy
- Removed the Vite proxy configuration from `vite.config.js`
- All API calls now go directly to the deployed backend

### 3. Updated Components
- Modified `src/components/main/main.jsx` to use the new backend endpoints
- Added a test connection button to verify backend connectivity

## API Endpoints

The following endpoints are now available:
- **Chat API**: `https://gemini-backen.onrender.com/api/chat`
- **Test Gemini API**: `https://gemini-backen.onrender.com/api/test-gemini`

## Testing the Connection

1. Start your development server: `npm run dev`
2. Click the "🔗 Test Backend Connection" button on the main page
3. You should see a success message if the backend is working

## Troubleshooting

If you encounter connection issues:

1. **Check Backend Status**: Verify that `https://gemini-backen.onrender.com` is accessible
2. **CORS Issues**: Ensure your backend has proper CORS configuration
3. **Network Errors**: Check browser console for any network-related errors

### CORS Error Solutions

**Option 1: Fix Backend CORS (Recommended)**
Add this to your backend server:

```javascript
// For Express.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));

// For other frameworks, add these headers:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
// Access-Control-Allow-Headers: Content-Type, Authorization
```

**Option 2: Use CORS Proxy (Temporary)**
The frontend now automatically tries multiple CORS proxies if the direct connection fails.

**Smart Fallback System:**
- Tries direct connection first (fastest)
- Falls back to working CORS proxies automatically
- Better error handling for malformed responses
- Multiple proxy options for reliability

## Development vs Production

- **Development**: Uses deployed backend at `https://gemini-backen.onrender.com`
- **Production**: Same backend URL (no changes needed for deployment)

## Notes

- The backend is hosted on Render.com
- All API calls are now HTTPS
- No local backend server is required
- The test button helps verify connectivity before using the chat features

## Responsive Design

The application is now fully optimized for all screen sizes:
- **Large Desktop (>1200px)**: Full layout with maximum content width
- **Desktop (≤1200px)**: Optimized layout with 800px max-width
- **Medium Desktop (≤1024px)**: Compact layout with 700px max-width
- **Tablet (≤768px)**: Stacked layout with sidebar below main content
- **Large Mobile (≤480px)**: Mobile-optimized with touch-friendly elements
- **Small Mobile (≤300px)**: Ultra-compact for very small screens
- **Landscape mode**: Adaptive layout for small screens in landscape orientation

### Responsive Breakpoints:

#### **Large Desktop (>1200px)**
- Maximum content width: 900px
- Full sidebar width: 300px+
- Optimal spacing and typography

#### **Desktop (≤1200px)**
- Content width: 800px
- Sidebar width: 280px
- Slightly reduced spacing

#### **Medium Desktop (≤1024px)**
- Content width: 700px
- Sidebar width: 260px
- Compact layout for smaller screens

#### **Tablet (≤768px)**
- Stacked layout (sidebar below main)
- Content width: 600px
- Mobile-optimized spacing

#### **Large Mobile (≤480px)**
- Content width: adaptive
- Touch-friendly buttons (44px minimum)
- Compact card layouts

#### **Small Mobile (≤300px)**
- Ultra-compact layout
- Minimal spacing
- Touch-optimized elements
- Efficient screen usage

### Features Across All Screen Sizes:
- Touch-friendly button sizes (44px minimum)
- Adaptive typography and spacing
- Optimized scrolling experience
- Responsive grid layouts
- Flexible sidebar behavior

## Current CORS Proxy Setup

The frontend now uses a **smart fallback approach**:
1. **First**: Try direct connection to your backend
2. **If CORS fails**: Automatically try multiple CORS proxies

**Available CORS Proxies:**
- `https://api.allorigins.win/raw?url=`
- `https://corsproxy.io/?`
- `https://thingproxy.freeboard.io/fetch/`
- `https://cors.bridged.cc/`

**Important**: Remove the CORS proxy configuration once you fix the backend CORS settings.
