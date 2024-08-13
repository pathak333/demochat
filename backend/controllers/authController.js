const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, 'jwt_secret', { expiresIn: '1h' });
  res.json({ token });
};

exports.logout = (req, res) => {
  // Handle logout logic, e.g., blacklisting the token
  res.json({ message: 'Logged out' });
};
