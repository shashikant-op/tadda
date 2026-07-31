const authService = require('../services/auth.service');
const { registerSchema, loginSchema, updatePasswordSchema } = require('../validators/auth.validator');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const result = await authService.registerUser(req.body);
    res.status(201).json(new ApiResponse(201, 'User registered successfully', result));
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json(new ApiResponse(200, 'User logged in successfully', result));
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, 'User logged out successfully', null));
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, 'Current user fetched successfully', { user: req.user }));
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getMe };
