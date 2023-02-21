import mongoose from 'mongoose';
import User from './User';

const EventSchema = new mongoose.Schema(
  {
    event: {
      name: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
        unique: true,
      },
      location: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: Array,
    tag: Array,
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', EventSchema);

export default Event;
