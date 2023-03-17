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
  },
  organizing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  ],
  // account for attending vs attended (past vs future) later
  attending: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  ],
  invited: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  ],
  friends: [
    {    
      user: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      date: 
      {
        type: Date,
      }
    }
  ],
  sentFriends: [
    {    
      user: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      date: 
      {
        type: Date,
      }
    }],
    // ({
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    // {
    //   type: Date,
    // })
    // {    
    //   user: 
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    //   },
    //   date: 
    //   {
    //     type: Date,
    //   }
    // }],
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  //],
  receivedFriends: [
  {    
    user: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: 
    {
      type: Date,
    }
  }],
});

const User = mongoose.model('User', UserSchema);

export default User;
