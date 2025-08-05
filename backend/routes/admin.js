const express = require('express');
const router = express.Router();
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const UserSession = require('../models/UserSession');
const auth = require('../middleware/auth');

// Middleware to check admin role
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/users
// @desc    Get all users with registration info
// @access  Admin only
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}, {
      password: 0 // Exclude password field
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/admin/login-logs
// @desc    Get login logs with filtering
// @access  Admin only
router.get('/login-logs', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'success' or 'failed'
    const email = req.query.email;

    // Build filter
    let filter = {};
    if (status) filter.loginStatus = status;
    if (email) filter.email = { $regex: email, $options: 'i' };

    const logs = await LoginLog.find(filter)
      .populate('userId', 'username email')
      .sort({ loginTime: -1 })
      .skip(skip)
      .limit(limit);

    const totalLogs = await LoginLog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalLogs / limit),
          totalLogs,
          hasNext: page < Math.ceil(totalLogs / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin login logs fetch error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/admin/active-sessions
// @desc    Get active user sessions
// @access  Admin only
router.get('/active-sessions', auth, adminAuth, async (req, res) => {
  try {
    const sessions = await UserSession.find({ isActive: true })
      .populate('userId', 'username email')
      .sort({ lastActivity: -1 });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Admin active sessions fetch error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/admin/stats
// @desc    Get platform statistics
// @access  Admin only
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalLogins = await LoginLog.countDocuments({ loginStatus: 'success' });
    const failedLogins = await LoginLog.countDocuments({ loginStatus: 'failed' });
    const activeSessions = await UserSession.countDocuments({ isActive: true });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Recent logins (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentLogins = await LoginLog.countDocuments({
      loginStatus: 'success',
      loginTime: { $gte: oneDayAgo }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalLogins,
        failedLogins,
        activeSessions,
        recentRegistrations,
        recentLogins,
        loginSuccessRate: totalLogins > 0 ? ((totalLogins / (totalLogins + failedLogins)) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Admin stats fetch error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/admin/users/:id/role
// @desc    Update user role
// @access  Admin only
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Admin user role update error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user (soft delete - deactivate)
// @access  Admin only
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    
    // Deactivate all sessions for this user
    await UserSession.updateMany(
      { userId: req.params.id },
      { isActive: false }
    );

    res.json({
      success: true,
      msg: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin user delete error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
