(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                                 timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

var context;
var simplex = new SimplexNoise();

function createAurora(width, height) {
  var canvas = document.getElementById("aurora");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext('2d');

  //document.body.appendChild(canvas);

  this.redraw = function() {
    var now = Date.now();
    var time = now / 4000;

    context.clearRect(0, 0, width, height);

    var gradient = context.createLinearGradient( 0, 0, height/.4, height * .9);

    gradient.addColorStop( 0, 'rgba(86,59,148,1)' );
    gradient.addColorStop( (Math.sin(time)+1) * 0.5 * 0.2, 'rgba(178,64,95,.3)' );
    gradient.addColorStop( (Math.cos(time)+1) * 0.5 * 0.2 + 0.444 , 'rgba(0,200,0,.6)' ); // 0.6
    gradient.addColorStop( 0.7, 'rgba(55,60,140,.3)' );
    gradient.addColorStop( 1, 'rgba(0,200,0,.5)' );

    context.fillStyle = gradient;

    context.fillRect(0,0, width, height);

    context.save();
    context.globalCompositeOperation = 'source-over';
    var gradient = context.createLinearGradient( 0, 0, 0, height*.5 );

    gradient.addColorStop( 0, 'rgba(0,0,0,0.01)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,1)' );


    context.fillStyle = gradient;
    context.fillRect(0,0, width, height);

    context.restore();

    var image = context.createImageData( width, height );
    var image2 = context.getImageData( 0, 0, width, height );

    var imageData = image.data;
    var imageData2 = image2.data;


    var w,h, n;

    // settings
    var octaves = .3;
    var scaleX = 4 /octaves, scaleY = 0.25 /octaves;

    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++  ) {

      h = Math.floor( j/width );
      w = j % width;

      n = 0;
      var frequency = .3;
      var persistance = 1.5;
      var amptitude ;

      for (var oi=0; oi < octaves; oi++) {
        frequency *= 2;
        amptitude =  Math.pow(persistance, oi);

        n += simplex.noise3D(w/width * frequency * scaleX, h/height* frequency * scaleY, time)  * amptitude ;
      }


      var m = n;
      var factor = n* 0.5 + 0.5;
      n = Math.floor( factor * 255);

      imageData[ i ] = Math.floor( factor * imageData2[ i ]);
      imageData[ i + 1 ] = Math.floor( factor * imageData2[ i + 1]);
      imageData[ i + 2 ] = Math.floor( factor * imageData2[ i + 2 ]);
      imageData[ i + 3 ] = 255;



    }
    context.putImageData( image, 0, 0 );

  }

  this.redraw();

  return this;
}

var canvas = createAurora(window.innerWidth, window.innerHeight);
animate();
window.addEventListener( 'resize', onWindowResize, false );


function animate() {

  requestAnimationFrame( animate );
  render();

}

function render() {
  canvas.redraw();
}

function onWindowResize() {
  //document.deleteElement("canvas");
  canvas = createAurora(window.innerWidth, window.innerHeight);
  //animate();

}
