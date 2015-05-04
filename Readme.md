
## mongoose-slug

a simple mongoose plugin that populates `.slug` when the given `prop` is set.

## installation

```bash
$ npm install mongoose-slug
```

## Usage

#### Different field
```js
var slug = require('mongoose-slug');
schema.plugin(slug('name'));
var Song = mongoose.model('Song', schema);

var song = new Song();
song.name = 'frank ab';
song.slug; // > frank-ab
```

#### Multiple Candidated

To use different slug candidates pass them as array

```js
var slug = require('mongoose-slug');
schema.plugin(slug(['firstName', 'lastName']));
var Person = mongoose.model('Person', schema);

var person = new Person({firstName: 'John', lastName: 'Doe'});

person.save(function(err, person) {
person.slug; // > john-doe	
});

````

#### Unique

To create unique slugs add the `unique: true` options to the slug:

```js
var slug = require('mongoose-slug');
schema.plugin(slug(null,{unique: true})
var Song = mongoose.model('Song', schema);

var song = new Song(title : 'Redemption Song');

song.save(function(err, song){
  song.slug; // >redemption-song 
});

var newSong = new Song(title : 'Redemption Song');

newSong.save(function(err, song){
  song.slug; // >redemption-song-2 
});
```
This can be used within the other options

### TODO
- Refactor the tests

## License

MIT
