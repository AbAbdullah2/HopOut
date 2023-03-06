import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true,
        },
      state: {
        type: String,
        required: true
      },
      zip: {
        type: String,
        required: true
      }
    },
    description: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    categories: [{
      type: String,
    }], //consider making categories an enum type with certain catgeory options (including an 'other' option)
    invitees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    coverId: {
      type: String,
    },
    thumbnailId: {
      type: String
    }
  }
);

const Event = mongoose.model('Event', EventSchema);

export default Event;
