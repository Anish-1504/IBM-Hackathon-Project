const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
  async register(req, res) {
    try {
      const { email, username, password, fullName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'User with this email or username already exists'
        });
      }

      // Hash password
      const passwordHash = await User.hashPassword(password);

      // Create user
      const user = await User.create({
        email,
        username,
        passwordHash,
        fullName
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: user.toJSON(),
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Validate password
      const isValid = await user.validatePassword(password);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ error: 'Account is disabled' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: user.toJSON(),
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user.toJSON());
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  async updateProfile(req, res) {
    try {
      const { fullName, githubToken } = req.body;
      const user = await User.findByPk(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update fields
      if (fullName !== undefined) user.fullName = fullName;
      if (githubToken !== undefined) user.githubToken = githubToken;

      await user.save();

      res.json(user.toJSON());
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
}

module.exports = new AuthController();

// Made with Bob