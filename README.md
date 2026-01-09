# Fitness Freak - MERN Stack Fitness Tracking Platform

A comprehensive fitness tracking web application built with the MERN stack (MongoDB, Express.js, React, Node.js). Fitness Freak enables users to track and improve their lifestyle across key health metrics including workouts, nutrition, sleep, hydration, steps, weight, and social fitness interactions.

## 🚀 Live Demo

- **Frontend**: [https://fitnessfreaks-bay.vercel.app/](https://fitnessfreaks-bay.vercel.app/)
- **GitHub Repository**: [https://github.com/swarshah09/fitnessfreaks.git](https://github.com/swarshah09/fitnessfreaks.git)

## ✨ Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with encrypted password storage
- **Workout Tracking**: Log exercises, track sets/reps, monitor performance with video integration
- **Nutrition Tracking**: Calorie and meal tracking powered by Edamam Nutrition API
- **Health Metrics**: Track sleep, water intake, steps, and weight
- **BMI Calculator**: Automatic BMI calculation based on user data
- **Progress Analytics**: Visual insights and progress tracking with charts
- **Goal Setting**: Set and track personalized fitness goals
- **Daily Activity Logging**: Track workout attendance and maintain streaks

### Social Features
- **FitGram**: Instagram-like social feed for sharing fitness updates
- **Peer Chat**: Real-time messaging with friends and fitness communities
- **Social Profiles**: Customizable fitness profiles
- **Stories**: Share daily fitness moments
- **Follow System**: Connect with other fitness enthusiasts
- **Notifications**: Stay updated with social interactions

### Admin Features
- **User Management**: Full CRUD operations on users
- **Workout Management**: Manage workout library (20+ workouts)
- **Dashboard**: Admin analytics and insights

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Socket.io** - Real-time WebSocket communication
- **Cloudinary** - Image upload and management
- **Nodemailer** - Email functionality
- **Edamam API** - Nutrition data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Git** - Version control

### Optional Services
- **Cloudinary Account** - For image uploads ([Sign up](https://cloudinary.com/))
- **Edamam Account** - For nutrition API ([Sign up](https://developer.edamam.com/))

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/swarshah09/fitnessfreaks.git
cd fitfreak
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd fitnessprojectBackend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `fitnessprojectBackend` directory:

```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
JWT_REFRESH_SECRET_KEY=your_jwt_refresh_secret_key
JWT_ADMIN_SECRET_KEY=your_admin_jwt_secret_key
DB_NAME=fitnessfreak
COMPANY_EMAIL=your_email@example.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key
FRONTEND_URL=http://localhost:8080
```

**Note**: You can copy `env.example` as a template:
```bash
cp env.example .env
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:8000` (or the port specified in your `.env` file).

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd fitfreak-refine-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `fitfreak-refine-frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Note**: You can copy `env.example` as a template:
```bash
cp env.example .env
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:8080`.

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
fitfreak/
├── fitfreak-refine-frontend/     # React frontend application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── admin/            # Admin-specific components
│   │   │   ├── fitgram/          # Social features components
│   │   │   ├── fitness/          # Fitness tracking components
│   │   │   ├── layout/           # Layout components (Header, Sidebar)
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── integrations/         # API clients and integrations
│   │   ├── pages/                 # Page components
│   │   │   ├── admin/            # Admin pages
│   │   │   └── ...               # User pages
│   │   └── main.tsx              # Entry point
│   ├── public/                   # Static assets
│   └── package.json
│
├── fitnessprojectBackend/         # Node.js/Express backend
│   ├── Routes/                   # API route handlers
│   ├── Models/                   # Mongoose schemas
│   ├── Middlewares/              # Custom middleware
│   ├── utils/                    # Utility functions
│   ├── index.js                  # Entry point
│   └── package.json
│
└── README.md                      # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create a workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

### Health Metrics
- `GET/POST/PUT/DELETE /api/calories` - Calorie tracking
- `GET/POST/PUT/DELETE /api/sleep` - Sleep tracking
- `GET/POST/PUT/DELETE /api/steps` - Step tracking
- `GET/POST/PUT/DELETE /api/water` - Water intake tracking
- `GET/POST/PUT/DELETE /api/weight` - Weight tracking
- `GET /api/bmi` - Calculate BMI

### Social Features
- `GET/POST /api/social/posts` - Social posts
- `GET/POST /api/social/stories` - Stories
- `GET/POST /api/social/follow` - Follow/unfollow users
- `GET/POST /api/social/chat` - Real-time chat

### Admin
- `GET/POST/PUT/DELETE /api/admin/users` - User management
- `GET/POST/PUT/DELETE /api/admin/workouts` - Workout management

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Push your code to GitHub
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Set build settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `fitfreak-refine-frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variable:
     - `VITE_API_BASE_URL`: Your backend API URL

3. **Deploy via CLI**:
   ```bash
   cd fitfreak-refine-frontend
   vercel
   ```

### Backend Deployment (Heroku/Railway/Render)

#### Option 1: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login and create app**:
   ```bash
   heroku login
   cd fitnessprojectBackend
   heroku create your-app-name
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set MONGO_URL=your_mongodb_uri
   heroku config:set JWT_SECRET_KEY=your_secret
   # ... set all other env variables
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

#### Option 2: Railway

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Deploy from GitHub repository
4. Set environment variables in the dashboard
5. Railway will automatically detect Node.js and deploy

#### Option 3: Render

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install && npm start`
5. Add all environment variables
6. Deploy

### MongoDB Setup

For production, use **MongoDB Atlas** (cloud):

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs)
5. Get connection string and add to your `.env` file

### Environment Variables for Production

**Backend**:
- Set `FRONTEND_URL` to your deployed frontend URL
- Use secure, randomly generated JWT secrets
- Use production MongoDB connection string

**Frontend**:
- Set `VITE_API_BASE_URL` to your deployed backend URL

## 🧪 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm start            # Start production server
npm run dev          # Start with nodemon (if configured)
```

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Protected API routes with middleware
- CORS configuration
- Secure cookie handling
- Input validation

## 📱 Features Overview

### User Dashboard
- Real-time health metrics overview
- Quick access to all tracking features
- Progress visualization
- Streak tracking

### Workout Module
- Pre-built workout library
- Custom workout creation
- Exercise video integration
- Sets/reps tracking
- Performance history

### Social Features (FitGram)
- Post workout updates
- Share progress photos
- Follow other users
- Real-time chat
- Stories feature
- Notifications

### Analytics
- Daily and weekly insights
- Progress charts
- BMI tracking
- Goal achievement tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Swar Shah**
- GitHub: [@swarshah09](https://github.com/swarshah09)
- Project Link: [https://github.com/swarshah09/fitnessfreaks.git](https://github.com/swarshah09/fitnessfreaks.git)

## 🙏 Acknowledgments

- Edamam API for nutrition data
- Cloudinary for image management
- shadcn/ui for beautiful UI components
- All the open-source libraries that made this project possible

## 📞 Support

For support, email swarshah09@example.com or open an issue in the GitHub repository.

---

**Built with ❤️ using the MERN Stack**
