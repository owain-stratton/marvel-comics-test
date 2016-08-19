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
  }
});

var charCollection = backbone.Collection.extend({
  model: charModel,
  url: 'http://gateway.marvel.com:80/v1/public/characters/' + characterID + '?apikey=' + publicKey
});

var character = new charCollection();

//GET request to Marvel API for Wolverine character
character.fetch({
  ts: ts,
  hash: hash,
  success: function(data_array) {
    var data = data_array.models[0].attributes;
    getCharInfo(data);
  }
});

// function createCharObject(charImg, charName, charDesc, attrText) {
//   this.charImg = charImg;
//   this.charName = charName;
//   this.charDesc = charDesc;
//   this.attrText = attrText;
// }

var getCharInfo = function(data){


  var results = data.data.results[0];
  var character = new charModel({
    charImg: makeThumbnailPath(results),
    charName: results.name,
    charDesc: results.description,
    attrText: data.attributionHTML
  })
  // var characterObject = new createCharObject(makeThumbnailPath(results), results.name, results.description, data.attributionHTML);
  //
  // var html = '<div class="attrText">' + characterObject.attrText + '</div>';
  //     html += '<div class="characterWrapper">';
  //     html += '<img class="charImg" src=' + characterObject.charImg + ' alt=' + characterObject.charName + '/>';
  //     html += '<h1>' + characterObject.charName + '</h1>';
  //     html += '<h4>' + characterObject.charDesc + '</h4>';
  //     html += '</div>';
  //     html += '<h4>Comics List:</h4>';
  //
  // printHTML(html);
  getComicCollection(results);
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
