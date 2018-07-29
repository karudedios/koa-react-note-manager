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
  
  archived: {
    required: false,
    default: false,
    type: Boolean,
  },
  
  notificationEnabled: {
    required: false,
    default: false,
    type: Boolean,
  },
  
  notificationDate: {
    required() {
      return this.notificationEnabled;
    },
    type: Date,
  },
  
  attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }]
});

export default mongoose.model('Note', NoteSchema);
