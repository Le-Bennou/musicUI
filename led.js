var led =function(options){
    var ledBack = $('<div class="mUI_led"></div>');
    ledBack.css({'width':options.size,'height':options.size});
    ledBack.css({'left':options.left,'top':options.top});
    options.color = options.color || 'lightblue';
    ledBack.append('<div class="mUI_ledLight '+options.color+'"></div>');
    ledBack.control = function(v){
      this.find('.mUI_ledLight').css({'opacity':v});
    };
    return ledBack;
};

var grad = function(options){
  var gradBack = $('<div class="mUI_graduation"></div>');
  options.size = options.size || 12;
  options.angle = options.angle%360 || 0;
  gradBack.append('<span class="mUI_gradline" ><span class="mUI_gradtext">'+options.text+'</span></span>');
  gradBack.css({
    'left':options.left,
    'top':options.top
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
