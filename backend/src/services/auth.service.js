const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
// like wo jo Ammara Asghar  into AA
function toAvatarInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';
}

function toPublicUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    avatar: toAvatarInitials(userDoc.name),
    joinedAt: userDoc.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };
}

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'Server misconfiguration: JWT_SECRET is not set.');
  }
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

async function signup({ name, email, password }) {
  try {
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists.');
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    let user;
    try {
      user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashed,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new ApiError(409, 'An account with this email already exists.');
      }
      throw err;
    }

    const token = signToken(user._id);
    return { token, user: toPublicUser(user) };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Something went wrong while creating your account.');
  }
}

async function login({ email, password }) {
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = signToken(user._id);
    return { token, user: toPublicUser(user) };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Something went wrong while logging you in.');
  }
}

module.exports = { signup, login, toPublicUser, ApiError };