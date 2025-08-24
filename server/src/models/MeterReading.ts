import mongoose, { Document, Schema } from 'mongoose';
import { MeterReading, MetricType, QualityFlag } from '@sustainability-dashboard/common';

export interface MeterReadingDocument extends MeterReading, Document {}

const meterReadingSchema = new Schema<MeterReadingDocument>({
  metric: {
    type: String,
    enum: Object.values(MetricType),
    required: [true, 'Metric type is required']
  },
  timestamp: {
    type: Date,
    required: [true, 'Timestamp is required'],
    index: true
  },
  value: {
    type: Number,
    required: [true, 'Value is required'],
    min: [0, 'Value cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required']
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit ID is required']
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department ID is required']
  },
  machineId: {
    type: Schema.Types.ObjectId,
    ref: 'Machine'
  },
  shiftId: {
    type: Schema.Types.ObjectId,
    ref: 'Shift',
    required: [true, 'Shift ID is required']
  },
  qualityFlag: {
    type: String,
    enum: Object.values(QualityFlag),
    default: QualityFlag.GOOD
  }
}, {
  timestamps: true
});

// Create compound indexes for efficient querying
meterReadingSchema.index({ metric: 1, timestamp: -1 });
meterReadingSchema.index({ metric: 1, unitId: 1, timestamp: -1 });
meterReadingSchema.index({ metric: 1, departmentId: 1, timestamp: -1 });
meterReadingSchema.index({ metric: 1, machineId: 1, timestamp: -1 });
meterReadingSchema.index({ metric: 1, shiftId: 1, timestamp: -1 });
meterReadingSchema.index({ timestamp: -1 });
meterReadingSchema.index({ qualityFlag: 1 });

// Virtual for formatted timestamp
meterReadingSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toISOString();
});

// Ensure virtuals are serialized
meterReadingSchema.set('toJSON', { virtuals: true });
meterReadingSchema.set('toObject', { virtuals: true });

export default mongoose.model<MeterReadingDocument>('MeterReading', meterReadingSchema);
