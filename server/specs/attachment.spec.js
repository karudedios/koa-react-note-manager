import chai from 'chai';
import mongooseMockFactory from './mocks/mongoose';
import chaiAsPromised from 'chai-as-promised';
import { AttachmentService } from '../services';
import { Types } from 'mongoose';

chai.use(chaiAsPromised);

chai.should();

describe("Attachment Service", function() {
  let service;
  
  before(function(done) {
    mongooseMockFactory.setUp(function(err) {
      if (err) return done(err);
      
      const Model = require('../models/attachment').default;
      
      service = new AttachmentService(Model);
      
      done();
    });
  });
  
  afterEach(function(done) {
    mongooseMockFactory.reset(done);
  });
  
  after(function(done) {
    mongooseMockFactory.tearDown(done);
  });
  
  describe('.create', function() {
    it("should create attachments so long as there's a noteId associated", function() {
      const noteOid = Types.ObjectId();
      
      return service.create({
        note: noteOid,
        url: '/file.ext',
      }).should.be.fulfilled.and.eventually.have.property('note').deep.equal(noteOid);
    });
    
    it("should fail if no note is provided", function() {
      return service.create({
        url: '/file.ext'
      }).should.be.rejected.and.eventually.have.property('errors').have.property('note');
    });
    
    it("should fail if no url is provided", function() {
      return service.create({
        note: Types.ObjectId()
      }).should.be.rejected.and.eventually.have.property('errors').have.property('url');
    });
  });
  
  describe(".findAll", function() {
    let attachments;
    
    beforeEach(function(done) {
      let oid = Types.ObjectId();
      
      Promise.all([
        service.create({ note: oid, url: '/1.ext' }),
        service.create({ note: oid, url: '/2.ext' }),
        service.create({ note: Types.ObjectId(), url: '/3.ext' }),
        service.create({ note: Types.ObjectId(), url: '/4.ext' })
      ]).then(function(results) {
        attachments = results;
        done();
      }).catch(done);
    });
    
    it("should find all note-associated attachments if { note } is provided", function() {
      const expected = attachments.filter(att => att.note.equals(attachments[0].note));
      
      return service.findAll({
        note: attachments[0].note
      }).should.be.fulfilled.and.eventually.have.a.lengthOf(2).and.deep.equal(expected);
    });
    
    it("should fetch all attachments if no predicate is provided", function() {
      return service.findAll().should.be.fulfilled.and.eventually.have.a.lengthOf(4).and.deep.include.all.members(attachments);
    });
    
    it("should return an empty array if nothing is found with the provided predicate", function() {
      return service.findAll({
        note: Types.ObjectId()
      }).should.be.fulfilled.and.eventually.have.a.lengthOf(0).and.deep.equal([]);
    });
  });
  
  describe('.find', function() {
    let attachments;
    
    beforeEach(function(done) {
      Promise.all([
        service.create({ note: Types.ObjectId(), url: '/1.ext' }),
        service.create({ note: Types.ObjectId(), url: '/1.ext' }),
      ]).then(atts => {
        attachments = atts;
        done();
      }).catch(done);
    });
    
    afterEach(function(done) {
      mongooseMockFactory.clearCollection('attachments', done);
    });
    
    it("should return first occurence matching predicate", function() {
      return service.find({
        url: '/1.ext'
      }).should.be.fulfilled.and.eventually.deep.equal(attachments[0]);
    });
    
    it("should return `null` if nothing is found from the given predicate", function() {
      return service.find({
        note: Types.ObjectId()
      }).should.be.fulfilled.and.eventually.equal(null);
    });
  });
  
  describe('.remove', function() {
    let attachments;
    
    beforeEach(function(done) {
      Promise.all([
        service.create({ note: Types.ObjectId(), url: '/1.ext' }),
        service.create({ note: Types.ObjectId(), url: '/1.ext' }),
      ]).then(atts => {
        attachments = atts;
        done();
      }).catch(done);
    });
    
    it('should remove attachment if any stored attachment matches predicate', function() {
      return service.remove(attachments[0]._id).should.be.fulfilled.and.eventually.equal(true).then(function() {
        return service.find(attachments[0]._id).should.be.fulfilled.and.eventually.equal(null);
      });
    });
    
    it('should remove multiple attachments if the id of all was provided', function() {
      return service.remove(...attachments.map(a => a._id)).should.be.fulfilled.and.eventually.equal(true).then(function() {
        return service.findAll().should.be.fulfilled.and.eventually.have.lengthOf(0);
      });
    });
    
    it('should return false if there was nothing to delete', function() {
      return service.remove(Types.ObjectId()).should.be.fulfilled.and.eventually.equal(false);
    });
    
    it('should throw an error if no nothing is provided', function() {
      return service.remove().should.be.rejected.and.eventually.have.property('message').equal("Must provide at least one id to delete");
    });
  });
});
