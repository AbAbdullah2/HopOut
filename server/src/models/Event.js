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
    locationName: {
      type: String,
      required: false,
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
    addressLine2: {
      type: String,
      required: false,
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
    capacity: {
      type: Number,
      required: true,
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    reviews: [{
      rating: Number,
      comment: String,
      reviewer: mongoose.Schema.Types.ObjectId
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
