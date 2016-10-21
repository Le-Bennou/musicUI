//FIXME valeurs par default différente celon les nav.
//FIXME EDGE ,n'affiche pas les grad sur les slider
////TODO grad affihcées en logarythm
//TODO revoir le centrage des boutons
//TODO mieux gérer les tailles, la taille de base doit défnir le côté pour un carré, la hauteur pour du paysage et la largeur pour du portrait....
//FIXME le changement de settigns.size (un peu partout), se répercute sur les suivant.
//FIXME les graduations des range en slide déconnent (led à la place).

(function($){

  var led =function(options){
      var settings = $.extend({
        size : 4
      },options);

      var ledBack = $('<div class="mUI_led"></div>');
      ledBack.css({'width':settings.size,'height':settings.size});
      ledBack.css({'left':settings.left,'top':settings.top});
      settings.color = settings.color || 'lightblue';
      ledBack.append('<div class="mUI_ledLight '+settings.color+'"></div>');
      ledBack.control = function(v){
        this.find('.mUI_ledLight').css({'opacity':v});
      };
      return ledBack;
  };

  $.fn.musicUI = function(options){
    var settings = $.extend({
            // These are the defaults.
            width: '150px',
        }, options );
    return this.each(function(){
      var k = $(this);

      function _createDOM(){
          k.hide();
          k.mUI.wrapper = $('<div class="mUI_wrapper '+k.mUI.class+'"></div>');
          k.mUI.wrapper.css({
            'width' : settings.width,
          })
          k.mUI.button = $('<div class="mUI_button"></div>');
          k.mUI.grad = $('<div class="mUI_grad '+k.mUI.gradClass+'"></div>');
          k.mUI.wrapper.append(k.mUI.button);
          k.mUI.wrapper.append(k.mUI.grad);
          if(k.mUI.text){
            k.mUI.nameDOM = $('<div class="mUI_name">'+k.mUI.text+'</div>');
            k.mUI.wrapper.append(k.mUI.nameDOM);
          }
          k.after(k.mUI.wrapper);
          k.mUI.wrapper.css({'font-size':k.mUI.wrapper.width()/10+'px',
        'height':k.mUI.wrapper.width()*heightProp});
      }

      function _eventListeners(){
        k.bind('change input',k.mUI.update);
        k.mUI.update();
      }

/**** Range */

      function _updateKnob(){
        var angle =-137+(k.val()-k.mUI.min)/(k.mUI.max-k.mUI.min)*270;
        k.mUI.button.css('transform','rotate('+angle+'deg)');
        angle = Math.round((angle+137)/27+1);
        if (k.hasClass('led')){
          var c;
          for (c = 0 ; c<11; c++){
            k.mUI.leds[c].control((k.val()-k.mUI.min)/(k.mUI.max-k.mUI.min)*11-c);
          }
        }
        k.mUI.grad.find('span').each(function(){
          $(this).removeClass('active');
          if(k.val()-k.mUI.min===0){
            return;
          }
          if($(this).attr('data-n')<angle){
            $(this).addClass('active');
          }
        });
      }

      function _updateSlide(){
        var pos =10+ (parseInt(k.val())-k.mUI.min)/(k.mUI.max-k.mUI.min)*80;
        if(k.mUI.orientation){
          k.mUI.button.css('top',100-pos+'%');
        }else{
          k.mUI.button.css('left',pos+'%');
        }
      }

      function _rangeChange(d){
        k.mUI.val += d;
        k.val(k.mUI.val*(k.mUI.max-k.mUI.min)/100+k.mUI.min);
        k.trigger('change');
      }

      function _rangeEventListeners(){
        _eventListeners();
        k.mUI.wrapper.bind(((/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel")+'.k',function(e){
          e.preventDefault();

          var d = -Math.sign(e.originalEvent.deltaY || e.originalEvent.detail)*10;
          _rangeChange(d);
        });
        k.mUI.wrapper.bind('mousedown.k',function(e){
          e.preventDefault();
          k.mUI.pos.y =(k.hasClass('knob'))? e.screenY : (k.mUI.orientation && k.mUI.orientation==='vertical')? e.screenY : -e.screenX;
          k.mUI.d.bind('mousemove.k',function(e){
            var d =(k.hasClass('knob'))? e.screenY : (k.mUI.orientation && k.mUI.orientation==='vertical')? e.screenY : -e.screenX;
              _rangeChange(k.mUI.pos.y-d);
            k.mUI.pos.y = d;
          });
          k.mUI.d.bind('mouseup.k',function(e){
            e.preventDefault();
            k.mUI.d.unbind('mousemove.k');
            k.mUI.d.unbind('mouseup.k');
          });
        });
      }

      function _initRange(){
        heightProp = 1;
        k.mUI.update = (k.hasClass('knob'))? _updateKnob : _updateSlide;
        k.mUI.class = (k.hasClass('knob'))? 'mUI_knob' : 'mUI_slide';
        k.mUI.gradClass = (k.hasClass('led') && k.hasClass('knob'))? 'led' : 'simple';
        k.mUI.min = (k.attr('min'))? parseInt(k.attr('min')) : 0;
        k.mUI.max = (k.attr('max'))? parseInt(k.attr('max')) : 100;
        k.mUI.range = k.mUI.max-k.mUI.min;
        k.mUI.val = (k.val()-k.mUI.min)/(k.mUI.max-k.mUI.min)*100;
        k.mUI.text = k.attr('name');
        k.mUI.orientation = k.attr('orientation');
        if(k.mUI.class==='mUI_slide'){
          heightProp = 0.5;
          settings.width = (k.mUI.orientation && k.mUI.orientation==='vertical')? parseInt(settings.width)*heightProp : settings.width;
          heightProp = (k.mUI.orientation && k.mUI.orientation==='vertical')? 2 :0.5;
        }
        k.mUI.class +=' mUI_'+k.attr('orientation');
        _createDOM();
        k.mUI.leds =[];
        var c;
        for(c=0;c<11;c++){

          if(k.hasClass('led')){
            k.mUI.leds[c] = led({color:'green'});
          }else{
            k.mUI.leds[c] = $('<span data-n="'+c+'"></span>');
          }
          if(k.hasClass('knob')){
            var rad = Math.PI-(-135 + (c)/(10)*270)/180*Math.PI;
            k.mUI.leds[c].css({'top':Math.round(50+(Math.cos(rad)*40)) +'%',
              'left':Math.round(50+(Math.sin(rad)*40 ))+'%' });
            if(!k.hasClass('led')){
                k.mUI.leds[c].css('transform','translate(-50%,-50%) rotate('+(-rad)+'rad)');
                if( c === 0 || c===10){
                  k.mUI.leds[c].html('<i style="display:block;transform:translateY(7px) rotate('+rad+'rad) translateX(-3px)">'+(k.mUI.min+(c/10*(k.mUI.max-k.mUI.min)))+'</i>');
                }
            }
            k.mUI.grad.append(k.mUI.leds[c]);
        }else{
          var pos = c*8;
          k.mUI.leds[c].css((k.mUI.orientation)? 'top':'left',10+( (k.mUI.orientation)? 80-pos: pos)+'%');
              if( c === 0 || c===10){
                k.mUI.leds[c].html('<i>'+(k.mUI.min+(c/10*(k.mUI.max-k.mUI.min)))+'</i>');
              }
          k.mUI.grad.append(led);
        }
      }
        _rangeEventListeners();
      }

/*** Select */

      function _selectEvents(){
        k.mUI.wrapper.bind('click.k',function(e){
          e.preventDefault();
          k.mUI.choice++;
          k.mUI.choice = k.mUI.choice % k.mUI.options.length;
          k.val(k.mUI.options[k.mUI.choice]);
          $(k.find('option')[k.mUI.choice]).prop('selected',true);
          k.trigger('change');
        });
      }

      function _selectUpdate(){
        k.mUI.choice = k.find('option:selected').index();
        var angle =-137*Math.PI/180+ Math.PI/4+Math.PI+Math.PI*2*k.mUI.choice/k.mUI.options.length;
        k.mUI.button.css({'transform':'rotate('+angle+'rad)'});
        k.mUI.grad.find('div *').removeClass('active');
        k.mUI.options[k.mUI.choice].dom.find('*').addClass('active');
      }

      function _initSelect(){
        //k.hide();
        k.mUI.class='mUI_knob mUI_select';
        k.mUI.update = _selectUpdate;
        _createDOM();
        k.mUI.grad.addClass((k.hasClass('led')? 'led' : 'simple'));
        k.mUI.options = [];
        k.mUI.choice = 0;//TODO le choix fonction de l'option par defaut du HTML
        var count = 0;
        var nbTot = k.find('option').length;
        var maxWidth = 0;
        k.find('option').each(function(){
          var dClass = (360*count/nbTot>=0 && 360*count/nbTot<=90 || 360*count/nbTot>270)? 'left' : 'right';
          dClass += (360*count/nbTot>0 && 360*count/nbTot<=180)? ' bottom' : ' top';
          k.mUI.options.push({name:$(this).html(), value : $(this).attr('value'),dom:$('<div><span></span><i class="'+dClass+'">'+$(this).html()+'</i></div>')});
          var d = k.mUI.options[k.mUI.options.length-1].dom;
          //TODO régler le problème d'affichage des choix du select
          if(!k.hasClass('led')){
              d.find('span').css('transform','translate(-50%,-50%) rotate('+(Math.PI/2+Math.PI*2*count/nbTot)+'rad)');
              //d.find('i').css({'transform':' rotate('+( (-Math.PI/2-Math.PI*2*count/nbTot)/4)+'rad) '});
            }
          k.mUI.grad.append(d);
            d.css({'left':50+Math.cos(Math.PI*2*count/nbTot)*38+'%',
        'top':50+Math.sin(Math.PI*2*count/nbTot)*38+'%'});
        count++;
          k.mUI.grad.find('i').each(function(){
          })
        });

        //compute space
        var l=100000,r=0;
        k.mUI.wrapper.find('i').each(function(){
          l = (l>$(this).position().left)? $(this).position().left : l;
          r = (r<$(this).position().left+$(this).width())? $(this).position().left+$(this).width() : r;
        });
          k.mUI.wrapper.css({'margin':'0 '+r+'px 0 '+Math.abs(l)+'px'});
        _eventListeners();
        _selectEvents();
      }

      function _buttonUpdate(){

      }

/**** Check */

      function _checkUpdate(){
        if (k.attr('checked')){
          k.mUI.wrapper.addClass('checked');
        }else{
          k.mUI.wrapper.removeClass('checked');
        }
      }

      function _checkChange(checked){
        if(k.mUI.on === checked){
          return;
        }
        k.mUI.on = checked;
        k.attr('checked',checked);
        k.val(k.mUI.on);
        k.trigger('change');
      }

      function _checkEventListener(){
        _eventListeners();
        k.mUI.wrapper.bind('click',function(e){
          e.preventDefault();
          if(k.attr('type') === 'radio'){
            $('input[type=radio][name="'+k.mUI.name+'"]').each(function(){
                var mUI = $(this).data('mUI');
                if(mUI != k.mUI){
                  mUI.change(false);
                }
            });
          }
          k.mUI.change(!k.mUI.on);
        });
      }

/*** Button  */

      function _initButton(){
        heightProp = 0.7;
        k.mUI.on = false;
        k.mUI.update = (k.attr('type')==='radio' || k.attr('type')==='checkbox')? _checkUpdate : _buttonUpdate;
        k.mUI.change = _checkChange;
        k.mUI.class = 'mUI_buttonWrapper';
        k.mUI.name = k.attr('name');
        k.data('mUI',k.mUI);
        k.mUI.gradClass = (k.hasClass('led') && k.hasClass('knob'))? 'led' : 'simple';
        if(k.attr('id') && k.prop('tagName') === 'INPUT'){
          $('label[for="'+k.attr('id')+'"]').hide();
          k.mUI.text = $('label[for="'+k.attr('id')+'"]').html();
        }
        if(k.prop('tagName') === 'BUTTON'){
          k.mUI.text = k.html();
        }
        _createDOM();
        _checkEventListener();
      }

/**** Meter **/

      function _vuUpdate(){

        var angle = -45+(k.val()-k.mUI.min)/(k.mUI.max-k.mUI.min)*90;

        k.mUI.button.css('transform','rotate('+angle+'deg)');
      }

      function _meterLedUpdate(){
        var c;
        for (c = 0; c<15; c++){
          k.mUI.leds[c].control( (k.val()-k.mUI.min)/(k.mUI.max-k.mUI.min)*15-c);
        }
      }

      function _initMeterVu(){
        k.mUI.wrapper.append('<svg width="100%" height="100%" viewbox="0 0 100 100"><path class="line" d="M0,45 C25,38 75,38 100,45" /></svg>');
        k.mUI.button.append('<svg width="100%" height="100%"><line x1="50%" y1="93%" x2="50%" y2="35%" style="stroke:rgb(0,0,0);stroke-width:3" /><line x1="50%" y1="35%" x2="50%" y2="25%" style="stroke:rgb(0,0,0);stroke-width:1" /></svg>')
        k.mUI.update = _vuUpdate;

      }

      function _initMeterLed(){
        k.mUI.update = _meterLedUpdate;
        var c;
        k.mUI.leds = [];
        for (c = 0; c<15; c++){
          var col = 'green';
          if(c>=10){
            col = 'orange';
          }
          if(c>12){
            col = 'red';
          }
          var top =(k.mUI.vertical)? 100-c/15*100+'%' : '50%';
          var left =(k.mUI.vertical)? '50%' : c/15*100+'%' ;
          var size = (k.mUI.vertical)? k.mUI.wrapper.height()/20 :k.mUI.wrapper.width()/20;
          k.mUI.leds[c] = led({size:size,color:col,left:left,top:top})
          k.mUI.wrapper.append(k.mUI.leds[c]);
        }
      }

      function _initMeter(){
        k.mUI.class = (k.hasClass('vu'))? 'mUI_vu' : 'mUI_ledmeter';
        k.mUI.orientation = k.attr('orientation');
        heightProp = 0.5;
        settings.width = (k.mUI.orientation && k.mUI.orientation==='vertical')? parseInt(settings.width)*heightProp : settings.width;
        heightProp = (k.mUI.orientation && k.mUI.orientation==='vertical')? 2 :0.5;

        k.mUI.vertical = (k.attr('orientation') && k.attr('orientation')==='vertical');
        k.mUI.min = k.attr('min') || k.attr('low') || 0;
        k.mUI.max = k.attr('max') || k.attr('high') || 100;
        _createDOM();

        if(k.hasClass('vu')){
          _initMeterVu();
        }else{
          _initMeterLed();
        }

        _eventListeners();
      }


      //init
      var heightProp = 1;
      k.mUI = {};
      k.mUI.d=$(document);
      k.mUI.pos = {x:0,y:0};
      k.mUI.val = 0;
      switch(k.prop('tagName')){
        case "INPUT":
          switch(k.attr('type')){
            case "range":
              _initRange();
            break;
            case "checkbox":
              _initButton();
            break;
            case "radio":
              _initButton();
            break;
          }
        break;
        case "BUTTON":
          _initButton();
        break;
        case "SELECT":
          _initSelect();
        break;
        case "METER":
          _initMeter();
        break;
      }

    });
  };
})(jQuery);
