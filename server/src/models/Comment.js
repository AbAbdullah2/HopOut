import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SectionSchema = new mongoose.Schema(
  {
    event: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
      },
    
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

const CommentSection = mongoose.model('CommentSection', CommentSectionSchema);

export default CommentSection;
