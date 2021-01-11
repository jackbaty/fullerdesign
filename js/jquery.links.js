var csl = console && console.log;
if (csl) { console.log(); }
/***************************************
   Links Plugin for  Special File Types and Google Analytics Tracking
   @author Karl Swedberg
   @version 0.2 (07/23/2008)
   @requires jQuery v1.2.6+
   
   @options 
   these are the defaults. you can change them to whatever you want.
   
   extensions:   'doc,xls,exe,zip,pdf,swf',
   pathPrefix:   '/downloads/',
   google:       true, // one of true | false | 'debug'
   hints:        'inline,summary', // one of null | inline | summary | inline,summary
   hintsInline:  {
                   external: 'external', // set this to the img name, not including path (imgPre) or extension (pimgPost); 
                   imgPre:   '/images/icons/',
                   imgPost:  '.png',
                   hintText:   '{type}',
                   hintClass: 'icon  {type}'
                 },
   hintSummary:  {
                   text: 'The links below will attempt to either download a file or open it in another application',
                   pos: 'prepend',
                   hintClass: 'binary'

   }
   @examples
   **Change a default option globally:
        $.fn.links.defaults.google = 'debug';
   
   **Change the text and placement of a hint summary:
     $('#pdf').links({
       hintSummary: {
        text: 'If you are unable to view the above files, you may have to install <a href="http://adobe.com/reader/">Adobe Reader</a>.' ,
        pos:  'append'
       }
     });
   
   
 ************************************** */
   

/* ---remove this line to use---
// might have to use next line if also including Prototype/Scriptaculous
// jQuery.noConflict();

jQuery(function($) {
  // change #container-content to a CSS selector that matches the links' containing element
  $('#container-content').links();  
});

----remove this line to use--- */


/************************************** */


(function($) {
$.fn.links = function(options) {
  var opts = $.extend(true, {}, $.fn.links.defaults, options);

  var replaceType = function(string, replacement) {
    return string.replace(/\{type\}/g,replacement);
  };

  return this.each(function(event) {
    var ext = opts.extensions.replace(/\s+/g,'').replace(/,/g,'|'),
      extPattern = new RegExp('\.(' + ext + ')$');
    var $container = $(this),
      inline = opts.hintsInline,
      summary = opts.hintSummary;
    
    // link hints...
    if (opts.hints) {
      var aNum = 0;
      $('a', $container).each(function() {
        var $a = $(this),
          aPath = this.pathname,
          aExt = aPath.slice(aPath.lastIndexOf('.')),
          aType = aExt.slice(1),
          alt = replaceType(inline.hintText, aType.toUpperCase()),
          externalLink = inline.external && !$('img', this).length && this.hostname && this.hostname !== location.hostname;
        if (extPattern.test(aExt) 
          || (externalLink)
        ) {
          if (!extPattern.test(aExt)) {
            aType = inline.external;
          } else {
            aNum +=1;
          }
          if (opts.hints.indexOf('inline') >= 0) {
            if (opts.getSize === true) {
              var url= "http://json-head.appspot.com/?url="+encodeURI(this.href)+"&callback=?";
          		$.getJSON(url, function(json){

          			if(json.ok && json.headers['Content-Length'] && json.headers['Content-Length'] > 20) {
          				var length = +json.headers['Content-Length'];

          				// divide the length into its largest unit
          				var units = [
          					[1024 * 1024 * 1024, 'GB'],
          					[1024 * 1024, 'MB'],
          					[1024, 'KB'],
          					[1, 'bytes']
          				];

          				for(var i = 0; i < units.length; i++){

          					var unitSize = units[i][0];
          					var unitText = units[i][1];

          					if (length >= unitSize) {
          						length = length / unitSize;
          						// 1 decimal place
          						length = Math.ceil(length * 10) / 10;
          						var lengthUnits = unitText;
          						break;
          					}
          				}
          				$a.after(' (' + length + lengthUnits + ' ' + alt + ')');
          		  }
          		});
            }
            if (inline.imgPre && inline.imgPost) {
              $a.after(inline.imgPost ? '<img class="' + replaceType(inline.hintClass, aType) + '" src="' + inline.imgPre + aType + inline.imgPost + '" alt="' + alt + '" />' : '<span class="' + inline.hintClass + '">' + alt + '</span>');
            }
          }
        }     
        
      });
      if (aNum && opts.hints.indexOf('summary') >= 0) {
        $container[summary.pos]('<div class="' + summary.hintClass + '">' + summary.text + '</div>');
      }
    } 
    
    // google analytics tracking ....
    if (opts.google) {
      var matches = false;
      $container.click(function(event) {
        var tgt = event.target.parentNode.nodeName.toLowerCase() == 'a' ? event.target.parentNode : event.target;
        if (tgt.nodeName.toLowerCase() === 'a') {
          var linkPath = tgt.pathname.replace(/^\//,''),
            linkExt = linkPath.slice(linkPath.lastIndexOf('.'));
          if (extPattern.test(linkExt) || location.hostname !== tgt.hostname) {
            matches = true;
            var trackPath = (location.hostname !== tgt.hostname) ? tgt.href : opts.pathPrefix + linkPath;
            if (opts.google != 'debug') {
              if (typeof pageTracker != 'undefined') {
                pageTracker._trackPageview(trackPath);
              } else if (typeof pageTracker != 'undefined') {
                urchinTracker(trackPath);
              } else {
                return;
              }
            } else {
              (csl) ? console.log('GA path: ' + trackPath) : alert('downloads/' + linkPath);
              (csl) ? console.log(typeof pageTracker == 'undefined' ? 'pageTrack NOT LOADED!' : 'pageTrack successfully loaded') : alert(typeof pageTrack == 'undefined' ? 'pageTrack NOT LOADED!' : 'pageTrack successfully loaded');
            }  
          }
          if (opts.google == 'debug') {
            (csl) ? console.log('matches: ' + matches) : alert('matches: ' + matches);
            return false;
            
          }
        }
      });
    }
  });
};

$.fn.links.defaults = {
  extensions:   'doc,xls,exe,zip,pdf,ppt,swf',
  pathPrefix:   '/downloads/',
  google:       true, // one of true, false, 'debug'
  getSize:      false, //one of true or false
  hints:        'inline,summary', // 
  hintsInline:  {
                  external: 'external', // set this to the img name, not including path (imgPre) or extension (imgPost); 
                  imgPre:   '/images/icons/',
                  imgPost:  '.png',
                  hintText:   '{type}',
                  hintClass: 'icon  {type}'
                },
  hintSummary:  {
                  text: 'The links below will attempt to either download a file or open it in another application',
                  pos: 'prepend',
                  hintClass: 'binary'
  }
};

})(jQuery);
