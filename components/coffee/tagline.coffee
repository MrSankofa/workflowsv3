$ = require 'jquery'

do fill = (item = 'I have created live reloaded. Thank you God') ->
  $('.tagline').append "#{item}"
fill