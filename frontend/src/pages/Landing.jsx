import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  CloudUpload as UploadIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      title: 'Multi-Format Upload',
      description: 'Upload Excel files (.xlsx, .xls) and PDF documents for instant data extraction and visualization.',
      color: 'primary'
    },
    {
      icon: <PdfIcon sx={{ fontSize: 40 }} />,
      title: 'Smart PDF Processing',
      description: 'AI-powered PDF data extraction that identifies tables, numbers, dates, and suggests optimal chart types.',
      color: 'secondary'
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      title: 'Interactive Charts',
      description: 'Create beautiful, interactive charts and dashboards with drag-and-drop simplicity.',
      color: 'success'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Enterprise Security',
      description: 'Advanced user management, role-based access, and comprehensive audit trails.',
      color: 'error'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Analytics',
      description: 'Monitor platform usage, user activity, and system performance with detailed analytics.',
      color: 'info'
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      title: 'Admin Dashboard',
      description: 'Comprehensive admin panel for user management, login monitoring, and system administration.',
      color: 'warning'
    }
  ];

  const benefits = [
    'Upload Excel and PDF files instantly',
    'AI-powered data extraction from PDFs',
    'Create interactive charts and visualizations',
    'Secure user authentication and sessions',
    'Real-time collaboration and sharing',
    'Enterprise-grade admin controls',
    'Comprehensive audit trails',
    'Mobile-responsive design'
  ];

  const stats = [
    { label: 'File Formats Supported', value: '5+', icon: <ExcelIcon /> },
    { label: 'Chart Types Available', value: '10+', icon: <BarChartIcon /> },
    { label: 'Enterprise Features', value: '20+', icon: <AssessmentIcon /> },
    { label: 'Security Controls', value: '15+', icon: <SecurityIcon /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'text.primary' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AnalyticsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              DataViz Pro
            </Typography>
          </Box>

        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Transform Your Data Into Insights
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              paragraph 
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Upload Excel files and PDFs to create stunning visualizations. 
              Our AI-powered platform extracts data intelligently and suggests 
              the perfect charts for your needs.
            </Typography>
            
            <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  py: 2, 
                  px: 4, 
                  borderRadius: 3,
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6 }
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ py: 2, px: 4, borderRadius: 3 }}
              >
                Sign In
              </Button>
            </Stack>

            <Stack direction="row" spacing={4}>
              {stats.map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    {stat.icon}
                    <Typography variant="h4" sx={{ ml: 1, fontWeight: 'bold', color: 'primary.main' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={8} 
              sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🚀 Platform Demo
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Experience the power of intelligent data visualization
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <UploadIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Smart File Upload</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Drag & drop Excel or PDF files
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                      <InsightsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">AI Data Extraction</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Automatic table and pattern recognition
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Interactive Charts</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Beautiful visualizations in seconds
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
              
              {/* Decorative elements */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -20, 
                  right: -20, 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  opacity: 0.1 
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -30, 
                  left: -30, 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'secondary.main', 
                  opacity: 0.1 
                }} 
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom 
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Powerful Features
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Everything you need to transform raw data into actionable insights
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-8px)', 
                      boxShadow: 6 
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${feature.color}.main`, 
                          width: 80, 
                          height: 80, 
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ fontWeight: 'bold' }}
            >
              Why Choose DataViz Pro?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              paragraph 
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Join thousands of professionals who trust our platform for their data visualization needs.
            </Typography>
            
            <List>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={benefit}
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Paper 
                elevation={4}
                sx={{ 
                  p: 6, 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Ready to Get Started?
                </Typography>
                <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
                  Create your account today and start visualizing your data in minutes.
                </Typography>
                <Typography variant="h6" sx={{ opacity: 1, fontWeight: 'bold', color: 'white', mb: 3 }}>
                  ✨ Completely FREE to sign up and get started!
                </Typography>
                
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'primary.main',
                      py: 2, 
                      px: 4,
                      borderRadius: 3,
                      fontWeight: 'bold',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    Sign Up FREE
                    <Chip 
                      label="FREE" 
                      size="small" 
                      sx={{ 
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'success.main',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 18
                      }} 
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      borderColor: 'white', 
                      color: 'white',
                      py: 2, 
                      px: 4,
                      borderRadius: 3,
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Sign In FREE
                  </Button>
                </Stack>
                
                {/* Decorative elements */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -50, 
                    right: -50, 
                    width: 150, 
                    height: 150, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.1)' 
                  }} 
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: -30, 
                    left: -30, 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.1)' 
                  }} 
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  DataViz Pro
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 400 }}>
                Transform your data into beautiful, interactive visualizations with our 
                AI-powered platform. Upload Excel files and PDFs to get started instantly.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact & Support
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Need help? Have questions? We're here to support you.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: support@datavizpro.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Documentation: Available in your dashboard
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2024 DataViz Pro. All rights reserved. Built with Material-UI and React.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
