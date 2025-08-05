import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Tabs,
  Tab,
  Badge,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
  AdminPanelSettings as AdminIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.username || currentUser?.name || '',
    email: currentUser?.email || '',
    company: currentUser?.company || '',
    role: currentUser?.role || 'user',
    bio: currentUser?.bio || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: isDarkMode,
    twoFactorAuth: false
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (name) => (event) => {
    const checked = event.target.checked;
    
    if (name === 'darkMode') {
      // Update the global theme context
      toggleTheme();
    }
    
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.name.trim() === '') {
      setError('Name is required');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call updateProfile here
      // await updateProfile(formData);
      
      setMessage('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <AdminIcon /> : <PersonIcon />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      {/* Alert Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        width: 32,
                        height: 32
                      }}
                      onClick={() => setAvatarDialogOpen(true)}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {formData.name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </Badge>
                <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                      {formData.name || 'User Name'}
                    </Typography>
                    {currentUser?.role === 'admin' && (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Verified Admin"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {formData.email}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={getRoleIcon(formData.role)}
                      label={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      color={getRoleColor(formData.role)}
                      size="small"
                    />
                    {formData.company && (
                      <Chip
                        icon={<BusinessIcon />}
                        label={formData.company}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
                <Box>
                  {!editing ? (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setEditing(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: currentUser?.username || currentUser?.name || '',
                            email: currentUser?.email || '',
                            company: currentUser?.company || '',
                            role: currentUser?.role || 'user',
                            bio: currentUser?.bio || '',
                            phone: currentUser?.phone || '',
                            location: currentUser?.location || ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="profile tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<PersonIcon />} label="Personal Info" />
                <Tab icon={<SecurityIcon />} label="Security" />
                <Tab icon={<NotificationsIcon />} label="Notifications" />
                <Tab icon={<SettingsIcon />} label="Preferences" />
              </Tabs>
            </Box>

            {/* Personal Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!editing}
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Change Password"
                    secondary="Update your account password"
                  />
                  <Button variant="outlined" size="small">
                    Change
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <VerifiedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary={preferences.twoFactorAuth ? 'Enabled' : 'Disabled'}
                  />
                  <Switch
                    checked={preferences.twoFactorAuth}
                    onChange={handlePreferenceChange('twoFactorAuth')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Status"
                    secondary="Your account is active and verified"
                  />
                  <Chip label="Active" color="success" size="small" />
                </ListItem>
              </List>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={2}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive email updates about your account"
                  />
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive push notifications in your browser"
                  />
                  <Switch
                    checked={preferences.pushNotifications}
                    onChange={handlePreferenceChange('pushNotifications')}
                  />
                </ListItem>
              </List>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={3}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dark Mode"
                    secondary="Use dark theme for the interface"
                  />
                  <Switch
                    checked={preferences.darkMode}
                    onChange={handlePreferenceChange('darkMode')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Account Information"
                    secondary={`Member since ${currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}`}
                  />
                </ListItem>
              </List>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Profile picture upload functionality will be implemented in a future update.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
