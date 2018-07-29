import { Router } from 'express';
import { mapToStatusError } from '../utils/errors';

function respondFromPromise(body) {
  return async (req, res) => {
    const response = await body(req)
      .then(mapResultToResponse)
      .catch(mapErrorToResponse);
      
    res.status(response.status)
       .send(response.content);
  };
}

function mapResultToResponse(data) {
  return { status: 200, content: data };
}

function mapErrorToResponse(error) {
  const status = mapToStatusError(error).match({
    unknown: () => 500,
    notFound: () => 404,
    invalidArguments: () => 400,
  });
  
  return { message: error.message, status };
}

export default function (noteService, attachmentService) {
  return new Router()
    
    .get('/', respondFromPromise(() =>
      noteService.findAll({})))
    
    .get('/upcoming', respondFromPromise(() => {
      const now = new Date();
      const fiveMinutesInThefuture = new Date();
      
      fiveMinutesInThefuture.setMinutes(now.getMinutes() + 5);
      
      return noteService.findAll({
        notificationEnabled: true,
        notificationDate: {
          $gte: now,
          $lte: fiveMinutesInThefuture
        }
      });
    }))
    
    .get('/:id', respondFromPromise(({ params }) =>
      noteService.find({ _id: params.id })))

    .post('/', respondFromPromise(({ body, files }) => {
      return Promise.all(
        Object.keys(files || {}).map(f => {
          const file = files[f];
          const url = `/attachments/${file.name}`;
          return file.mv(url).then(() => {
            return attachmentService.create({ url });
          });
        })).then(attachments => {
          return noteService.create(Object.assign({ attachments }, body));
        });
    }))
    
    .put('/:id', respondFromPromise(({ params, body }) => 
      noteService.update(params.id, body)))
      
    .delete('/:id', respondFromPromise(({ params }) => 
      noteService.remove(params.id)));
}
