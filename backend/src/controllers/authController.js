import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_EXPIRES_IN = '24h';

/**
 * Register a new corporate operator profile
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ status: 400, message: 'All fields (name, email, password, role) are required.' });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ status: 400, message: 'Email is already registered.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      role,
      company: company || 'Oceanic Blue Shipping'
    });

    res.status(201).json({
      status: 201,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Authenticate credentials and dispatch a session JWT
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 400, message: 'Email and password are required.' });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(401).json({ status: 401, message: 'Invalid credentials. User not found.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: 'Invalid credentials. Incorrect password.' });
    }

    const secret = process.env.JWT_SECRET || 'vessel-optimization-secret-key-2026';
    const payload = {
      userId: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      status: 200,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve current user profile based on JWT token validation
 */
export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }
    res.status(200).json({
      status: 200,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
}
