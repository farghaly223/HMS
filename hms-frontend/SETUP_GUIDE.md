# 🚀 HMS Frontend Setup Guide

Complete step-by-step guide to get the improved Hospital Management System frontend running.

## Prerequisites

Before you begin, make sure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)
- **Backend Server** running on `http://localhost:8080`

### Verify Installation
```bash
node --version
npm --version
```

## Step-by-Step Installation

### 1️⃣ Extract & Navigate to Project

```bash
# Extract the frontend folder
cd hms-frontend-improved

# Verify you're in the right directory
ls   # On Mac/Linux
dir  # On Windows
```

You should see: `package.json`, `src/`, `index.html`, etc.

### 2️⃣ Install Dependencies

```bash
npm install
```

This will:
- Download all required packages (React, Vite, Tailwind, etc.)
- Create a `node_modules` folder
- Generate `package-lock.json`

⏱️ **Time**: 2-5 minutes depending on internet speed

### 3️⃣ Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.3.1 ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

The application will automatically open in your browser at `http://localhost:5173`

### 4️⃣ Login to the Application

Use these demo credentials:

**For Patient**:
- Username: `patient`
- Password: `password`

**For Doctor**:
- Username: `doctor`
- Password: `password`

**For Admin**:
- Username: `admin`
- Password: `password`

## 🎯 What You'll See

### Patient Dashboard
- ✅ Health overview with upcoming appointments
- ✅ Recent billing history
- ✅ Book new appointments
- ✅ View medical history

### Doctor Dashboard
- ✅ Patient list
- ✅ Appointment management
- ✅ Add medical history for patients
- ✅ Practice statistics

### Admin Dashboard
- ✅ System-wide statistics
- ✅ Doctor approval workflow
- ✅ User management
- ✅ System alerts

## 🔧 Configuration

### Backend API URL (Optional)

If your backend is on a different port/URL, create a `.env` file:

```bash
# In the project root directory, create .env file
REACT_APP_API_URL=http://localhost:8080
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new dependencies
npm install <package-name>

# Update dependencies
npm update
```

## 📱 Access the Application

### Local Development
- **URL**: http://localhost:5173
- **Browser**: Chrome, Firefox, Safari, Edge (all modern browsers)
- **Mobile Testing**: Use browser DevTools (F12 → Toggle device toolbar)

### Features by Role

#### 👤 Patient Can:
- [ ] View dashboard with health overview
- [ ] Create/edit personal profile
- [ ] Book appointments with doctors
- [ ] View appointment status
- [ ] Cancel appointments
- [ ] View medical history (as reference)
- [ ] View billing history
- [ ] Pay invoices

#### 👨‍⚕️ Doctor Can:
- [ ] View dashboard with patient statistics
- [ ] View patient list and profiles
- [ ] **Add medical history for patients** ⭐ NEW
- [ ] View and manage appointments
- [ ] Confirm and complete appointments
- [ ] View billing records

#### 👨‍💼 Admin Can:
- [ ] View system dashboard
- [ ] Approve doctor profiles
- [ ] Manage all doctors and patients
- [ ] Manage all appointments
- [ ] Create and manage invoices
- [ ] Delete users (all roles)

## ⚠️ Troubleshooting

### Issue: "npm command not found"
**Solution**:
```bash
# Reinstall Node.js from https://nodejs.org/
# Then try again
npm --version
```

### Issue: Port 5173 already in use
**Solution**:
```bash
# The dev server will automatically use the next available port
# Or kill the process using port 5173

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Issue: Backend not connecting
**Check**:
1. ✅ Backend is running on http://localhost:8080
2. ✅ Check browser console (F12) for error messages
3. ✅ Verify network tab shows API calls
4. ✅ CORS is enabled in backend

### Issue: "Cannot find module" error
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Medical history not showing
**Check**:
1. ✅ You're logged in as a doctor or admin
2. ✅ Patient profile exists
3. ✅ Backend endpoints are available
4. ✅ Check browser console for errors

## 🧪 Testing the Medical History Feature

### Step 1: Create Patient Profile
1. Log in as **Patient**
2. Go to **My Profile**
3. Fill in personal information
4. Click **Create Profile**

### Step 2: Create Doctor Profile
1. Log out
2. Log in as **Doctor**
3. Go to **Doctors**
4. Click **Create Profile**
5. Fill in details and submit
6. Log out

### Step 3: Approve Doctor (Admin)
1. Log in as **Admin**
2. Go to **Admin Dashboard**
3. See pending approvals
4. Go to **Doctors** page
5. Click **Approve** on the doctor

### Step 4: Add Medical History
1. Log in as **Doctor**
2. Go to **Patients**
3. Click the **👁️ (View)** icon on patient
4. Scroll to **Medical History** section
5. Click **Add Record**
6. Fill in:
   - Visit Date
   - Diagnosis
   - Treatment
   - Medications (optional)
   - Tests (optional)
   - Notes (optional)
7. Click **Add Record**

### Step 5: Verify Medical History
1. Still as **Doctor**, see the new record
2. Click on the record to expand it
3. Edit or delete if needed
4. Log out

## 📊 File Size & Performance

After `npm install`:
- **node_modules**: ~500MB (not included in production)
- **Source code**: ~150KB
- **Production build**: ~250KB (gzipped)

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Deploy to Hosting

**Vercel** (Recommended):
```bash
npm install -g vercel
vercel
```

**Netlify**:
1. Push code to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist/`

**Traditional Hosting**:
1. Run `npm run build`
2. Upload `dist/` folder to your server
3. Configure server to serve `index.html` for all routes

## 📚 Project Structure Quick Reference

```
hms-frontend-improved/
├── src/
│   ├── components/      ← Reusable UI components
│   ├── pages/          ← Full page components
│   ├── services/       ← API calls
│   ├── utils/          ← Helper functions
│   ├── App.jsx         ← Main app
│   └── index.css       ← Global styles
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── tailwind.config.js  ← Styling config
└── index.html          ← HTML template
```

## 💡 Tips & Best Practices

1. **Keep terminal open** during development to see errors
2. **Clear browser cache** if styles don't update (Ctrl+Shift+R)
3. **Check console errors** (F12 → Console tab) for issues
4. **Test with different roles** to see all features
5. **Test on mobile** using DevTools device toggle

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## ✅ Verification Checklist

Before starting development, verify:

- [ ] Node.js installed (`node --version` shows version)
- [ ] npm installed (`npm --version` shows version)
- [ ] Project extracted to a folder
- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts successfully
- [ ] Browser opens at http://localhost:5173
- [ ] Login page displays correctly
- [ ] Can log in with demo credentials
- [ ] Dashboard loads after login
- [ ] Backend API is responding (check Network tab)

## 🎓 Learning Path

1. **Understand the structure** - Read `src/App.jsx`
2. **Explore components** - Look at `src/components/UIComponents.jsx`
3. **Check API calls** - Review `src/services/ApiService.js`
4. **Test features** - Use all roles to explore functionality
5. **Customize** - Modify colors, text, or components

## 🆘 Still Having Issues?

### Check These Logs:
```bash
# Terminal log - shows build errors
# Browser console (F12) - shows runtime errors
# Network tab (F12) - shows API call failures
```

### Common Error Messages:

**"Cannot GET /"**
- Solution: Run `npm run dev` and wait for "ready in X ms"

**"127.0.0.1:8080 refused to connect"**
- Solution: Start backend server on port 8080

**"Unexpected token '<'**
- Solution: Clear browser cache and restart dev server

## 🎉 You're Ready!

Once you see the login page, the frontend is working! 

### Next Steps:
1. Test with demo credentials
2. Explore all features
3. Test the medical history functionality
4. Customize as needed
5. Connect with your backend team

---

**Need Help?** Check the README.md file for more detailed information about features and API integration.

**Happy Coding! 🚀**
