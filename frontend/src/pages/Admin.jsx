import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Pagination,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const Admin = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({});
  const [usersPage, setUsersPage] = useState(1);

  // Login logs state
  const [loginLogs, setLoginLogs] = useState([]);
  const [logsPagination, setLogsPagination] = useState({});
  const [logsPage, setLogsPage] = useState(1);
  const [logsFilter, setLogsFilter] = useState({ status: '', email: '' });

  // Sessions state
  const [activeSessions, setActiveSessions] = useState([]);

  // Statistics state
  const [stats, setStats] = useState({});

  // Dialog states
  const [editUserDialog, setEditUserDialog] = useState({ open: false, user: null });
  const [deleteUserDialog, setDeleteUserDialog] = useState({ open: false, user: null });

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    
    loadData();
  }, [isAdmin, activeTab, usersPage, logsPage, logsFilter]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (activeTab === 0) {
        // Load users and stats
        const [usersResult, statsResult] = await Promise.all([
          adminService.getUsers(usersPage, 10),
          adminService.getStats()
        ]);
        
        if (usersResult.success) {
          setUsers(usersResult.data.users);
          setUsersPagination(usersResult.data.pagination);
        }
        
        if (statsResult.success) {
          setStats(statsResult.data);
        }
      } else if (activeTab === 1) {
        // Load login logs
        const logsResult = await adminService.getLoginLogs(
          logsPage, 20, logsFilter.status, logsFilter.email
        );
        
        if (logsResult.success) {
          setLoginLogs(logsResult.data.logs);
          setLogsPagination(logsResult.data.pagination);
        }
      } else if (activeTab === 2) {
        // Load active sessions
        const sessionsResult = await adminService.getActiveSessions();
        
        if (sessionsResult.success) {
          setActiveSessions(sessionsResult.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      const result = await adminService.updateUserRole(userId, newRole);
      
      if (result.success) {
        setSuccess('User role updated successfully');
        loadData();
        setEditUserDialog({ open: false, user: null });
      }
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const result = await adminService.deleteUser(userId);
      
      if (result.success) {
        setSuccess('User deleted successfully');
        loadData();
        setDeleteUserDialog({ open: false, user: null });
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'success' : 'error';
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      {activeTab === 0 && stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalUsers || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Logins
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalLogins || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ErrorIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Failed Logins
                    </Typography>
                    <Typography variant="h4">
                      {stats.failedLogins || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Success Rate
                    </Typography>
                    <Typography variant="h4">
                      {stats.loginSuccessRate || 0}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Users" icon={<PeopleIcon />} />
          <Tab label="Login Logs" icon={<SecurityIcon />} />
          <Tab label="Active Sessions" icon={<ScheduleIcon />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Users Tab */}
          {activeTab === 0 && !loading && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'between', mb: 2 }}>
                <Typography variant="h6">User Management</Typography>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={loadData}
                  variant="outlined"
                >
                  Refresh
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={user.role === 'admin' ? 'secondary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit Role">
                            <IconButton
                              onClick={() => setEditUserDialog({ open: true, user })}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          {user._id !== currentUser?.id && (
                            <Tooltip title="Delete User">
                              <IconButton
                                onClick={() => setDeleteUserDialog({ open: true, user })}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {usersPagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={usersPagination.totalPages}
                    page={usersPage}
                    onChange={(e, page) => setUsersPage(page)}
                  />
                </Box>
              )}
            </>
          )}

          {/* Login Logs Tab */}
          {activeTab === 1 && !loading && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'between', mb: 2 }}>
                <Typography variant="h6">Login Logs</Typography>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={logsFilter.status}
                      label="Status"
                      onChange={(e) => setLogsFilter({ ...logsFilter, status: e.target.value })}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="success">Success</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    label="Email"
                    value={logsFilter.email}
                    onChange={(e) => setLogsFilter({ ...logsFilter, email: e.target.value })}
                  />
                  <Button startIcon={<RefreshIcon />} onClick={loadData} variant="outlined">
                    Refresh
                  </Button>
                </Stack>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Login Time</TableCell>
                      <TableCell>Failure Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loginLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell>{log.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.loginStatus}
                            color={getStatusColor(log.loginStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>{formatDate(log.loginTime)}</TableCell>
                        <TableCell>{log.failureReason || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {logsPagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={logsPagination.totalPages}
                    page={logsPage}
                    onChange={(e, page) => setLogsPage(page)}
                  />
                </Box>
              )}
            </>
          )}

          {/* Active Sessions Tab */}
          {activeTab === 2 && !loading && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'between', mb: 2 }}>
                <Typography variant="h6">Active Sessions</Typography>
                <Button startIcon={<RefreshIcon />} onClick={loadData} variant="outlined">
                  Refresh
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Last Activity</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session._id}>
                        <TableCell>
                          {session.userId?.username || 'Unknown'}
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            {session.userId?.email}
                          </Typography>
                        </TableCell>
                        <TableCell>{session.ipAddress}</TableCell>
                        <TableCell>{formatDate(session.createdAt)}</TableCell>
                        <TableCell>{formatDate(session.lastActivity)}</TableCell>
                        <TableCell>
                          <Chip
                            label={session.isActive ? 'Active' : 'Inactive'}
                            color={session.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Paper>

      {/* Edit User Role Dialog */}
      <Dialog open={editUserDialog.open} onClose={() => setEditUserDialog({ open: false, user: null })}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Update role for {editUserDialog.user?.username}
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={editUserDialog.user?.role || 'user'}
              label="Role"
              onChange={(e) => setEditUserDialog({
                ...editUserDialog,
                user: { ...editUserDialog.user, role: e.target.value }
              })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateUserRole(editUserDialog.user._id, editUserDialog.user.role)}
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialog.open} onClose={() => setDeleteUserDialog({ open: false, user: null })}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteUserDialog.user?.username}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteUser(deleteUserDialog.user._id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;