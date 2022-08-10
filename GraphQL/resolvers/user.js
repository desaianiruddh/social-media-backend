const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
    SECRET_KEY,
    { expiresIn: '10d' }
  );
};

module.exports = {
  Mutation: {
    register: async (
      parent,
      { registerInput: { userName, password, email, confirmPassword } }
    ) => {
      //validate all inputs
      const { errors, valid } = validateRegisterInput(
        userName,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //if user name is already taken
      const existUserName = await User.findOne({ userName });
      const existUserEmail = await User.findOne({ email });
      if (existUserName) {
        throw new UserInputError('Username is already taken', {
          errors: {
            userName: 'This username is taken',
          },
        });
      }
      if (existUserEmail) {
        throw new UserInputError('Email is already registered', {
          errors: {
            email: 'This Email is alredy registered',
          },
        });
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        userName,
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    login: async (parent, { userName, password }) => {
      const { errors, valid } = validateLoginInput(userName, password);
      if (!valid) {
        throw new UserInputError('Wrong Credentials', { errors });
      }
      const user = await User.findOne({ userName });
      if (!user) {
        errors.general = 'User Not Found';
        throw new UserInputError('User Not Found', { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong Credentials';
        throw new UserInputError('Wrong Credentials', { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
