import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
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
