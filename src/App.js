import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, ProgressBar } from 'recharts';
import { Bell, Download, RefreshCw, Filter, Calendar, Factory, Users, Settings, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Eye, FileText } from 'lucide-react';

// Sample data
const generateTimeSeriesData = (days = 30) => {
  const data = [];
  const baseValues = {
    energy: 850,
    water: 1200,
    waste: 45,
    emissions: 320
  };
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    data.push({
      date: date.toISOString().split('T')[0],
      energy: baseValues.energy + (Math.random() - 0.5) * 200,
      water: baseValues.water + (Math.random() - 0.5) * 300,
      waste: baseValues.waste + (Math.random() - 0.5) * 20,
      emissions: baseValues.emissions + (Math.random() - 0.5) * 100,
    });
  }
  return data;
};

const departmentData = [
  { name: 'Dyeing', energy: 450, water: 680, waste: 25, emissions: 180 },
  { name: 'Weaving', energy: 320, water: 240, waste: 15, emissions: 95 },
  { name: 'Finishing', energy: 180, water: 280, waste: 8, emissions: 65 },
  { name: 'Quality Control', energy: 80, water: 45, waste: 2, emissions: 15 },
];

const alertsData = [
  { id: 1, type: 'critical', title: 'High Water Usage Alert', message: 'Water consumption 25% above target in Dyeing Dept', time: '2 hours ago', category: 'Water' },
  { id: 2, type: 'warning', title: 'Energy Efficiency Drop', message: 'Machine #3 showing 15% efficiency decrease', time: '4 hours ago', category: 'Energy' },
  { id: 3, type: 'info', title: 'Weekly Report Generated', message: 'Sustainability report for Week 32 is ready', time: '1 day ago', category: 'Reporting' },
  { id: 4, type: 'critical', title: 'Emissions Spike Detected', message: 'CO2 levels 30% above normal in Unit B', time: '6 hours ago', category: 'Emissions' },
];

const goalsData = [
  { metric: 'Energy Reduction', target: 20, current: 14, unit: '%', deadline: '2025-12-31', status: 'on-track' },
  { metric: 'Water Efficiency', target: 25, current: 18, unit: '%', deadline: '2025-12-31', status: 'on-track' },
  { metric: 'Waste Reduction', target: 30, current: 8, unit: '%', deadline: '2025-12-31', status: 'behind' },
  { metric: 'Carbon Neutral', target: 100, current: 45, unit: '%', deadline: '2030-12-31', status: 'on-track' },
];

const SustainabilityDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: 'today',
    unit: 'all',
    department: 'all',
    machine: 'all',
    shift: 'all'
  });
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    setTimeSeriesData(generateTimeSeriesData(30));
  }, []);

  const getCurrentKPIs = () => {
    const latest = timeSeriesData[timeSeriesData.length - 1] || {};
    return {
      energy: { value: latest.energy || 852, unit: 'kWh', target: 800, status: 'warning', trend: 'up' },
      water: { value: latest.water || 1245, unit: 'L', target: 1100, status: 'critical', trend: 'up' },
      waste: { value: latest.waste || 42, unit: 'kg', target: 35, status: 'warning', trend: 'down' },
      emissions: { value: latest.emissions || 298, unit: 'kg CO2', target: 250, status: 'critical', trend: 'up' }
    };
  };

  const getOverallPerformance = () => {
    const kpis = getCurrentKPIs();
    let score = 0;
    let total = 0;
    
    Object.values(kpis).forEach(kpi => {
      const percentage = (kpi.target / kpi.value) * 100;
      score += Math.min(percentage, 100);
      total += 100;
    });
    
    const overallScore = (score / total) * 100;
    let status = 'good';
    if (overallScore < 60) status = 'critical';
    else if (overallScore < 80) status = 'warning';
    
    return { score: Math.round(overallScore), status };
  };

  const handleRefresh = () => {
    setTimeSeriesData(generateTimeSeriesData(30));
    setLastRefresh(new Date());
  };

  const handleTileClick = (metric) => {
    setSelectedMetric(metric);
    setCurrentView('insights');
  };

  const handleExport = (format) => {
    alert(`Exporting ${selectedMetric || 'overall'} data as ${format.toUpperCase()}`);
  };

  const renderKPITile = (title, data, icon, color) => {
    const getStatusColor = (status) => {
      switch(status) {
        case 'good': return 'text-green-600 bg-green-50';
        case 'warning': return 'text-yellow-600 bg-yellow-50';
        case 'critical': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getTrendIcon = (trend) => {
      return trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
    };

    return (
      <div 
        className={`bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4`}
        style={{ borderLeftColor: color }}
        onClick={() => handleTileClick(title.toLowerCase())}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
              {icon}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500">Current Usage</p>
            </div>
          </div>
          <div className="flex items-center text-gray-400">
            {getTrendIcon(data.trend)}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-3xl font-bold text-gray-800">
            {data.value.toLocaleString()} <span className="text-lg font-normal text-gray-500">{data.unit}</span>
          </div>
          <div className="text-sm text-gray-500">
            Target: {data.target.toLocaleString()} {data.unit}
          </div>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}>
          {data.status === 'good' && <CheckCircle className="w-4 h-4 mr-1" />}
          {data.status === 'warning' && <AlertTriangle className="w-4 h-4 mr-1" />}
          {data.status === 'critical' && <XCircle className="w-4 h-4 mr-1" />}
          {data.value > data.target ? 'Above Target' : 'Within Target'}
        </div>
      </div>
    );
  };

  const renderOverallTile = () => {
    const overall = getOverallPerformance();
    const kpis = getCurrentKPIs();
    
    const radarData = [
      { metric: 'Energy', value: (kpis.energy.target / kpis.energy.value) * 100 },
      { metric: 'Water', value: (kpis.water.target / kpis.water.value) * 100 },
      { metric: 'Waste', value: (kpis.waste.target / kpis.waste.value) * 100 },
      { metric: 'Emissions', value: (kpis.emissions.target / kpis.emissions.value) * 100 },
    ];

    const getStatusColor = (status) => {
      switch(status) {
        case 'good': return 'text-green-600 bg-green-50';
        case 'warning': return 'text-yellow-600 bg-yellow-50';
        case 'critical': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    return (
      <div 
        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        onClick={() => handleTileClick('overall')}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Overall Performance</h3>
            <p className="text-sm text-gray-500">Sustainability Score</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{overall.score}%</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(overall.status)}`}>
              {overall.status === 'good' && <CheckCircle className="w-3 h-3 mr-1" />}
              {overall.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {overall.status === 'critical' && <XCircle className="w-3 h-3 mr-1" />}
              {overall.status.charAt(0).toUpperCase() + overall.status.slice(1)}
            </div>
          </div>
        </div>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 120]} tickCount={4} />
              <Radar
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <select 
          value={filters.timeRange} 
          onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        
        <select 
          value={filters.unit} 
          onChange={(e) => setFilters({...filters, unit: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Units</option>
          <option value="unit-a">Unit A</option>
          <option value="unit-b">Unit B</option>
          <option value="unit-c">Unit C</option>
        </select>
        
        <select 
          value={filters.department} 
          onChange={(e) => setFilters({...filters, department: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          <option value="dyeing">Dyeing</option>
          <option value="weaving">Weaving</option>
          <option value="finishing">Finishing</option>
          <option value="quality">Quality Control</option>
        </select>
        
        <select 
          value={filters.machine} 
          onChange={(e) => setFilters({...filters, machine: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Machines</option>
          <option value="machine-1">Machine 1</option>
          <option value="machine-2">Machine 2</option>
          <option value="machine-3">Machine 3</option>
        </select>
        
        <select 
          value={filters.shift} 
          onChange={(e) => setFilters({...filters, shift: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Shifts</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="night">Night</option>
        </select>
      </div>
    </div>
  );

  const renderAlertsPanel = () => (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Alerts & Notifications</h3>
          <button 
            onClick={() => setShowAlerts(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-4 overflow-y-auto h-full">
        {alertsData.map(alert => (
          <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
            alert.type === 'critical' ? 'border-red-500 bg-red-50' :
            alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
          }`}>
            <div className="flex items-center mb-2">
              {alert.type === 'critical' && <XCircle className="w-4 h-4 text-red-500 mr-2" />}
              {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />}
              {alert.type === 'info' && <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />}
              <span className="text-sm font-medium text-gray-800">{alert.title}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{alert.category}</span>
              <span>{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGoalsSection = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sustainability Goals Progress</h3>
      <div className="space-y-4">
        {goalsData.map((goal, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{goal.metric}</h4>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  goal.status === 'on-track' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {goal.status === 'on-track' ? 'On Track' : 'Behind Schedule'}
                </span>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className={`h-2 rounded-full ${goal.status === 'on-track' ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {goal.current}{goal.unit} / {goal.target}{goal.unit}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsightsView = () => {
    const kpis = getCurrentKPIs();
    const currentMetricData = selectedMetric === 'overall' ? null : kpis[selectedMetric];
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedMetric === 'overall' ? 'Overall Performance Insights' : `${selectedMetric?.charAt(0).toUpperCase() + selectedMetric?.slice(1)} Insights`}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleExport('pdf')}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <FileText className="w-4 h-4 mr-1" />
                Export PDF
              </button>
              <button 
                onClick={() => handleExport('csv')}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Download className="w-4 h-4 mr-1" />
                Export CSV
              </button>
            </div>
          </div>

          {renderFilters()}

          {/* Main Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Trend Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {selectedMetric === 'overall' ? 'Overall Trend' : `${selectedMetric?.charAt(0).toUpperCase() + selectedMetric?.slice(1)} Trend (30 Days)`}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {selectedMetric === 'overall' ? (
                      <>
                        <Line type="monotone" dataKey="energy" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="emissions" stroke="#f59e0b" strokeWidth={2} />
                      </>
                    ) : (
                      <Line type="monotone" dataKey={selectedMetric} stroke="#3b82f6" strokeWidth={2} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Comparison */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    {selectedMetric === 'overall' ? (
                      <>
                        <Bar dataKey="energy" fill="#ef4444" />
                        <Bar dataKey="water" fill="#3b82f6" />
                        <Bar dataKey="waste" fill="#10b981" />
                        <Bar dataKey="emissions" fill="#f59e0b" />
                      </>
                    ) : (
                      <Bar dataKey={selectedMetric} fill="#3b82f6" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Key Insights & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Anomalies */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Anomalies Detected
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="text-sm font-medium text-red-800">High Water Usage</p>
                  <p className="text-xs text-red-600">25% above normal in Dyeing dept</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-sm font-medium text-yellow-800">Energy Spike</p>
                  <p className="text-xs text-yellow-600">15% increase at 2 PM shift</p>
                </div>
              </div>
            </div>

            {/* Hotspots */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Eye className="w-5 h-5 text-orange-500 mr-2" />
                Performance Hotspots
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm font-medium text-orange-800">Dyeing Dept</span>
                  <span className="text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded-full">Critical</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm font-medium text-yellow-800">Machine #3</span>
                  <span className="text-xs text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">Warning</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium text-green-800">Quality Control</span>
                  <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">Good</span>
                </div>
              </div>
            </div>

            {/* Cost Impact */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Cost Impact Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Potential Savings</span>
                  <span className="text-lg font-bold text-green-600">$12,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Excess Costs</span>
                  <span className="text-lg font-bold text-red-600">$8,200</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">Net Impact</span>
                    <span className="text-xl font-bold text-green-600">$4,300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Progress in Insights */}
          {selectedMetric === 'overall' && (
            <div className="mt-6">
              {renderGoalsSection()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const kpis = getCurrentKPIs();
    const criticalAlerts = alertsData.filter(alert => alert.type === 'critical').length;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sustainability Dashboard</h1>
              <p className="text-gray-600">Monitor and optimize your textile manufacturing sustainability metrics</p>
              <p className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</p>
            </div>
            <button 
              onClick={() => setShowAlerts(true)}
              className="relative flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
            >
              <Bell className="w-5 h-5 text-gray-600 mr-2" />
              Alerts
              {criticalAlerts > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {criticalAlerts}
                </span>
              )}
            </button>
          </div>

          {renderFilters()}

          {/* KPI Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Overall Performance Tile */}
            <div className="md:col-span-2 lg:col-span-1">
              {renderOverallTile()}
            </div>
            
            {/* Energy KPI */}
            {renderKPITile('Energy', kpis.energy, <Factory className="w-6 h-6" style={{color: '#ef4444'}} />, '#ef4444')}
            
            {/* Water KPI */}
            {renderKPITile('Water', kpis.water, <Users className="w-6 h-6" style={{color: '#3b82f6'}} />, '#3b82f6')}
            
            {/* Waste KPI */}
            {renderKPITile('Waste', kpis.waste, <Settings className="w-6 h-6" style={{color: '#10b981'}} />, '#10b981')}
            
            {/* Emissions KPI */}
            {renderKPITile('Emissions', kpis.emissions, <TrendingUp className="w-6 h-6" style={{color: '#f59e0b'}} />, '#f59e0b')}
          </div>

          {/* Goals Progress */}
          {renderGoalsSection()}

          {/* Quick Insights Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Performance Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-800">Water usage 25% above target</span>
                  </div>
                  <span className="text-xs text-red-600 bg-red-200 px-2 py-1 rounded-full">Critical</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">Energy efficiency down 6%</span>
                  </div>
                  <span className="text-xs text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">Warning</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-800">Waste reduction on track</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">Good</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Trends (7 Days)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString().split('/')[1] + '/' + new Date(value).toLocaleDateString().split('/')[0]} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="energy" stroke="#ef4444" strokeWidth={2} name="Energy" />
                    <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} name="Water" />
                    <Line type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={2} name="Waste" />
                    <Line type="monotone" dataKey="emissions" stroke="#f59e0b" strokeWidth={2} name="Emissions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Department Performance Heatmap */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-medium text-gray-800 mb-3">{dept.name}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Energy</span>
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((dept.energy / 500) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{dept.energy}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Water</span>
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((dept.water / 700) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{dept.water}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Waste</span>
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((dept.waste / 30) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{dept.waste}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Emissions</span>
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((dept.emissions / 200) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{dept.emissions}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      dept.energy > 400 || dept.water > 600 ? 'bg-red-100 text-red-800' :
                      dept.energy > 300 || dept.water > 400 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {dept.energy > 400 || dept.water > 600 ? 'Needs Attention' :
                       dept.energy > 300 || dept.water > 400 ? 'Monitor' : 'Good'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        {showAlerts && renderAlertsPanel()}
      </div>
    );
  };

  return (
    <div className="font-sans">
      {currentView === 'dashboard' ? renderDashboard() : renderInsightsView()}
    </div>
  );
};

export default SustainabilityDashboard;