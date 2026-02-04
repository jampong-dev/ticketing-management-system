const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Role = require('../../models/Role');

// Register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register request received:', { name, email });
  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    } 
    
    // Get default user role
    const userRole = await Role.findOne({ where: { name: 'USER' } });
    if (!userRole) return res.status(500).json({ msg: 'Default role not found' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({ name, email, password_hash, role_id: userRole.id });

    res.status(201).json({ msg: 'User registered', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email }, include: { model: Role, as: 'role' } });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role.name }, process.env.JWT_SECRET, { expiresIn: '5m' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {register, login};