'use strict';
/**
 * deps
 */

var slug = require('speakingurl');

/**
 * slug plugin.
 *
 * Usage:
 *
 *      mySchema.plugin(slug('title'));
 *
 * Options:
 *
 *      - `.replace` characters to replace defaulted to `[^a-zA-Z]`
 *      - `.separator` separator to use, defaulted to `-`
 *      - `required` whether a slug is required, defaults to `true`
 *      - `unique` whether the slug should be unique, defaults to `false`
 *
 * @param {String} prop
 * @param {Object} options
 * @return {Function}
 */

module.exports = function(prop, opts){
  return function slugize(schema){

    var unique = (opts && opts.unique) ? true : false;

    var title;
    schema.add({
      slug: {
        type: 'String',
        unique: (opts && opts.unique) ? true : false
      }
    });

    if (opts && opts.track) {
      schema.add({ slugs: [ String ] });
    }

    schema.pre('save', function(next){
      var self = this;

      if (prop && Array.isArray(prop)) {
        var titles = [];
        prop.forEach(function(el){
          titles.push(self[el]);
        });
        title = titles.join(' ');
      } else {
        title = this[prop || 'title'];
      }

      var require = (opts && opts.required === false) ? false : true;

      if (require && !title) {
        return next(new Error(prop + ' is required to create a slug'));
      }

      var mySlug = slug(title, opts);
      var isChanged = self.isNew || (self.slug !== mySlug);

      if(!isChanged){
        return next();
      }

      if (opts && opts.track && self.slugs && self.slugs.indexOf( mySlug) === -1){
          self.slugs.push( mySlug );
      }

      if (title && !self.slug){
        self.slug = mySlug;
      }
    
      if(unique){
      
        this.constructor.count({slug: self.slug}, function(err, number){
            if(number >= 1 && self.isNew){
               self.slug = self.slug + '-' + number; 
            }
            next();
        });
      }
      else{
        next();
      }

    });
  };
};
