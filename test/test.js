'use strict';

var mongoose = require('mongoose');
var should = require('should');
var schema = mongoose.Schema;
var model = mongoose.model.bind(mongoose);
var slug = require('..');
var to = require('./db');

// Defining models
    
var artistSchema = schema({ title: String, baz: String }).plugin(slug());
var Artist = model('Artist', artistSchema);

var thingSchema = schema({ title: String, baz: String }).plugin(slug());
var Thing = model('Thing', thingSchema);

var personSchema = schema({ name: String, occupation: String }).plugin(slug(['name', 'occupation']));
var Person = model('Person', personSchema);

var uniqueSchema = schema({title: String, foo: String}).plugin(slug(null,{unique: true}));
var Unique = model('Unique', uniqueSchema);

var uniqueCustomSchema = schema({foo: String, bar: String}).plugin(slug(['foo','bar'],{unique: true}));
var uniqueCustom = model('UniqueCustom', uniqueCustomSchema);

describe('mongoose-slug', function(){

  before(function(done){
    mongoose.connect(to);

    // TODO 
    // refactor this cleaning
    
    model('Artist').remove({}, function(){
        model('Thing').remove({}, function(){
            model('Person').remove({}, function(){
                model('Unique').remove({}, function(){
                    model('UniqueCustom').remove({}, function(){
                        done(); 
                    });
                });
            });
        });
    });
  });

  it('should create the slug with default source property(title)', function(done){
  
    new Artist({ title: 'some artist'})
    .save(function(err, doc){
      if (err) return done(err);
      doc.title.should.eql('some artist');
      doc.slug.should.eql('some-artist');
      done();
    });
  });

  it('should create the slug with utf8 converted into latin chars', function(done){
  
    new Thing({ title: 'Schöner Titel läßt grüßen!? Bel été !'})
    .save(function(err, doc){
      if (err) return done(err);
      doc.title.should.eql('Schöner Titel läßt grüßen!? Bel été !');
      doc.slug.should.eql('schoener-titel-laesst-gruessen-bel-ete');
      done();
    });
  });

  it('should create the slug with multiple source property', function(done){
  
    new Person({ name: 'John Doe', occupation: 'Scam Artist'})
    .save(function(err, doc){
      if (err) return done(err);
      doc.name.should.eql('John Doe');
      doc.occupation.should.eql('Scam Artist');
      doc.slug.should.eql('john-doe-scam-artist');
      done();
    });
  });

  it('should create a unique slug', function(done){

    new Unique({title: 'Test Title'})
    .save(function(err, doc){
        doc.slug.should.eql('test-title');

        new Unique({title: 'Test Title'})
        .save(function(err, unique){
            if(err){
                console.log(err);
            } 
            unique.slug.should.eql('test-title-2');
            done();
        });

    });
  });

  it('should create a unique slug from custom field', function(done){

    new uniqueCustom({foo: 'Foo', bar: 'Bar'})
    .save(function(err, doc){
        if(err){
            console.log(err);
        } 
        doc.slug.should.eql('foo-bar');

        new uniqueCustom({foo: 'Foo', bar: 'Bar'})
        .save(function(err, unique){
            if(err){
                console.log(err);
            } 
            unique.slug.should.eql('foo-bar-2');
            done();
        });

    });
  });
});
