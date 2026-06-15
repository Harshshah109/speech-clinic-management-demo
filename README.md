🏥 Speech Clinic Management System (CMS)

A full-stack, production-ready web application built to streamline the daily operations of speech therapy clinics — from patient management and appointment scheduling to payments and therapist tracking.

🔗 Live Demo: speech-clinic-management-demo.vercel.app
📁 GitHub: Harshshah109/speech-clinic-management-demo


🔐 Demo Credentials

Explore the full app without signing up using the credentials below:

Role Email Password
👨‍💼 Admin demo - admin@demo.com
     Password - admin01
🩺 Therapist demo - therapist@demo.com
     Password - therapist


⚠️ Please do not modify or delete existing demo data so others can explore the app too.




📸 Screenshots

📊 Dashboard

<img width="1912" height="907" alt="Dashboard" src="https://github.com/user-attachments/assets/7d45090c-32d0-40f7-8c93-9a8c659b1e90" />

Real-time overview of appointments, active patients, yearly revenue, and therapist availability.


📅 Appointments

<img width="1912" height="892" alt="Appoinments" src="https://github.com/user-attachments/assets/5176b40c-48b7-4eaa-9517-f3a5f2764c6b" />

View, schedule, and manage daily appointments with status tracking (Confirmed / Confirm Pending).


👥 Patient Details

<img width="1902" height="890" alt="Patient Details" src="https://github.com/user-attachments/assets/6039166c-9f7e-497b-87af-0c1cf24c0b48" />

Manage active patients with treatment type, age, payment status, session history, and appointment history.


💳 Payments

<img width="1917" height="922" alt="Payments Tab" src="https://github.com/user-attachments/assets/81cbb213-cc34-4d35-9c37-b1601e464de2" />

Advanced billing module — track total revenue, wallet balances, pending dues, and export to Excel/PDF.


🩺 Therapist Management

<img width="1917" height="902" alt="Therapist Details" src="https://github.com/user-attachments/assets/f790126d-0cee-4480-b1cf-fdf18516c5d2" />

View and manage clinic therapists, their experience, availability, and appointment analytics.


✨ Features

🔐 Authentication & Security


Firebase Authentication with secure login/logout
Role-Based Access Control (RBAC) — separate access for Admin and Therapist roles
Protected routes based on user role


📊 Dashboard


Real-time stats: Today's appointments, Active patients, Yearly revenue, Active therapists
Daily / Weekly / Monthly / Yearly revenue filters
Today's and Tomorrow's schedule overview


📅 Appointments Module


Schedule, view, and manage appointments
Status tracking: Confirmed / Confirm Pending
Search and filter by date and status
Calendar view for visual scheduling


👥 Patient Management


Add, edit, and delete patient records
Filter by status: Active / Assessment / Finished
Track payment history, wallet balance, and pending dues
View session history and appointment history
Download payment history as a report


💳 Payments & Billing


Add and track session payments
Support for Cash and Digital payment modes
Track wallet balance and pending dues per patient
Weekly / Monthly / Yearly billing views
Export reports to Excel and PDF


🩺 Therapist Management


Add and manage clinic therapists
View therapist profiles, experience, and availability
View per-therapist appointment analytics


📱 Responsive Design


Fully responsive across Desktop, Tablet, and Mobile devices



🛠️ Tech Stack


| Technology | Purpose |
|---|---|
| **React.js** | Frontend UI framework |
| **Vite** | Fast build tool and dev server |
| **Firebase Authentication** | Secure user login & role management |
| **Cloud Firestore** | Real-time NoSQL database |
| **Tailwind CSS** | Utility-first responsive styling |
| **Vercel** | Cloud deployment & hosting |

🗂️ Project Structure

speech-clinic-management-demo/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # App pages (Dashboard, Appointments, Patients, etc.)
│   ├── context/         # Auth & global state context
│   ├── hooks/           # Custom React hooks
│   ├── firebase/        # Firebase config & utilities
│   └── utils/           # Helper functions
├── .env.example         # Environment variable template
├── .firebaserc          # Firebase project config
└── vite.config.js       # Vite configuration


🚀 Getting Started (Local Setup)

Prerequisites


Node.js v18+
npm or yarn
Firebase account


1. Clone the Repository

bashgit clone https://github.com/Harshshah109/speech-clinic-management-demo.git
cd speech-clinic-management-demo

2. Install Dependencies

bashnpm install

3. Set Up Environment Variables

bashcp .env.example .env

Fill in your Firebase project credentials in the .env file:

envVITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

4. Run the Development Server

bashnpm run dev

The app will be available at http://localhost:5173


☁️ Deployment

This project is deployed on Vercel. To deploy your own instance:


Push the project to your GitHub repository
Connect the repo to Vercel
Add your Firebase environment variables in Vercel's project settings
Deploy 🚀



💡 Key Learnings


Implementing Role-Based Access Control (RBAC) in a real-world React app
Managing real-time data with Cloud Firestore
Building scalable frontend architecture with React + Vite
Designing clean, responsive UIs with Tailwind CSS
Deploying production-ready applications on Vercel
Handling billing and financial data with export functionality



🔮 Upcoming Features


 SMS / Email appointment reminders
 Session notes and progress reports for patients
 Advanced analytics and revenue charts
 Multi-clinic support
 Dark mode



👨‍💻 Author

Harsh Shah


GitHub: @Harshshah109
LinkedIn: https://www.linkedin.com/in/harsh-shah-5423232ba/
