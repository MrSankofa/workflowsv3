var $, fill;

$ = require('jquery');

(fill = function(item) {
  return $('.tagline').append("" + item);
})('The most creative minds in Art. Who really cares? really');

fill;
