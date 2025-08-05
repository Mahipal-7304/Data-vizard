import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dataService from '../services/dataService';
import chartService from '../services/chartService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,

  Chip,
  Paper,
  Container,
  Button,

  Stack,

} from '@mui/material';
import {
  Description as FileTextIcon,
  TrendingUp,
  Timeline as ActivityIcon,
  Visibility as EyeIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as CloudUploadIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
  Folder as FolderIcon,
  InsertChart as InsertChartIcon,
} from '@mui/icons-material';

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCharts: 0,
    recentUploads: 0,
    totalViews: 0,
    storageUsed: 0,
    storageLimit: 100
  });

  const [recentFiles, setRecentFiles] = useState([]);
  const [recentCharts, setRecentCharts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch files data
        const filesResponse = await dataService.getFiles();
        if (filesResponse.success) {
          const files = filesResponse.data;
          setRecentFiles(files.slice(0, 4).map(file => ({
            id: file._id,
            name: file.filename,
            size: formatFileSize(file.size),
            uploadedAt: formatDate(file.uploadDate),
            type: file.mimetype.split('/')[1].toUpperCase(),
            status: file.processed ? 'processed' : 'processing'
          })));
        }

        // Fetch charts data
        const chartsResponse = await chartService.getCharts();
        if (chartsResponse.success) {
          const charts = chartsResponse.data;
          setRecentCharts(charts.slice(0, 3).map(chart => ({
            id: chart._id,
            name: chart.title,
            type: chart.type,
            views: chart.views || 0,
            createdAt: formatDate(chart.createdAt),
            status: chart.published ? 'published' : 'draft'
          })));
        }

        // Fetch chart statistics
        const statsResponse = await chartService.getChartStats();
        if (statsResponse.success) {
          const statsData = statsResponse.data;
          setStats({
            totalFiles: statsData.totalFiles || 0,
            totalCharts: statsData.totalCharts || 0,
            recentUploads: statsData.recentUploads || 0,
            totalViews: statsData.totalViews || 0,
            storageUsed: statsData.storageUsed || 0,
            storageLimit: statsData.storageLimit || 100
          });
        }

        // Create recent activity from files and charts
        const activity = [];
        if (filesResponse.success) {
          filesResponse.data.slice(0, 2).forEach(file => {
            activity.push({
              id: `file-${file._id}`,
              action: 'File uploaded',
              item: file.filename,
              time: getRelativeTime(file.uploadDate),
              type: 'upload'
            });
          });
        }
        if (chartsResponse.success) {
          chartsResponse.data.slice(0, 2).forEach(chart => {
            activity.push({
              id: `chart-${chart._id}`,
              action: 'Chart created',
              item: chart.title,
              time: getRelativeTime(chart.createdAt),
              type: 'chart'
            });
          });
        }
        setRecentActivity(activity.slice(0, 4));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data if API fails
        setStats({
          totalFiles: 0,
          totalCharts: 0,
          recentUploads: 0,
          totalViews: 0,
          storageUsed: 0,
          storageLimit: 100
        });
        setRecentFiles([]);
        setRecentCharts([]);
        setRecentActivity([]);
      }
    };

    fetchDashboardData();
  }, []);

  // Professional Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <Card 
      sx={{ 
        height: '100%', 
        background: `linear-gradient(135deg, ${color}08 0%, ${color}04 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px -8px ${color}40`,
          border: `1px solid ${color}30`,
        } 
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              color="text.secondary" 
              variant="body2" 
              sx={{ fontWeight: 500, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                mb: 0.5,
                background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
              borderRadius: 3,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${color}30`
            }}
          >
            <Icon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, to }) => (
    <Card 
      component={Link} 
      to={to} 
      sx={{ 
        textDecoration: 'none', 
        height: '100%',
        transition: 'all 0.3s',
        '&:hover': { 
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            <Icon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 4 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: 'white',
            p: 4,
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.1,
            },
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontWeight: 400 }}>
                Transform your data into powerful insights with our advanced visualization platform.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => navigate('/upload')}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Upload Data
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<InsertChartIcon />}
                  onClick={() => navigate('/charts/new')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Create Chart
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 120, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Files"
            value={stats.totalFiles}
            subtitle="Data files uploaded"
            icon={FolderIcon}
            color="#2563eb"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Charts Created"
            value={stats.totalCharts}
            subtitle="Visualizations built"
            icon={InsertChartIcon}
            color="#10b981"
            trend="+8% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            subtitle="Chart interactions"
            icon={EyeIcon}
            color="#f59e0b"
            trend="+15% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Storage Used"
            value={`${stats.storageUsed}%`}
            subtitle={`${stats.storageUsed}GB of ${stats.storageLimit}GB`}
            icon={SpeedIcon}
            color="#7c3aed"
            trend={stats.storageUsed < 80 ? "Within limits" : "Consider upgrade"}
          />
        </Grid>
      </Grid>

      {/* Quick Actions Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate('/upload')}
            >
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  borderRadius: 3,
                  p: 2,
                  display: 'inline-flex',
                  mb: 2,
                }}
              >
                <CloudUploadIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Upload Data
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Import CSV, JSON, or Excel files to start creating visualizations
              </Typography>
              <Button 
                variant="outlined" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/upload')}
              >
                Get Started
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate('/charts/new')}
            >
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  borderRadius: 3,
                  p: 2,
                  display: 'inline-flex',
                  mb: 2,
                }}
              >
                <InsertChartIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Create Charts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Build interactive charts and dashboards from your data
              </Typography>
              <Button 
                variant="outlined" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/charts/new')}
              >
                Build Now
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  borderRadius: 3,
                  p: 2,
                  display: 'inline-flex',
                  mb: 2,
                }}
              >
                <AssessmentIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View detailed analytics and insights from your data
              </Typography>
              <Button 
                variant="outlined" 
                endIcon={<ArrowForwardIcon />}
              >
                Explore
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Recent Activity Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Files */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  Recent Files
                </Typography>
                <Button 
                  component={Link} 
                  to="/files" 
                  variant="text" 
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              </Box>
              <Stack spacing={2}>
                {recentFiles.slice(0, 4).map((file) => (
                  <Paper 
                    key={file.id} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: 2 },
                    }}
                  >
                    <Box 
                      sx={{ 
                        background: 'linear-gradient(135deg, #2563eb20 0%, #2563eb10 100%)',
                        borderRadius: 2,
                        p: 1,
                        mr: 2,
                      }}
                    >
                      <FileTextIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {file.size} • {file.uploadedAt}
                      </Typography>
                    </Box>
                    <Chip 
                      label={file.status} 
                      size="small" 
                      color={file.status === 'processed' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Charts */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  Recent Charts
                </Typography>
                <Button 
                  component={Link} 
                  to="/charts/new" 
                  variant="text" 
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  Create New
                </Button>
              </Box>
              <Stack spacing={2}>
                {recentCharts.map((chart) => (
                  <Paper 
                    key={chart.id} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: 2 },
                    }}
                  >
                    <Box 
                      sx={{ 
                        background: 'linear-gradient(135deg, #10b98120 0%, #10b98110 100%)',
                        borderRadius: 2,
                        p: 1,
                        mr: 2,
                      }}
                    >
                      <InsertChartIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {chart.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {chart.type} • {chart.views} views
                      </Typography>
                    </Box>
                    <Chip 
                      label={chart.status} 
                      size="small" 
                      color={chart.status === 'published' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Timeline */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', mb: 3, fontWeight: 600 }}>
            <ActivityIcon sx={{ mr: 1 }} />
            Recent Activity
          </Typography>
          <Stack spacing={2}>
            {recentActivity.map((activity) => (
              <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    background: activity.type === 'upload' ? '#2563eb20' : 
                               activity.type === 'chart' ? '#10b98120' : 
                               activity.type === 'process' ? '#f59e0b20' : '#7c3aed20',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                  }}
                >
                  {activity.type === 'upload' && <CloudUploadIcon sx={{ color: '#2563eb', fontSize: 20 }} />}
                  {activity.type === 'chart' && <InsertChartIcon sx={{ color: '#10b981', fontSize: 20 }} />}
                  {activity.type === 'process' && <SpeedIcon sx={{ color: '#f59e0b', fontSize: 20 }} />}
                  {activity.type === 'share' && <EyeIcon sx={{ color: '#7c3aed', fontSize: 20 }} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {activity.action}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.item} • {activity.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
