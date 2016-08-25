var $ = require('jquery'),
    backbone = require('backbone'),
    _ = require('underscore'),
    CryptoJS = require('crypto-js');

var publicKey = '241328638ad6321eb015fa420ebb26ec',
    privateKey = 'ef49e3bbefc86b92aad3aa192719a4f50d9a4f92',
    ts = new Date().getTime(),
    hash = CryptoJS.MD5(ts + privateKey + publicKey).toString(),
    characterID = '1009718'; //Wolverine

var charModel = backbone.Model.extend({
  defaults: {
    charImg: '',
    charName: '',
    charDesc: '',
    attrText: ''
  },
  url: 'http://gateway.marvel.com:80/v1/public/characters/' + characterID + '?apikey=' + publicKey
});

var wolverineModel = new charModel();

var characterView = backbone.View.extend({
  el: '#characterWrapper',
  template: _.template($('#characterTemplate').html()),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

var attributionView = backbone.View.extend({
  el: '#attributionWrapper',
  template: _.template($('#attributionTemplate').html()),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
})

var character = new characterView({
  model: wolverineModel
});

var attribution = new attributionView({
  model: wolverineModel
});

//GET request to Marvel API for Wolverine character
wolverineModel.fetch({
  ts: ts,
  hash: hash,
  success: function(model, response) {
    var results = response.data.results[0];
    wolverineModel.set({
      charImg: makeThumbnailPath(results),
      charName: results.name,
      charDesc: results.description
    });
    character.render();
    attribution.render();
  },
  error: function(model, reponse) {
    console.log(response);
  }
});
console.log(wolverineModel);



function characterTemplate() {
  return
}

function getComicCollection(results) {
  var comicURI = results.comics.collectionURI;
  var comicModel = backbone.Model.extend({});

  var comicCollection = backbone.Collection.extend({
    model: comicModel,
    url: comicURI + '?apikey=' + publicKey
  });

  var comicList = new comicCollection();

  //GET request to Marvel API for the comics with Wolverine
  comicList.fetch({
    ts: ts,
    hash: hash,
    success: function(data_array) {
      var data = data_array.models[0].attributes;
      getComics(data);
    }
  });
}

function getComics(results) {
  _.each(results.data.results, function(i) {
    var comicImgPath = makeThumbnailPath(i);

    var html = '<div class="comics">';
        html += '<img src=' + comicImgPath + ' alt=' + i.title + '/>';
        html += '<h2>' + i.title + '</h2>';
        html += '<p>' + i.description + '</p>';
        html += '</div>'

    printHTML(html);
  });
}

function makeThumbnailPath(results) {
  var path = results.thumbnail.path,
      ext = results.thumbnail.extension;

  var charImgPath = path + '.' + ext;
  return charImgPath;
}

function printHTML(html) {
  $('#container').append(html);
}
