# DiasporaNRI - Diaspora Services Platform

A comprehensive full-stack web application designed to provide NRI (Non-Resident Indian) services including financial advice, investment guidance, and diaspora community management.

![DiasporaNRI Logo](./public/diaspora-nri-logo.png)

## 🌍 Project Overview

DiasporaNRI is a modern, scalable platform that enables diaspora communities to:
- Access professional services and investment opportunities
- Manage their profiles and achievements
- Submit contact inquiries with file attachments
- Manage media galleries and content
- Provide admin capabilities for content management and user administration

## ✨ Key Features

### 👤 User Management
- Email/Password and Google OAuth authentication
- Profile management with profile pictures (stored in Cloudflare R2)
- User data persistence via Firestore
- Secure authentication via Firebase

### 📝 Content Management
- **Admin Panel**: Full CRUD operations for website content
- **82+ Content Blocks**: Editable sections across 8 pages (Home, About, Services, Associates, Investment, Achievements, Media, Contact)
- **Backup & Restore**: Version history with point-in-time recovery
- **Real-time Updates**: Changes immediately visible without redeploy

### 📧 Contact Management
- Contact form with attachment support (up to 5MB)
- Files stored securely in Cloudflare R2
- Admin interface to view, filter, and manage submissions
- Read/Unread status tracking

### 🎖️ Achievements System
- Image uploads for achievement badges
- Admin management interface
- Achievements displayed on public pages

### 🎬 Media Gallery
- Multi-file upload support
- Media management dashboard
- Integration with Cloudflare R2 storage

### 🎨 Professional UI
- Responsive design with Tailwind CSS
- SVG icons throughout (no emojis)
- Smooth animations with GSAP and Lenis
- Dark theme optimized for readability

## 🛠️ Tech Stack

### Frontend
- **React 19.2.6** - UI framework
- **Vite 8.0.12** - Build tool with HMR
- **React Router 7.15.0** - Client-side routing
- **Tailwind CSS 3.4.19** - Utility-first styling
- **Firebase SDK 12.13.0** - Authentication & Firestore
- **GSAP 3.15.0 + Lenis 1.3.23** - Smooth scrolling animations

### Backend
- **Express 4.19.2** - Node.js server framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 8.5.2** - ODM with schema validation
- **Firebase Admin SDK 12.2.0** - Server-side token verification
- **AWS S3 Client 3.645.0** - Cloudflare R2 compatibility
- **Multer 1.4.5** - File upload handling

### Storage
- **Cloudflare R2** - Media storage (profile pictures, achievements, contact attachments)
- **MongoDB Atlas** - Data persistence
- **Firestore** - User metadata & authentication

### Deployment
- **Frontend**: Vercel (recommended) or similar
- **Backend**: Railway, Render, or similar (Node.js compatible)
- **Database**: MongoDB Atlas (cloud)

## 📁 Project Structure

```
DiasporaNRI/
├── src/                          # Frontend React application
│   ├── components/               # Reusable components
│   │   ├── Header.jsx           # Navigation with profile picture
│   │   ├── Icon.jsx             # SVG icons component (18 icons)
│   │   ├── Dashboard.jsx        # Admin dashboard
│   │   ├── AdminContentManager.jsx # Content editing
│   │   ├── AdminContactSubmissions.jsx # Contact submissions
│   │   ├── AdminMediaManager.jsx # Media management
│   │   ├── AdminAchievementsManager.jsx # Achievements management
│   │   └── ...
│   ├── pages/                    # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Contact.jsx
│   │   ├── Profile.jsx           # User profile with picture upload
│   │   ├── AdminLogin.jsx
│   │   └── ...
│   ├── services/                 # API services
│   │   ├── apiClient.js
│   │   ├── firebaseService.js
│   │   ├── contentService.js
│   │   ├── contactService.js
│   │   ├── mediaService.js
│   │   ├── achievementsService.js
│   │   └── backupService.js
│   ├── context/                  # React Context
│   │   └── AuthContext.jsx       # Authentication state
│   ├── config/
│   │   └── firebase.js           # Firebase configuration
│   ├── App.jsx
│   └── main.jsx
├── server/                       # Express backend
│   ├── routes/                   # API routes
│   │   ├── admin.js
│   │   ├── content.js            # Content CRUD + backup/restore
│   │   ├── contact.js            # Contact form submissions
│   │   ├── media.js
│   │   ├── achievements.js
│   │   └── profile.js            # Profile picture uploads
│   ├── models/                   # Mongoose schemas
│   │   ├── ContentBlock.js
│   │   ├── ContentBlockBackup.js
│   │   ├── ContactSubmission.js
│   │   ├── Media.js
│   │   ├── Achievement.js
│   │   ├── Admin.js
│   │   └── User.js (implicit via Firestore)
│   ├── middleware/
│   │   ├── verifyFirebaseToken.js # Token validation
│   │   └── requireAdmin.js        # Admin authorization
│   ├── scripts/
│   │   ├── seedContent.js        # Seed 82 content blocks
│   │   ├── addAdmin.js           # CLI to add admin users
│   │   └── migrateFirestore.js   # Data migration
│   ├── db.js                     # MongoDB connection
│   ├── r2Client.js               # Cloudflare R2 uploader
│   ├── firebaseAdmin.js          # Firebase Admin setup
│   ├── index.js                  # Express app entry
│   ├── .env                      # Environment variables (ignored)
│   ├── serviceAccount.json       # Firebase credentials (ignored)
│   └── package.json
├── public/                       # Static assets
│   ├── diaspora-nri-logo.png
│   ├── dispora-nri-favicon.png
│   └── icons.svg
├── .gitignore                    # Git ignore rules
├── package.json                  # Frontend dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind styling
├── postcss.config.js            # PostCSS configuration
├── eslint.config.js             # ESLint rules
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Firebase project (free tier available)
- Cloudflare R2 account (free tier available)
- GitHub account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/diaspora-nri.git
   cd diaspora-nri
   ```

2. **Frontend Setup**
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Variables**

   Create `server/.env`:
   ```env
   PORT=4000
   CORS_ORIGIN=http://localhost:5173
   
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diasporanri?retryWrites=true&w=majority
   
   # Firebase (get from Firebase Console)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json
   
   # Cloudflare R2
   R2_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key
   R2_BUCKET=diaspora-media
   R2_PUBLIC_URL=https://your-r2-url.com
   ```

   Create `src/config/.env.local` (if needed for Firebase config):
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. **Seed Initial Content**
   ```bash
   cd server
   npm run seed:content
   ```

6. **Create Admin User**
   ```bash
   cd server
   npm run add-admin
   # Follow the prompts to add an admin user
   ```

### Development

**Start Frontend (port 5173)**
```bash
npm run dev
```

**Start Backend (port 4000)** (in new terminal)
```bash
cd server
npm start
```

Or use the dev mode with auto-reload:
```bash
cd server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

**Frontend**
```bash
npm run build
# Outputs to dist/
```

**Backend** - No build needed, runs directly with Node.js

## 📊 Database Models

### ContentBlock
```javascript
{
  page: String, // 'home', 'about', 'services', etc.
  section: String, // 'hero', 'features', 'testimonials', etc.
  key: String, // Unique identifier
  title: String,
  description: String,
  body: String,
  imageUrl: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ContentBlockBackup
```javascript
{
  backupName: String,
  description: String,
  blocks: Array, // Snapshot of all ContentBlocks
  createdAt: Date,
  updatedAt: Date
}
```

### ContactSubmission
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  media: {
    fileName: String,
    fileSize: Number,
    fileType: String,
    fileUrl: String
  },
  read: Boolean,
  createdAt: Date
}
```

## 🔐 Security

- **Firebase Authentication**: All user auth verified server-side
- **Admin Verification**: Middleware checks MongoDB Admin collection
- **Token Validation**: Every protected route verifies Firebase ID token
- **File Validation**: Multer enforces file size and type limits
- **Environment Variables**: Secrets stored in `.env` (git-ignored)
- **CORS**: Configured to allow localhost:5173 and production domain
- **R2 Integration**: Cloudflare R2 handles secure file storage

## 📱 Features by Role

### Public Users
- Browse services and content
- Submit contact forms with attachments
- View achievements and media gallery
- Create account and manage profile

### Authenticated Users
- Upload and manage profile picture
- View submission history
- Edit account details

### Admins (additional permissions)
- Edit all website content (82+ blocks)
- View and manage contact submissions
- Upload and manage media/achievements
- Create backups and restore content
- View analytics dashboard

## 🌐 Deployment

### Frontend Deployment (Vercel - Recommended)
```bash
npm install -g vercel
vercel
```

### Backend Deployment (Railway/Render)

**Railway:**
1. Push to GitHub
2. Connect GitHub repo to Railway
3. Add environment variables
4. Railway auto-deploys on push

**Render:**
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables
6. Deploy

## 🧪 Testing

Admin credentials for testing:
- Email: `admin@test.com` (set via `npm run add-admin`)
- Then use Firebase authentication

## 📝 API Endpoints

### Content Management
- `GET /content/page/:page` - Get content for page
- `POST /content/admin` - Create/update block (admin only)
- `DELETE /content/admin/:blockId` - Delete block (admin only)
- `POST /content/admin/backup` - Create backup
- `GET /content/admin/backups` - List backups
- `POST /content/admin/restore/:backupId` - Restore backup
- `DELETE /content/admin/backups/:backupId` - Delete backup

### Contact Management
- `POST /contact` - Submit contact form
- `GET /contact/admin` - List submissions (admin only)
- `PATCH /contact/:id/read` - Mark as read (admin only)
- `DELETE /contact/:id` - Delete submission (admin only)

### Profile Management
- `POST /profile/picture` - Upload profile picture
- `DELETE /profile/picture/:fileName` - Delete profile picture

### Media
- `POST /media/admin` - Upload media
- `GET /media` - Get all media
- `DELETE /media/:id` - Delete media (admin only)

### Achievements
- `POST /achievements/admin` - Upload achievement
- `GET /achievements` - Get all achievements
- `DELETE /achievements/:id` - Delete achievement (admin only)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows: Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### Firebase Token Errors
- Verify `serviceAccount.json` is valid
- Check Firebase project credentials
- Ensure token isn't expired

### R2 Upload Failures
- Verify R2 credentials in `.env`
- Check bucket name and region
- Ensure file size < 5MB

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in console
3. Check Firebase/MongoDB/R2 dashboards
4. Open GitHub issue with details

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Team

DiasporaNRI Development Team

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
