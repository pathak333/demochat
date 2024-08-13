const User = require('../models/User');

exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;
  const user = new User({ username, password, role });
  await user.save();
  res.status(201).json(user);
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.username = username || user.username;
  if (password) user.password = password;
  user.role = role || user.role;
  await user.save();
  res.json(user);
};
