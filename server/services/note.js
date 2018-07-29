import { Types } from 'mongoose';
import { notFound, invalidArguments } from '../utils/errors';

export default class NoteService {
  constructor(Model) {
    Object.defineProperty(this, 'Model', { value: Model });
  }
  
  async create(data = {}) {
    const model = await this.Model.create(data);
    
    return this.find({ _id: model._id });
  }
  
  async findAll(predicate = {}) {
    const models = await this.Model.find(predicate).populate('attachments').exec();
    
    return models.map(m => m.toObject());
  }
  
  async find(predicate = {}) {
    if (predicate._id && !Types.ObjectId.isValid(predicate._id))
      throw invalidArguments("Expected id to be an ObjectId");
    
    const model = await this.Model.findOne(predicate).populate('attachments').exec();
    
    if (!model) throw notFound(`No note was found`);
    
    return model.toObject();
  }
  
  async update(_id, changes = {}) {
    const model = await this.Model.findByIdAndUpdate(_id, changes, { new: true }).populate('attachments').exec();
    
    if (!model) throw notFound(`No note was found`);
    
    return model;
  }
  
  async remove(...ids) {
    if (!ids.length) return false;
    
    const { n } = await this.Model.deleteMany({ _id: { $in: ids }});
    
    return n > 0;
  }
}
