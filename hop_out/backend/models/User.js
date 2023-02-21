import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
})

UserSchema.path('email').validate((input) => {
  try {
    z.string().email().parse(input);
    return true;
  } catch (err) {
    return false;
  }
}, 'Invalid Email');


const User = mongoose.model("User", UserSchema);

export default User;