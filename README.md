# Sustainability Dashboard 🌱

A production-ready **Sustainability Dashboard web application** for textile manufacturing companies built with the **MERN stack** (MongoDB, Express.js, React.js with Vite, Node.js).

## 🚀 Features

### 📊 Core Functionality
- **KPI Monitoring**: Energy (kWh), Water (m³), Waste (kg), Emissions (tCO₂e)
- **Smart Filtering**: Date/time range, Unit, Department, Machine, Shift with persistent state
- **Real-time Dashboard**: 4 KPI tiles + Overall performance with trend sparklines
- **Alerts System**: Rule-based + anomaly detection with severity levels
- **Collaboration Tools**: Sticky comments, Action Tracker, Task management
- **Goals Tracking**: Milestone-based sustainability goals with progress monitoring

### 📈 Insights & Analytics
- **Trend Analysis**: Time-series charts with drill-down capabilities
- **Anomaly Detection**: Statistical analysis with z-score calculations
- **Hotspot Identification**: Performance analysis by department/machine/shift
- **Cost Impact**: Convert inefficiencies into financial metrics
- **Comparison Views**: Time periods, departments, machines benchmarking

### 📋 Reports & Export
- **Multiple Formats**: PDF, CSV, Excel exports
- **Branded Reports**: Company logo and professional formatting
- **Automated Emails**: Weekly summaries with KPI insights
- **Audit Logs**: Complete action tracking for compliance

### 🔐 Security & Access
- **JWT Authentication**: Secure access with refresh tokens
- **Role-based Access**: Admin, Head of Sustainability, Analyst, Viewer
- **Audit Trail**: Complete logging of all user actions
- **Rate Limiting**: API protection against abuse

## 🏗️ Architecture

### Monorepo Structure
```
sustainability-dashboard/
├── client/                 # React frontend (Vite)
├── server/                 # Express.js backend
├── common/                 # Shared types and utilities
├── docker-compose.yml      # Development environment
└── README.md
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Recharts
- **Backend**: Node.js + Express.js + TypeScript + MongoDB + Mongoose
- **Authentication**: JWT + bcrypt + role-based access control
- **Database**: MongoDB with optimized indexes and aggregation pipelines
- **Charts**: Recharts for data visualization
- **State Management**: Zustand for client-side state
- **API Client**: React Query for server state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB 6+ (local or cloud)
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd sustainability-dashboard
npm run install:all
```

### 2. Environment Configuration
Create `.env` files in both `server/` and `client/` directories:

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sustainability-dashboard
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Seed the database with sample data
npm run seed
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client    # Frontend on http://localhost:3000
npm run dev:server    # Backend on http://localhost:5000
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Individual Test Suites
```bash
npm run test:client    # Frontend tests
npm run test:server    # Backend tests
```

### Test Coverage
```bash
npm run test:coverage
```

## 🐳 Docker Development

### Start with Docker Compose
```bash
npm run docker:up
```

### Stop Docker Services
```bash
npm run docker:down
```

## 📁 Project Structure

### Backend (Server)
```
server/
├── src/
│   ├── config/          # Database and app configuration
│   ├── middleware/      # Authentication, validation, error handling
│   ├── models/          # Mongoose schemas and models
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic and external integrations
│   ├── utils/           # Helper functions and utilities
│   └── scripts/         # Database seeding and maintenance
├── package.json
└── tsconfig.json
```

### Frontend (Client)
```
client/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components and routing
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand state management
│   ├── services/       # API client and external services
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### KPI Data
- `GET /api/kpi/summary` - Dashboard KPI summary
- `GET /api/kpi/:metric/insights` - Detailed metric insights

### Alerts & Monitoring
- `GET /api/alerts` - Get alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert

### Management
- `GET /api/filters` - Get filter options (units, departments, etc.)
- `GET /api/goals` - Get sustainability goals
- `GET /api/tasks` - Get action items
- `POST /api/export` - Generate reports

## 🎯 Key Components

### KPI Dashboard
- **Real-time Metrics**: Current values with trend indicators
- **Sparkline Charts**: Quick visual trends for each metric
- **Delta Calculations**: Period-over-period changes
- **Responsive Design**: Works on desktop and mobile

### Filter System
- **Persistent State**: Filters persist across page reloads
- **Cascading Filters**: Unit → Department → Machine → Shift
- **Date Range Selection**: Today, Week, Month, Quarter, Year
- **URL State**: Shareable filtered views

### Alert Management
- **Rule-based Alerts**: Configurable thresholds and conditions
- **Anomaly Detection**: Statistical outlier identification
- **Severity Levels**: Low, Medium, High, Critical
- **Acknowledgment System**: Track alert resolution

## 🔧 Development

### Code Quality
- **TypeScript**: Full type safety across the stack
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for quality checks

### Performance
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: React Query for API response caching
- **Lazy Loading**: Code splitting and dynamic imports
- **Image Optimization**: WebP format and responsive images

### Security
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: API protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers and protection

## 📊 Data Models

### Core Entities
- **Users**: Authentication and role management
- **Units**: Manufacturing facilities
- **Departments**: Organizational units within facilities
- **Machines**: Production equipment
- **Shifts**: Work schedule periods

### KPI Data
- **MeterReadings**: Raw sensor data with timestamps
- **KPISummary**: Aggregated performance metrics
- **Alerts**: Threshold violations and anomalies
- **Goals**: Sustainability targets and milestones

### Collaboration
- **Comments**: Pinned notes on KPIs and alerts
- **Tasks**: Action items with assignments
- **AuditLogs**: Complete action history

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Set production environment variables:
- Database connection strings
- JWT secrets
- API keys for external services
- Email service configuration

### Monitoring
- Application performance monitoring
- Error tracking and alerting
- Database performance metrics
- User activity analytics

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Document new API endpoints
- Update README for new features

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

---

**Built with ❤️ for sustainable manufacturing**

*This dashboard helps textile companies monitor, optimize, and improve their sustainability performance through data-driven insights and collaborative action planning.*
