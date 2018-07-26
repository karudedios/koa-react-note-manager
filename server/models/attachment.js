import mongoose, { Schema } from 'mongoose';

export const AttachmentSchema = new Schema({
  url: {
    required: true,
    type: String,
  },
});

export default mongoose.model('Attachment', AttachmentSchema);