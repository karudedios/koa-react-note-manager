import { Router } from 'express';
import buildNoteEndpoints from './note';

export default function(Services, Models) {
  const noteService = new Services.NoteService(Models.Note);
  const attachmentService = new Services.AttachmentService(Models.Attachment);
  
  return new Router()
    .use('/notes', buildNoteEndpoints(noteService, attachmentService));
}
