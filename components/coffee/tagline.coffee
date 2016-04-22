$ = require 'jquery'

do fill = (item = 'The most creative minds in Art. Who really cares? really') ->
  $('.tagline').append "#{item}"
fill