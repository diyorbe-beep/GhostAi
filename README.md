# GhostAI - Gemini AI Chat Application

Bu loyiha Google Gemini AI asosida ishlaydigan zamonaviy chat bot dasturi.

## 🚀 Features

- **AI Chat:** Google Gemini 1.5 Flash modeli bilan suhbatlashish
- **Real-time Chat:** Xabarlarni real vaqtda yuborish va qabul qilish
- **Chat History:** So'nggi chatlarni saqlash va ko'rish
- **Modern UI:** Responsive va chiroyli interfeys
- **Error Handling:** Xatoliklarni to'liq qayta ishlash
- **API Testing:** Gemini API ulanishini tekshirish

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, CSS3
- **Backend:** Node.js, Express.js
- **AI:** Google Generative AI (Gemini)
- **Styling:** Custom CSS with gradients

## 📦 Installation

1. **Dependencies o'rnatish:**
```bash
npm install
```

2. **Environment setup:**
```bash
# .env fayl yarating (ixtiyoriy)
GEMINI_API_KEY=AIzaSyCY-lCq-bGu8VsaaBlzgr2JJk2v561V8yE
PORT=3001
```

## 🚀 Running the Application

### Development (Frontend + Backend)
```bash
npm run dev:full
```

### Only Frontend
```bash
npm run dev
```

### Only Backend
```bash
npm run server
```

### Production
```bash
npm run build
npm start
```

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health
- **Test Gemini:** http://localhost:3001/api/test-gemini

## 📱 API Endpoints

### POST /api/chat
AI bilan suhbatlashish uchun

**Request:**
```json
{
  "message": "Your message here"
}
```

**Response:**
```json
{
  "response": "AI response text"
}
```

### GET /api/health
Server holatini tekshirish

### GET /api/test-gemini
Gemini API ulanishini tekshirish

## 🎨 UI Components

- **Sidebar:** Chat tarixi va navigatsiya
- **Main Chat:** Asosiy chat interfeysi
- **Suggestion Cards:** Tezkor so'rovlar uchun
- **Error Handling:** Xatolik xabarlari
- **Loading States:** API so'rovlari uchun

## 🔧 Configuration

### Gemini API
Loyiha sizning API key bilan sozlangan:
```javascript
const genAI = new GoogleGenerativeAI("AIzaSyCY-lCq-bGu8VsaaBlzgr2JJk2v561V8yE")
```

### Model
```javascript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
```

## 🐛 Troubleshooting

### API Key Error
- API key to'g'ri ekanligini tekshiring
- Quota limitlarini tekshiring

### Connection Issues
- Backend server ishga tushganini tekshiring
- Port 3001 band emasligini tekshiring

### Frontend Issues
- Node modules o'rnatilganini tekshiring
- Vite development server ishga tushganini tekshiring

## 📝 Usage

1. **Yangi chat yarating** - Sidebar da "+" tugmasini bosing
2. **Xabar yuboring** - Pastki input maydoniga yozing
3. **AI javobini kutib turing** - Loading animatsiyasi ko'rsatiladi
4. **Chat tarixini ko'ring** - Sidebar ni kengaytiring

## 🔒 Security Notes

- API key production da environment variable da saqlang
- CORS sozlamalarini production uchun sozlang
- Rate limiting qo'shishni ko'rib chiqing

## 📄 License

MIT License

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating
3. O'zgarishlarni commit qiling
4. Pull request yuboring

## 📞 Support

Muammolar yoki savollar uchun issue oching.

---

**GhostAI** - Zamonaviy AI chat tajribasi 🚀
