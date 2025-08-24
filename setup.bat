@echo off
chcp 65001 >nul
echo 🌱 Sustainability Dashboard Setup
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

echo.
echo 🚀 Installing dependencies...
echo.

REM Install root dependencies
npm install

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
cd ..

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install
cd ..

REM Install common dependencies
echo 📦 Installing common dependencies...
cd common
npm install
cd ..

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Create environment files
echo 🔧 Setting up environment files...

REM Server environment
if not exist "server\.env" (
    echo 📝 Creating server\.env from template...
    copy "server\env.example" "server\.env"
    echo    Please edit server\.env with your configuration
) else (
    echo ✅ server\.env already exists
)

REM Client environment
if not exist "client\.env" (
    echo 📝 Creating client\.env...
    echo VITE_API_URL=http://localhost:5000/api > client\.env
    echo    Client environment file created
) else (
    echo ✅ client\.env already exists
)

echo.
echo 🎯 Next Steps:
echo ==============
echo.
echo 1. 📝 Edit environment files:
echo    - server\.env (database, JWT secret, etc.)
echo    - client\.env (API URL)
echo.
echo 2. 🗄️  Start MongoDB:
echo    - Local: mongod
echo    - Docker: npm run docker:up
echo.
echo 3. 🌱 Seed the database:
echo    npm run seed
echo.
echo 4. 🚀 Start development servers:
echo    npm run dev
echo.
echo 5. 🌐 Access the application:
echo    - Frontend: http://localhost:3000
echo    - Backend: http://localhost:5000
echo.
echo 📚 For more information, see README.md
echo.
echo 🎉 Setup completed successfully!
pause
