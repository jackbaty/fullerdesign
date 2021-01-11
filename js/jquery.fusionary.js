$(document).ready(function() {
  if (typeof $.fn.cycle !== 'undefined') {
    $('body').css({'-moz-opacity': '.9999'});
    $('#portimages')
      .after('<ul id="pi-nav"></ul>')
      .cycle({
        speed: 300,
        timeout: 0, 
        pager:  '#pi-nav', 

        // callback fn that creates a thumbnail to use as pager anchor 
        pagerAnchorBuilder: function(idx, slide) { 
            return '<li><a href="#">' + (+idx+1) + '</a></li>'; 
        } 
    }).find('div.caption')
        .css({opacity: '0.7'});
    $('#gallery').cycle({
      timeout: 3200,
      speed: 400
    });
  }
  var $nav = $('ul.nav');
  $('ul', $nav).hide().filter(':has(a.active)').show();
  $('h5', $nav).css('cursor', 'pointer').click(function() {
    $(this).next('ul').fadeToggle();
  });

  if (typeof $.fn.links != 'undefined') {
    $('#content').links({hints: null, google: true});
  }

});

jQuery.fn.fadeToggle = function(speed, easing, callback) {
  return this.animate({opacity: 'toggle'}, speed, easing, callback);
};