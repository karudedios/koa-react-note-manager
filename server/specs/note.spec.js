import chai from 'chai';
import mongooseMockFactory from './mocks/mongoose';
import chaiAsPromised from 'chai-as-promised';
import { NoteService } from '../services';
import { Types } from 'mongoose';

chai.use(chaiAsPromised);

chai.should();

describe("Note Service", function() {
  let service;
  
  before(function(done) {
    mongooseMockFactory.setUp(function(err) {
      if (err) return done(err);
      
      const Model = require('../models/note').default;
      
      service = new NoteService(Model);
      
      done();
    });
  });
  
  afterEach(function(done) {
    mongooseMockFactory.reset(done);
  });
  
  after(function(done) {
    mongooseMockFactory.tearDown(done);
  });
  
  describe(".create", function() {
    it("should create notes if the title is provided and no notification info is given", function() {
      return service.create({
        title: "Test"
      }).should.be.fulfilled.and.eventually.have.property('title').equal("Test");
    });
    
    it("should fail to create notes if the title field is missing", function() {
      return service.create({
        body: "This will fail"
      }).should.be.rejected.and.eventually.have.property('errors').have.property('title');
    });
    
    it("should fail to create notes if notifications are enabled and no notification date is provided", function() {
      return service.create({
        title: "Test",
        notificationEnabled: true
      }).should.be.rejected.and.eventually.have.property('errors').have.property('notificationDate');
    });
  });
  
  describe(".findAll", function() {
    let notes;
    
    beforeEach(function(done) {
      Promise.all([
        service.create({ title: "Blah", archived: true }),
        service.create({ title: "Bleh", archived: true }),
        service.create({ title: "Blih" })
      ]).then(function(nts) {
        notes = nts;
        done();
      }).catch(done);
    });
    
    afterEach(function(done) {
      mongooseMockFactory.clearCollection('notes', done);
    });
    
    it("should return all collections if no predicate is given", function() {
      return service.findAll().should.be.fulfilled.and.eventually.have.a.lengthOf(3).and.deep.include.all.members(notes);
    });
    
    it("should filter results according to predicate", function() {
      const expected = notes.filter(n => n.archived);
      
      return service.findAll({
        archived: true
      }).should.be.fulfilled.and.eventually.have.a.lengthOf(2).and.deep.include.all.members(expected);
    });
    
    it("should return an empty array if no items match the predicate", function() {
      return service.findAll({
        notificationDate: Date.now()
      }).should.be.fulfilled.and.eventually.have.a.lengthOf(0).and.deep.equal([]);
    });
  });
  
  describe(".find", function() {
    let notes;
    
    beforeEach(function(done) {
      Promise.all([
        service.create({ title: "1" }),
        service.create({ title: "2", archived: true }),
        service.create({ title: "3", notificationEnabled: true, notificationDate: Date.now() })
      ]).then(function(nts) {
        notes = nts;
        done();
      }).catch(done);
    });
    
    afterEach(function(done) {
      mongooseMockFactory.clearCollection('notes', done);
    });
    
    it("should find a service with matching predicate", function() {
      return service.find({
        title: notes[0].title
      }).should.be.fulfilled.and.eventually.deep.equal(notes[0]);
    });
    
    it("should throw an error if nothing is found from the given predicate", function() {
      return service.find({
        title: "Henlo"
      }).should.be.rejected.and.eventually.have.property('message').equal("No note was found");
    });
  });
  
  describe(".remove", function() {
    let notes;
    
    beforeEach(function(done) {
      Promise.all([
        service.create({ title: "1" }),
        service.create({ title: "1", archived: true }),
        service.create({ title: "1", notificationEnabled: true, notificationDate: Date.now() })
      ]).then(function(nts) {
        notes = nts;
        done();
      }).catch(done);
    });
    
    afterEach(function(done) {
      mongooseMockFactory.clearCollection('notes', done);
    });
    
    it("should remove a single note matching the id", function() {
      const _id = notes[0]._id;
      
      return service.remove(_id).should.be.fulfilled.and.become(true).then(function() {
        return service.find({
          _id
        }).should.be.rejected;
      });
    });
    
    it("should be able to remove multiple notes on a single call", function() {
      const ids = notes.map(n => n._id).slice(0, 2);
      
      return service.remove(...ids).should.be.fulfilled.and.become(true).then(function() {
        return service.findAll({
          _id: { $in: ids }
        }).should.be.fulfilled.and.eventually.have.a.lengthOf(0);
      });
    });
    
    it("should return false if there was nothing to remove", function() {
      return service.remove(Types.ObjectId()).should.be.fulfilled.and.become(false);
    });
  });
  
  describe(".update", function() {
    let notes;
    
    beforeEach(function(done) {
      Promise.all([
        service.create({ title: "1" }),
        service.create({ title: "2", archived: true }),
        service.create({ title: "3", notificationEnabled: true, notificationDate: Date.now() })
      ]).then(function(nts) {
        notes = nts;
        done();
      }).catch(done);
    });
    
    afterEach(function(done) {
      mongooseMockFactory.clearCollection('notes', done);
    });
    
    it("should update a note if a valid id and changes is provided", function() {
      return service.update(notes[0]._id, {
        title: "1-2"
      }).should.be.fulfilled.and.then(function() {
        return service.find({
          _id: notes[0]._id
        }).should.be.fulfilled.and.eventually.have.property('title').equal('1-2');
      });
    });
    
    it("should fail if no note is found with provided id", function (){
      return service.update(Types.ObjectId(), {
        title: "???"
      }).should.be.rejected.and.eventually.have.property('message').equal("No note was found");
    });
  });
});
