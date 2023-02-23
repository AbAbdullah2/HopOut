import mongoose from 'mongoose';
import User from './User';

const EventSchema = new mongoose.Schema(
  {
    event: {
      name: {
        type: String,
        required: true,
      },
      start: {
        type: Date,
        required: true,
        unique: true,
      },
      end: {
        type: Date,
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
      visibility: {
        type: String,
        enum: ["public", "private"],
        required: true,
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: Array,
    categories: Array, //consider making categories an enum type with certain catgeory options (including an 'other' option)
    invitees: Array,
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', EventSchema);

export default Event;
