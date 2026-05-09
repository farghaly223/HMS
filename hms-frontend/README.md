# Hospital Management System (HMS) - Frontend

A modern, responsive, and fully functional React-based frontend for a comprehensive Hospital Management System. Features role-based dashboards, appointment scheduling, medical records management, and billing integration.

## 🎯 Features

### ✨ **Role-Based Access Control**
- **Admin Dashboard**: System overview, doctor approvals, user management
- **Doctor Dashboard**: Patient management, medical history records, appointment management
- **Patient Dashboard**: Health overview, appointment booking, billing history
- **Employee Dashboard**: Billing management

### 🏥 **Core Features**

#### 1. **Authentication & Authorization**
- Secure login/registration system
- JWT token-based authentication
- Role-based route protection
- Session management

#### 2. **Doctor Management**
- Doctor profile creation and management
- Specialization and experience tracking
- Admin approval workflow
- Consultation fee management
- Doctor search and filtering

#### 3. **Patient Management**
- Patient profile creation with detailed health information
- Gender, blood group, emergency contact tracking
- Patient search and filtering
- Admin and doctor access to patient details
- Medical history per patient

#### 4. **Medical History (NEW)**
- Doctors can add detailed medical records for patients
- Record visit dates, diagnosis, treatment, medications, tests
- View and expand medical records
- Edit and delete medical records
- Organized timeline view of patient history

#### 5. **Appointments**
- Book appointments with approved doctors
- Real-time appointment status tracking
- Doctor confirmation and completion workflows
- Patient appointment cancellation
- Search and filter appointments by date and status

#### 6. **Billing & Invoices**
- Create invoices for completed appointments
- Track payment status (Paid, Unpaid, Partially Paid)
- Multiple payment methods (Cash, Card, Insurance)
- Tax calculation
- Invoice payment processing
- Payment history tracking

### 🎨 **UI/UX Enhancements**
- Modern gradient design with Tailwind CSS
- Responsive mobile-first design
- Dark mode support ready
- Loading states and error handling
- Toast notifications for user feedback
- Reusable component library
- Smooth animations and transitions
- Accessibility features

## 📋 Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.3.1
- **Routing**: React Router v6
- **HTTP Client**: Axios 1.6.0
- **UI Framework**: Tailwind CSS 3.4.4
- **Icons**: Lucide React 0.395.0
- **Notifications**: React Hot Toast 2.6.0
- **Package Manager**: npm/yarn

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running at `http://localhost:8080`

### Step 1: Install Dependencies
```bash
cd hms-frontend-improved
npm install
# or
yarn install
```

### Step 2: Configure Environment (Optional)
Create a `.env` file in the root directory:
```bash
REACT_APP_API_URL=http://localhost:8080
```

### Step 3: Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will open at `http://localhost:5173`

### Step 4: Build for Production
```bash
npm run build
# or
yarn build
```

## 🔑 Demo Credentials

Use these credentials to test the application:

### Patient Account
- **Username**: patient
- **Password**: password
- **Role**: Patient

### Doctor Account
- **Username**: doctor
- **Password**: password
- **Role**: Doctor

### Admin Account
- **Username**: admin
- **Password**: password
- **Role**: Admin

## 📁 Project Structure

```
hms-frontend-improved/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── SideBar.jsx
│   │   ├── UIComponents.jsx  # Form, Button, Card, Modal, etc.
│   │   └── MedicalHistory.jsx
│   │
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── PatientDashboard.jsx
│   │   ├── DoctorList.jsx
│   │   ├── PatientList.jsx
│   │   ├── PatientDetail.jsx
│   │   ├── Appointments.jsx
│   │   └── Billing.jsx
│   │
│   ├── services/            # API integration
│   │   └── ApiService.js
│   │
│   ├── utils/              # Utilities & helpers
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
│
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

## 🎯 Key Features Explained

### 1. **Medical History Management** ⭐ NEW
Doctors can now manage patient medical history:
- Click on a patient in the patient list to view their details
- See their full medical history in an organized timeline
- Add new medical records with:
  - Visit date
  - Diagnosis
  - Treatment details
  - Medications prescribed
  - Tests conducted
  - Additional clinical notes
- Edit existing records
- Delete records when needed
- Medical records are expandable for detailed view

### 2. **Role-Based Dashboards**
Each role has a specialized dashboard:

**Admin Dashboard**:
- System-wide statistics
- Doctor approval queue
- User management quick actions
- System alerts and notifications

**Doctor Dashboard**:
- Patient statistics
- Appointment overview
- Recent appointments list
- Quick access to add medical history
- Practice statistics

**Patient Dashboard**:
- Health overview
- Upcoming appointments
- Recent billing history
- Health tips and reminders
- Payment alerts

### 3. **Dynamic Forms**
All forms include:
- Field validation
- Error messages
- Loading states
- Success notifications
- Auto-reset after submission

### 4. **Search & Filter**
Across all list pages:
- Real-time search functionality
- Multi-field filtering
- Status-based filtering
- Results counter

## 🔌 API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/validate` - Token validation

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors/{id}` - Get doctor details
- `POST /doctors` - Create doctor profile
- `PUT /doctors/{id}` - Update doctor profile
- `PUT /doctors/{id}/approve` - Approve doctor
- `DELETE /doctors/{id}` - Delete doctor

### Patients
- `GET /patients` - List all patients
- `GET /patients/{id}` - Get patient details
- `GET /patients/my-profile` - Get current user's profile
- `POST /patients` - Create patient profile
- `PUT /patients/{id}` - Update patient profile
- `DELETE /patients/{id}` - Delete patient
- `GET /patients/{id}/medical-history` - Get medical history
- `POST /patients/{id}/medical-history` - Add medical history
- `PUT /patients/{id}/medical-history/{historyId}` - Update medical history
- `DELETE /patients/{id}/medical-history/{historyId}` - Delete medical history

### Appointments
- `GET /appointments` - List all appointments
- `GET /appointments/patient/{patientId}` - Get patient's appointments
- `GET /appointments/doctor` - Get doctor's appointments
- `POST /appointments` - Book appointment
- `PUT /appointments/{id}/status` - Update appointment status
- `PUT /appointments/{id}/cancel` - Cancel appointment

### Billing
- `GET /billing` - List all invoices
- `GET /billing/my-invoices` - Get user's invoices
- `GET /billing/appointment/{appointmentId}` - Get invoice for appointment
- `POST /billing` - Create invoice
- `PUT /billing/{id}/status` - Update invoice status
- `PUT /billing/{id}/pay` - Mark invoice as paid
- `PUT /billing/{id}/mark-paid` - Mark invoice as paid (admin)

## 🛠️ Customization

### Changing Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ }
    }
  }
}
```

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Update navigation in `src/utils/constants.js`

### Modifying API Endpoints
Edit `src/services/ApiService.js` to change API configuration:
```javascript
const API_BASE_URL = 'your-api-url';
```

## 🐛 Troubleshooting

### Frontend not connecting to backend
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify API endpoints match backend routes

### Session expired error
- Clear browser localStorage
- Log in again
- Check token expiration settings

### Medical history not showing
- Ensure user is logged in as doctor or admin
- Verify patient ID is correct
- Check backend medical history endpoints

## 📱 Responsive Design

The application is fully responsive across:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)
- Large screens (1280px and up)

## 🔒 Security Features

- JWT token-based authentication
- Role-based access control
- Protected routes
- Secure password storage in backend
- CORS protection
- Input validation
- Error handling without exposing sensitive info

## 📈 Performance Optimizations

- Lazy loading of components
- Code splitting with Vite
- Optimized bundle size
- Efficient state management
- Minimal re-renders
- Cached API responses where appropriate

## 🚀 Future Enhancements

- [ ] Dark mode toggle
- [ ] Real-time notifications
- [ ] Video consultation integration
- [ ] Prescription management
- [ ] Lab reports upload
- [ ] Insurance claim processing
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] AI-powered appointment suggestions
- [ ] Multi-language support

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API error messages
3. Check browser console for errors
4. Verify backend is running and accessible

## 📄 License

This project is part of the Hospital Management System educational project.

## ✅ Improvements Made

✅ Fixed all existing errors
✅ Modern UI/UX with Tailwind CSS
✅ Role-based dashboards for each user type
✅ Medical history management system
✅ Dynamic forms with validation
✅ Search and filtering across all modules
✅ Responsive design for all devices
✅ Toast notifications for user feedback
✅ Loading states and error handling
✅ Reusable component library
✅ Clean code organization
✅ Comprehensive documentation
✅ Professional styling and animations
✅ Proper error messages and validations

---

**Version**: 2.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready ✅
