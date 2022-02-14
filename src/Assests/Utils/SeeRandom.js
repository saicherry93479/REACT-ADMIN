var seedrandom = require("seedrandom");

export const SeeRandom = (data) => {
  var fields =
    data.designName +
    data.designDescription +
    data.designPrice +
    data.designCategory +
    data.designPopular;
  var photos = "";

  data.photos.forEach((item) => {
    str += item.imageUrl;
  });
  var video = data.video === null ? "null" : data.video.imageUrl;
  var str = fields + photos + video;

  var rng = seedrandom(str);
  return rng.int32();
};
