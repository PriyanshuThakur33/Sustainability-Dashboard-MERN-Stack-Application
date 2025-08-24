import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { UserRole, MetricType, QualityFlag } from '@sustainability-dashboard/common';

// Load environment variables
dotenv.config();

// Import models
import UserModel from '../models/User';
import MeterReadingModel from '../models/MeterReading';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sustainability-dashboard';

// Sample data
const sampleUsers = [
  {
    email: 'admin@sustainability.com',
    name: 'Admin User',
    password: 'password123',
    role: UserRole.ADMIN,
    department: 'IT',
    unit: 'Headquarters'
  },
  {
    email: 'head@sustainability.com',
    name: 'Head of Sustainability',
    password: 'password123',
    role: UserRole.HEAD_OF_SUSTAINABILITY,
    department: 'Sustainability',
    unit: 'Headquarters'
  },
  {
    email: 'analyst@sustainability.com',
    name: 'Data Analyst',
    password: 'password123',
    role: UserRole.ANALYST,
    department: 'Analytics',
    unit: 'Headquarters'
  },
  {
    email: 'viewer@sustainability.com',
    name: 'Viewer User',
    password: 'password123',
    role: UserRole.VIEWER,
    department: 'Operations',
    unit: 'Plant A'
  }
];

const sampleUnits = [
  { name: 'Headquarters', location: 'New York, NY' },
  { name: 'Plant A', location: 'Atlanta, GA' },
  { name: 'Plant B', location: 'Dallas, TX' },
  { name: 'Plant C', location: 'Los Angeles, CA' }
];

const sampleDepartments = [
  { name: 'Production', unitId: 'Plant A' },
  { name: 'Maintenance', unitId: 'Plant A' },
  { name: 'Quality Control', unitId: 'Plant A' },
  { name: 'Production', unitId: 'Plant B' },
  { name: 'Maintenance', unitId: 'Plant B' },
  { name: 'Production', unitId: 'Plant C' }
];

const sampleMachines = [
  { name: 'Spinning Machine 1', type: 'Spinner', departmentId: 'Production' },
  { name: 'Weaving Machine 1', type: 'Loom', departmentId: 'Production' },
  { name: 'Dyeing Machine 1', type: 'Dyer', departmentId: 'Production' },
  { name: 'Compressor 1', type: 'Compressor', departmentId: 'Maintenance' }
];

const sampleShifts = [
  { name: 'Morning Shift', startTime: '06:00', endTime: '14:00' },
  { name: 'Afternoon Shift', startTime: '14:00', endTime: '22:00' },
  { name: 'Night Shift', startTime: '22:00', endTime: '06:00' }
];

// Generate sample meter readings for the last 12 months
const generateMeterReadings = () => {
  const readings = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  
  // Generate daily readings for each metric
  Object.values(MetricType).forEach(metric => {
    let currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      // Generate 24 hourly readings per day
      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(currentDate);
        timestamp.setHours(hour, 0, 0, 0);
        
        // Generate realistic values with some variation
        let baseValue = 0;
        let unit = '';
        
        switch (metric) {
          case MetricType.ENERGY:
            baseValue = 100 + Math.random() * 200; // 100-300 kWh
            unit = 'kWh';
            break;
          case MetricType.WATER:
            baseValue = 50 + Math.random() * 100; // 50-150 m³
            unit = 'm³';
            break;
          case MetricType.WASTE:
            baseValue = 20 + Math.random() * 30; // 20-50 kg
            unit = 'kg';
            break;
          case MetricType.EMISSIONS:
            baseValue = 5 + Math.random() * 10; // 5-15 tCO₂e
            unit = 'tCO₂e';
            break;
        }
        
        // Add some seasonal variation
        const month = timestamp.getMonth();
        const seasonalFactor = 1 + 0.2 * Math.sin((month / 12) * 2 * Math.PI);
        
        // Add some daily variation (higher during work hours)
        const workHourFactor = hour >= 6 && hour <= 18 ? 1.5 : 0.3;
        
        // Add some random noise
        const noiseFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2
        
        const finalValue = baseValue * seasonalFactor * workHourFactor * noiseFactor;
        
        // Determine quality flag
        let qualityFlag = QualityFlag.GOOD;
        if (Math.random() < 0.05) qualityFlag = QualityFlag.SUSPICIOUS;
        if (Math.random() < 0.01) qualityFlag = QualityFlag.BAD;
        
        readings.push({
          metric,
          timestamp,
          value: Math.round(finalValue * 100) / 100,
          unit,
          unitId: sampleUnits[Math.floor(Math.random() * sampleUnits.length)].name,
          departmentId: sampleDepartments[Math.floor(Math.random() * sampleDepartments.length)].name,
          machineId: sampleMachines[Math.floor(Math.random() * sampleMachines.length)].name,
          shiftId: sampleShifts[Math.floor(Math.random() * sampleShifts.length)].name,
          qualityFlag
        });
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  
  return readings;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database cleared');
    
    // Create users
    console.log('👥 Creating users...');
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await UserModel.create({
        ...userData,
        password: hashedPassword,
        isActive: true
      });
    }
    console.log(`✅ Created ${sampleUsers.length} users`);
    
    // Create meter readings
    console.log('📊 Creating meter readings...');
    const meterReadings = generateMeterReadings();
    await MeterReadingModel.insertMany(meterReadings);
    console.log(`✅ Created ${meterReadings.length} meter readings`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Users:');
    sampleUsers.forEach(user => {
      console.log(`   ${user.email} / ${user.password}`);
    });
    
    console.log('\n🔗 Access URLs:');
    console.log(`   Frontend: http://localhost:3000`);
    console.log(`   Backend: http://localhost:5000`);
    console.log(`   MongoDB: mongodb://localhost:27017/sustainability-dashboard`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
