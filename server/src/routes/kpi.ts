import express from 'express';
import { query, validationResult } from 'express-validator';
import { protect, optionalAuth } from '../middleware/auth';
import MeterReadingModel from '../models/MeterReading';
import { logger } from '../utils/logger';
import { MetricType } from '@sustainability-dashboard/common';
import { getDateRange, calculateDelta, calculateDeltaPercentage, determineTrend, generateSparkline } from '@sustainability-dashboard/common';

const router = express.Router();

// @desc    Get KPI summary for dashboard
// @route   GET /api/kpi/summary
// @access  Private
router.get('/summary', [
  protect,
  [
    query('dateRange').optional().isIn(['today', 'week', 'month', 'quarter', 'year']),
    query('unitId').optional().isMongoId(),
    query('departmentId').optional().isMongoId(),
    query('machineId').optional().isMongoId(),
    query('shiftId').optional().isMongoId()
  ]
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { dateRange = 'today', unitId, departmentId, machineId, shiftId } = req.query;
    const { start, end } = getDateRange(dateRange);

    // Build filter object
    const filter: any = {
      timestamp: { $gte: start, $lte: end }
    };

    if (unitId) filter.unitId = unitId;
    if (departmentId) filter.departmentId = departmentId;
    if (machineId) filter.machineId = machineId;
    if (shiftId) filter.shiftId = shiftId;

    // Get current period data
    const currentData = await MeterReadingModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$metric',
          currentValue: { $sum: '$value' },
          sparkline: { $push: { timestamp: '$timestamp', value: '$value' } }
        }
      }
    ]);

    // Get previous period data for comparison
    const previousStart = new Date(start);
    const previousEnd = new Date(end);
    const periodDuration = end.getTime() - start.getTime();
    
    previousStart.setTime(previousStart.getTime() - periodDuration);
    previousEnd.setTime(previousEnd.getTime() - periodDuration);

    const previousFilter = { ...filter };
    previousFilter.timestamp = { $gte: previousStart, $lte: previousEnd };

    const previousData = await MeterReadingModel.aggregate([
      { $match: previousFilter },
      {
        $group: {
          _id: '$metric',
          previousValue: { $sum: '$value' }
        }
      }
    ]);

    // Create KPI summary objects
    const kpiSummary = Object.values(MetricType).map(metric => {
      const current = currentData.find(d => d._id === metric);
      const previous = previousData.find(d => d._id === metric);
      
      const currentValue = current?.currentValue || 0;
      const previousValue = previous?.previousValue || 0;
      const delta = calculateDelta(currentValue, previousValue);
      const deltaPercentage = calculateDeltaPercentage(currentValue, previousValue);
      const trend = determineTrend(delta);
      
      // Generate sparkline data
      let sparkline: number[] = [];
      if (current?.sparkline) {
        const sortedData = current.sparkline
          .sort((a: any, b: any) => a.timestamp - b.timestamp)
          .map((item: any) => item.value);
        sparkline = generateSparkline(sortedData, 7);
      }

      return {
        metric,
        currentValue,
        previousValue,
        delta,
        deltaPercentage,
        trend,
        sparkline,
        unit: getMetricUnit(metric)
      };
    });

    // Calculate overall KPI
    const overallCurrent = kpiSummary.reduce((sum, kpi) => sum + kpi.currentValue, 0);
    const overallPrevious = kpiSummary.reduce((sum, kpi) => sum + kpi.previousValue, 0);
    const overallDelta = calculateDelta(overallCurrent, overallPrevious);
    const overallDeltaPercentage = calculateDeltaPercentage(overallCurrent, overallPrevious);
    const overallTrend = determineTrend(overallDelta);

    const overallKPI = {
      metric: 'overall',
      currentValue: overallCurrent,
      previousValue: overallPrevious,
      delta: overallDelta,
      deltaPercentage: overallDeltaPercentage,
      trend: overallTrend,
      sparkline: kpiSummary.map(kpi => kpi.currentValue),
      unit: 'total'
    };

    res.json({
      success: true,
      data: {
        kpis: kpiSummary,
        overall: overallKPI,
        filters: {
          dateRange,
          unitId,
          departmentId,
          machineId,
          shiftId
        }
      }
    });
  } catch (error) {
    logger.error('Error getting KPI summary:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get KPI insights for a specific metric
// @route   GET /api/kpi/:metric/insights
// @access  Private
router.get('/:metric/insights', [
  protect,
  [
    query('dateRange').optional().isIn(['today', 'week', 'month', 'quarter', 'year']),
    query('unitId').optional().isMongoId(),
    query('departmentId').optional().isMongoId(),
    query('machineId').optional().isMongoId(),
    query('shiftId').optional().isMongoId(),
    query('interval').optional().isIn(['hour', 'day', 'week', 'month'])
  ]
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { metric } = req.params;
    const { dateRange = 'month', unitId, departmentId, machineId, shiftId, interval = 'day' } = req.query;

    // Validate metric
    if (!Object.values(MetricType).includes(metric)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid metric type'
      });
    }

    const { start, end } = getDateRange(dateRange);

    // Build filter object
    const filter: any = {
      metric,
      timestamp: { $gte: start, $lte: end }
    };

    if (unitId) filter.unitId = unitId;
    if (departmentId) filter.departmentId = departmentId;
    if (machineId) filter.machineId = machineId;
    if (shiftId) filter.shiftId = shiftId;

    // Get time series data
    const timeSeriesData = await MeterReadingModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            hour: { $hour: '$timestamp' }
          },
          value: { $sum: '$value' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          '_id.hour': 1
        }
      }
    ]);

    // Get hotspot data by department
    const departmentHotspots = await MeterReadingModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $group: {
          _id: '$departmentId',
          departmentName: { $first: '$department.name' },
          value: { $sum: '$value' },
          count: { $sum: 1 }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ]);

    // Get anomaly data
    const anomalyData = await MeterReadingModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          values: { $push: '$value' },
          avgValue: { $avg: '$value' },
          stdDev: { $stdDevPop: '$value' }
        }
      },
      {
        $project: {
          timestamp: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          avgValue: 1,
          stdDev: 1,
          anomalies: {
            $filter: {
              input: '$values',
              as: 'value',
              cond: {
                $gt: [
                  { $abs: { $subtract: ['$$value', '$avgValue'] } },
                  { $multiply: ['$stdDev', 2] }
                ]
              }
            }
          }
        }
      },
      { $match: { 'anomalies.0': { $exists: true } } },
      { $sort: { timestamp: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        metric,
        timeSeries: timeSeriesData.map(item => ({
          timestamp: new Date(item._id.year, item._id.month - 1, item._id.day, item._id.hour || 0),
          value: item.value,
          count: item.count
        })),
        hotspots: {
          departments: departmentHotspots.map(item => ({
            category: item.departmentName || 'Unknown',
            value: item.value,
            percentage: 0, // Calculate percentage based on total
            trend: 'stable' // Determine trend
          }))
        },
        anomalies: anomalyData.map(item => ({
          timestamp: item.timestamp,
          value: item.avgValue,
          expectedValue: item.avgValue,
          deviation: item.stdDev,
          severity: item.anomalies.length
        })),
        filters: {
          dateRange,
          unitId,
          departmentId,
          machineId,
          shiftId,
          interval
        }
      }
    });
  } catch (error) {
    logger.error('Error getting KPI insights:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper function to get metric unit
const getMetricUnit = (metric: string): string => {
  switch (metric) {
    case MetricType.ENERGY:
      return 'kWh';
    case MetricType.WATER:
      return 'm³';
    case MetricType.WASTE:
      return 'kg';
    case MetricType.EMISSIONS:
      return 'tCO₂e';
    default:
      return '';
  }
};

export default router;
