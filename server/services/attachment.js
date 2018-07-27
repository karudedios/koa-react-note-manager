export default class AttachmentService {
  constructor(Model) {
    Object.defineProperty(this, 'Model', { value: Model });
  }
  
  async create(data = {}) {
    const model = await this.Model.create(data);
    
    return model.toObject();
  }
  
  async findAll(predicate = {}) {
    const models = await this.Model.find(predicate);
    
    return models.map(m => m.toObject());
  }
  
  async find(predicate = {}) {
    const model = await this.Model.findOne(predicate);
    
    if (!model) return null;
    
    return model.toObject();
  }
  
  async remove(...ids) {
    if (!ids.length) throw new Error("Must provide at least one id to delete");
    
    const { n } = await this.Model.deleteMany({ _id: { $in: ids } });
    
    return n > 0;
  }
}
