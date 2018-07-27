import mongoose, { Schema } from 'mongoose';

export const AttachmentSchema = new Schema({
  url: {
    required: true,
    type: String,
  },
  
  note: { required:true, type: Schema.Types.ObjectId, ref: "Note" }
});

export default mongoose.model('Attachment', AttachmentSchema);
