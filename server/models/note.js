import mongoose, { Schema } from 'mongoose';

export const NoteSchema = new Schema({
  title: {
    required: [true, "Note title is required"],
    type: String,
  },
  
  description: {
    required: false,
    type: String,
  },
  
  deletedAt: {
    required: false,
    type: Date,
  },
  
  notificationEnabled: {
    required: false,
    default: false,
    type: Boolean,
  },
  
  notificationDate: {
    required() {
      return [this.notificationEnabled, "A notification date is required"];
    },
    type: Date,
  },
  
  attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }]
});

export default mongoose.model('Note', NoteSchema);
