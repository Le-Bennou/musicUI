

var grad = function(options){
  options.size = options.size || 12;
  options.angle = options.angle%360 || 0;

  //calcul de la taille nécessaire à la div grad
  $('body').append('<div id="textTaille"><span class="mUI_gradtext">'+options.text+'</span></div>');


  var textWidth = $('.mUI_gradtext').width();
  var textHeight = $('.mUI_gradtext').height();
  $('#textTaille').remove();

  var lineWidth = Math.abs(options.size*Math.cos(options.angle*Math.PI/180));
  var lineHeight =Math.abs(options.size*Math.sin(options.angle*Math.PI/180));

  var gradWidth = textWidth+lineWidth;
  var gradHeight = (options.angle>180)? lineHeight+textHeight : (lineHeight>textHeight)? lineHeight :textHeight;

  var gradBack = $('<div class="mUI_graduation"></div>');

  gradBack.append('<span class="mUI_gradline" ><span class="mUI_gradtext">'+options.text+'</span></span>');
  gradBack.css({
    'left':options.left,
    'top':options.top,
    'width' : gradWidth,
    'height':gradHeight
  });
  var org ='right bottom';
  var left = 0;
  var trans = '0,0';
  if(options.angle>=0 && options.angle<=90 ||options.angle>270 ){
    left = '100%';
    org = 'left bottom';
  }
  if(options.angle>90 && options.angle<=270){
    left = '100%';
    trans='-100%,-1px';
    org = 'right bottom';
  }
  gradBack.find('.mUI_gradtext').css({
    'transform':'translate('+trans+') rotate(-'+options.angle+'deg)',
    'transform-origin' : org,
    'left' : left
  });
  gradBack.find('.mUI_gradline').css({
    'width':+options.size,
    'transform':'rotate('+options.angle+'deg)'
  });
  return gradBack;
};
