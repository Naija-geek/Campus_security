const User = require('../models/User');

const register = async (req, res) => {
  const { email, password, role, name, contact } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ email, password, role, name, contact });
    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Replace this with your password check logic
  const isMatch = await user.comparePassword(password); // or bcrypt.compare
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Set session userId
  req.session.userId = user._id;

  res.json({ user });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};

module.exports = { register, login, logout };