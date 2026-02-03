const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ msg: 'Name is required' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ msg: 'Password is required' });
  }

  next();
};

module.exports = { validateRegister, validateLogin };
