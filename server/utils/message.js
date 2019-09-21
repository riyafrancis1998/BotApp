var moment = require('moment');

var generateMessage = (from,image,text) => {
  return {
    from,
    image,
    text,
    createdAt: moment().valueOf()
  };
};

var generateLocationMessage = (from,image,latitude,longitude) => {
  return {
    from,
    image,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

var generateFileMessage = (from, image,file,fileName) => {
  return {
    from,
    image,
    file, 
    fileName,
    createdAt: moment().valueOf()
  };
};
module.exports = {generateMessage, generateLocationMessage,generateFileMessage};
