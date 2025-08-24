// Core entity types
export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  unit?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  HEAD_OF_SUSTAINABILITY = 'head_of_sustainability',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

export interface Unit {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface Department {
  _id: string;
  name: string;
  unitId: string;
  isActive: boolean;
}

export interface Machine {
  _id: string;
  name: string;
  type: string;
  departmentId: string;
  isActive: boolean;
}

export interface Shift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// KPI and metrics
export enum MetricType {
  ENERGY = 'energy',
  WATER = 'water',
  WASTE = 'waste',
  EMISSIONS = 'emissions'
}

export interface MeterReading {
  _id: string;
  metric: MetricType;
  timestamp: Date;
  value: number;
  unit: string;
  unitId: string;
  departmentId: string;
  machineId?: string;
  shiftId: string;
  qualityFlag: QualityFlag;
  createdAt: Date;
  updatedAt: Date;
}

export enum QualityFlag {
  GOOD = 'good',
  SUSPICIOUS = 'suspicious',
  BAD = 'bad'
}

export interface KPISummary {
  metric: MetricType;
  currentValue: number;
  previousValue: number;
  delta: number;
  deltaPercentage: number;
  trend: TrendDirection;
  sparkline: number[];
  unit: string;
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable'
}

// Filters
export interface DashboardFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  unitId?: string;
  departmentId?: string;
  machineId?: string;
  shiftId?: string;
}

// Alerts
export interface Alert {
  _id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  metric: MetricType;
  threshold?: number;
  currentValue: number;
  unitId?: string;
  departmentId?: string;
  machineId?: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface AlertRule {
  _id: string;
  name: string;
  description: string;
  metric: MetricType;
  condition: AlertCondition;
  threshold: number;
  severity: AlertSeverity;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AlertCondition {
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  PERCENTAGE_CHANGE = 'percentage_change',
  Z_SCORE = 'z_score'
}

// Goals and Tasks
export interface Goal {
  _id: string;
  title: string;
  description: string;
  metric: MetricType;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: GoalStatus;
  milestones: Milestone[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum GoalStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  BEHIND = 'behind',
  COMPLETED = 'completed'
}

export interface Milestone {
  _id: string;
  title: string;
  targetValue: number;
  deadline: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  relatedKPI?: MetricType;
  relatedAlert?: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Comments and Collaboration
export interface Comment {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  relatedKPI?: MetricType;
  relatedAlert?: string;
  relatedTask?: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Reports and Exports
export interface Report {
  _id: string;
  name: string;
  type: ReportType;
  filters: DashboardFilters;
  generatedBy: string;
  generatedAt: Date;
  downloadUrl?: string;
  expiresAt: Date;
}

export enum ReportType {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel'
}

// Audit and Events
export interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface Event {
  _id: string;
  type: EventType;
  title: string;
  description: string;
  severity: EventSeverity;
  metadata: Record<string, any>;
  timestamp: Date;
  isResolved: boolean;
  resolvedAt?: Date;
}

export enum EventType {
  ANOMALY_DETECTED = 'anomaly_detected',
  THRESHOLD_EXCEEDED = 'threshold_exceeded',
  GOAL_MILESTONE = 'goal_milestone',
  SYSTEM_ALERT = 'system_alert'
}

export enum EventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Chart data types
export interface ChartDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface AnomalyData {
  timestamp: Date;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: number;
}

export interface HotspotData {
  category: string;
  value: number;
  percentage: number;
  trend: TrendDirection;
}
