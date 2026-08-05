const authService = require('../services/auth.service');
const { validateSignup, validateLogin } = require('../utils/validators');

async function signup(req, res, next) {
  try {
    const errors = validateSignup(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const { token, user } = await authService.signup(req.body);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const { token, user } = await authService.login(req.body);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };