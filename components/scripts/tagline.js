var $, fill;

$ = require('jquery');

(fill = function(item) {
  return $('.tagline').append("" + item);
})('I have created live reloaded. Thank you God');

fill;
