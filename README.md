# 📝 Full-Stack TODO Application

A production-grade task management web application built with the **MERN stack**, featuring enterprise-level security, caching, containerization, and cloud deployment.

🌐 **Live Demo:** [https://todo-frontend-rv95.onrender.com](https://todo-frontend-rv95.onrender.com)  
🔗 **Backend API:** [https://todo-backend-itkm.onrender.com](https://todo-backend-itkm.onrender.com)

---

## 🚀 Features

- ✅ Create, read, update, and delete tasks
- 🔐 JWT-based authentication (register & login)
- 🔑 Google OAuth2 login (Sign in with Google)
- 🛡️ Multi-Factor Authentication (TOTP via Google Authenticator)
- 🔒 AES-256 encryption for task data at rest
- ⚡ Redis caching for fast task retrieval
- 💳 Razorpay payment gateway (premium upgrade flow)
- 🐳 Dockerized frontend and backend
- ☸️ Kubernetes deployment with Horizontal Pod Autoscaling
- 📊 User-specific task isolation (each user sees only their own tasks)
- 🌐 Google profile photo integration
- 📱 Responsive UI with dynamic greeting and task statistics

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| Axios | HTTP client for API calls |
| CSS3 | Custom styling with Inter font |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Mongoose | MongoDB ODM |
| jsonwebtoken | JWT token generation and verification |
| bcryptjs | Password hashing |
| Passport.js | OAuth2 authentication middleware |
| passport-google-oauth20 | Google OAuth2 strategy |
| speakeasy | TOTP-based MFA generation and verification |
| qrcode | QR code generation for MFA setup |
| Razorpay | Payment gateway SDK |
| redis | Redis client for caching |
| crypto (built-in) | AES-256 encryption |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

### Database & Storage
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud NoSQL database |
| Redis Cloud | In-memory caching layer |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Kubernetes (minikube) | Container orchestration |
| Horizontal Pod Autoscaler | Auto-scaling based on CPU usage |
| Render | Cloud hosting (backend + frontend) |
| GitHub | Version control and CI/CD trigger |
| Nginx | Frontend static file serving in Docker |

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT verification middleware
│   │   └── cache.js         # Redis caching middleware
│   ├── models/
│   │   ├── Task.js          # Mongoose Task schema
│   │   └── User.js          # Mongoose User schema
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me routes
│   │   ├── mfa.js           # MFA setup, verify, login-verify routes
│   │   ├── oauth.js         # Google OAuth2 routes
│   │   ├── payment.js       # Razorpay order and verify routes
│   │   └── tasks.js         # CRUD task routes
│   ├── utils/
│   │   └── encrypt.js       # AES-256 encrypt/decrypt utilities
│   ├── Dockerfile           # Backend Docker image
│   ├── server.js            # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api.js           # Axios instance with interceptor
│   │   ├── App.jsx          # Root component with auth routing
│   │   ├── App.css          # Global styles
│   │   ├── login.jsx        # Login page with MFA support
│   │   ├── Register.jsx     # Registration page
│   │   ├── Todo.jsx         # Main TODO dashboard
│   │   ├── MFA.jsx          # MFA setup and verification
│   │   └── Payment.jsx      # Razorpay payment component
│   ├── Dockerfile           # Frontend Docker image (Nginx)
│   ├── index.html
│   └── package.json
│
├── k8s/
│   ├── backend-deployment.yaml   # K8s backend deployment + service
│   ├── frontend-deployment.yaml  # K8s frontend deployment + service
│   └── hpa.yaml                  # Horizontal Pod Autoscaler config
│
└── docker-compose.yml       # Multi-container Docker setup
```

---

## 🔐 Authentication Flow

### JWT Authentication
```
User registers/logs in
        ↓
Password hashed with bcrypt (10 salt rounds)
        ↓
JWT token issued (expires in 7 days)
        ↓
Token stored in localStorage
        ↓
Every API request sends token in Authorization header
        ↓
Backend middleware verifies token before serving data
```

### Google OAuth2 Flow
```
User clicks "Continue with Google"
        ↓
Redirected to Google consent screen
        ↓
Google returns profile (name, email, photo)
        ↓
Backend creates/finds user in MongoDB
        ↓
JWT token issued and sent back via redirect URL
        ↓
Frontend stores token and loads dashboard
```

### MFA Flow (TOTP)
```
User clicks "Setup MFA"
        ↓
Backend generates TOTP secret + QR code
        ↓
User scans QR with Google Authenticator
        ↓
User enters 6-digit code to verify
        ↓
MFA enabled on account
        ↓
Next login: email/password → temp token → MFA code → full access token
```

---

## 🔒 Security Features

### AES-256 Encryption
Task titles are encrypted before being stored in MongoDB using AES-256-CBC:
```
User types "Buy groceries"
        ↓
encrypt("Buy groceries") → "a3f1c9...encrypted hex...b2e4"
        ↓
Stored in MongoDB as encrypted string
        ↓
On retrieval: decrypt() → "Buy groceries"
```
Even if the database is breached, task data is unreadable without the encryption key.

### Password Security
- Passwords are hashed using **bcrypt** with 10 salt rounds
- Plain text passwords are never stored
- Same error message for wrong email and wrong password (prevents enumeration attacks)

### JWT Security
- Tokens expire after 7 days
- MFA pending tokens expire after 5 minutes
- All task routes protected by auth middleware

---

## ⚡ Redis Caching

Tasks are cached in Redis for 60 seconds:
```
First request → hits MongoDB → stores result in Redis
Second request → served from Redis (no DB hit)
Add/Update/Delete → invalidates cache automatically
```

This significantly reduces database load and improves response times.

---

## 💳 Razorpay Integration

- Test mode integration (no real money)
- Creates a Razorpay order on the backend
- Opens Razorpay checkout UI on the frontend
- Verifies payment signature using HMAC-SHA256
- Premium upgrade flow at ₹499/month

---

## 🐳 Docker Setup

### Build and run with Docker Compose:
```bash
docker-compose up --build
```

This starts:
- **Backend** on port 5000
- **Frontend** (Nginx) on port 80

### Individual Dockerfiles:
- `backend/Dockerfile` — Node.js 18 image
- `frontend/Dockerfile` — Multi-stage build: Node builds React, Nginx serves static files

---

## ☸️ Kubernetes Deployment

### Prerequisites
- minikube installed
- kubectl installed
- Docker images built

### Deploy to Kubernetes:
```bash
# Start minikube
minikube start

# Load Docker images into minikube
minikube image load todo-app-backend:latest
minikube image load todo-app-frontend:latest

# Apply deployments
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/hpa.yaml

# Check status
kubectl get pods
kubectl get services
kubectl get hpa

# Access the app
minikube service frontend-service
```

### Kubernetes Architecture:
```
Internet
    ↓
frontend-service (LoadBalancer, port 80)
    ↓
frontend pods (2 replicas)

backend-service (LoadBalancer, port 5000)
    ↓
backend pods (2 replicas, scales to 10)
    ↑
HPA (scales when CPU > 50%)
```

---

## 🌐 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user info |

### Task Routes (Protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (cached) |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### MFA Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/mfa/status` | Check MFA status |
| POST | `/api/mfa/setup` | Generate QR code |
| POST | `/api/mfa/verify` | Enable MFA |
| POST | `/api/mfa/login-verify` | Verify MFA on login |

### OAuth Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |

### Payment Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |

---

## ⚙️ Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
CALLBACK_URL=http://localhost:5000/auth/google/callback
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Redis Cloud account
- Google Cloud Console project (for OAuth)
- Razorpay account (test mode)

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 👨‍💻 Developer

**Jayadithya Akunuri**  
🔗 [LinkedIn](https://www.linkedin.com/in/jayadithya-akunuri-a5b2a1292)
