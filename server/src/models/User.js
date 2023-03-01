import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // add username later
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
  },
  organizing: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  }],
  // account for attending vs attended (past vs future) later
  attending: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  }],
  invited: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  }]
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