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

<<<<<<< Updated upstream
=======
/**
 * @typedef Note
 * @property {string}   _id                 - Object Id of the Note
 * @property {string}   title.required      - Title of the Note
 * @property {string}   description         - Description of the Note
 * @property {boolean}  notificationEnabled - Enable Notification
 * @property {string}   notificationDate    - Date and time of notification
 */

/**
 * @typedef Error
 * @property {string} message.required - Error Message
 * @property {integer} status.required - Status Code
 */

/**
 * Get All Notes
 *
 * @route GET /notes
 * @group notes - Notes Operations
 *
 * @returns {[Note.model]} 200    - An array with all user notes
 * @returns {Error.model} default - An Error with the failure message
 */
export const getAll = (noteService) => respondFromPromise(() => {
  return noteService.findAll({});
});

/**
 * Get Upcomming Notes
 *
 * @route GET /notes/upcoming
 * @group notes - Notes Operations
 *
 * @returns {[Note.model]} 200      - An array with all notes with upcomming notifications
 * @returns {Error.model}  default  - An error with the failure message
 */
export const getUpcoming = (noteService) => respondFromPromise(() => {
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
});

/**
 * Get Note by Id
 *
 * @route GET /notes/:id
 * @group notes - Notes Operations
 *
 * @param {string} id.query.required  - Id of the Note
 *
 * @returns {Note.model}  200         - A note matching the provided id
 * @returns {Error.model} default     - An error with the failure message
 */
export const getById = noteService => respondFromPromise(({ params }) => {
  return noteService.find({ _id: params.id });
});

/**
 * Create Note
 *
 * @route POST /notes
 * @group notes - Notes Operations
 * @consumes multipart/form-data
 *
 * @param {string}        title.body.required        - Title of the Note
 * @param {string}        description.body           - Description of the Note
 * @param {boolean}       notificationEnabled.body   - Enable Notifications for Note
 * @param {string}        notificationDate.body      - Date-Time for Notification
 * @param {Array.<file>}  attachments.formData       - Attachments to upload and associate to the Note
 *
 * @returns {Note.model}  200                        - The note that was created
 * @returns {Error.model} default                    - An error with the failure message
 */
export const createNote = (noteService, attachmentService) => {
  return respondFromPromise(({ body, files }) => {
    return Promise.all(
      Object.keys(files || {}).map(f => {
        const file = files[f];
        const url = `${__dirname}/attachments/${file.name}`;
        return file.mv(url).then(() => {
          return attachmentService.create({ url });
        });
      })).then(attachments => {
        return noteService.create(Object.assign({ attachments }, body));
      });
  });
};

/**
 * Update Note by Id
 *
 * @route PUT /notes/:id
 * @group notes - Notes Operations
 *
 * @param {string} id.query.required          - Id of the Note to update
 * @param {string} title.body                 - New title of the Note
 * @param {string} description.body           - New description of the Note
 * @param {boolean} notificationEnabled.body  - Enable Notifications
 * @param {string} notificationDate.body      - Date/Time of Notification
 *
 * @returns {Note.model}  200                 - Modified Notification
 * @returns {Error.model} default             - An error with the failure message
 */
export const updateNote = (noteService) => ({ params, body }) => {
  return noteService.update(params.id, body);
};

/**
 * Remove a Note by Id
 *
 * @route DELETE /notes/:id
 * @group notes - Notes Operations
 *
 * @param {string} id.query.required  - Id of the Note to remove
 *
 * @returns {boolean}     200         - Whether the note was removed or not
 * @returns {Error.model} default     - An error with the failure message
 */
export const deleteNote = (noteService) => ({ params }) => {
  return noteService.remove(params.id);
};


>>>>>>> Stashed changes
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
