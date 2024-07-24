import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          'Password must contain at least one letter and one number'
        );
      }
    },
  },
});

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email: email });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return password === user.password;
};

const User = mongoose.model('User', userSchema);
export default User;