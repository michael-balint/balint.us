function toggleLoading() {
  var loader = document.getElementById('loader');
  var vis = loader.style.visibility;
  if (vis != 'hidden') {
    loader.style.visibility = 'hidden';
  } else {
    loader.style.visibility = 'visible';
  }
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

var w, h, numX, numY, sLen, startX, startY, imgData,
    c = document.getElementById('container'),
    p = document.getElementById('preview'),
    f = document.getElementById('fullscreen'),
    fi = document.getElementById('fullscreen_img'),
    header = document.getElementById('header'),
    currentPhotoNum = 0,
    initPhotoNum = -1,
    previewSize = 5;

function init() {
  setVars();
  initTiles();
  setSizeAndPositions(true);
  setTileImgs();
  changeScreen();
  f.style.display = 'inline';
  header.style.display = 'inline';
}

function changeScreen() {
  setTimeout(function() {
    hideFullscreen();
    if (initPhotoNum != -1 && initPhotoNum != null) {
      showFullscreen();
    } else {
      setSizeAndPositions();
    }
  }, 200); // delay effect
}

function getImageInfo() {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var img = document.getElementById('mosaic_img');
  context.drawImage(img, 0, 0 );
  imgData = context.getImageData(0, 0, img.width, img.height);
}

function setVars() {
  w = window.innerWidth, h = window.innerHeight;
  numX = imgData.width, numY = imgData.height;
  sLen = Math.floor(Math.min(w/numX, h/numY));
  startX = (w - sLen*numX)/2, startY = (h - sLen*numY)/2;
  // url param
  var n = parseInt(getURLParameter('n'));
  initPhotoNum = (n < photos.length && n >= 0) ? n : -1;
  currentPhotoNum = (initPhotoNum != -1) ? initPhotoNum : currentPhotoNum;
}

function initTiles() {
  for (var i=0; i<numY; i++) {
    for (var j=0; j<numX; j++) {
      var index = i*numX + j;
      // if we have a black tile
      if (imgData.data[index*4] +
          imgData.data[index*4 + 1] +
          imgData.data[index*4 + 2] < 128 &&
          imgData.data[index*4 + 3] > 127) { // because of safari
        var tile = document.createElement('div');
        tile.className = 'tile';
        tile.x = j;
        tile.y = i;
        c.appendChild(tile);
      }
    }
  }
}

function setSizeAndPositions(randPos) {
  header.style.opacity = '1';
  header.style.top = startY + 'px';
  header.style.left = startX + 'px';
  var tiles = document.getElementsByClassName('tile');
  if (randPos === true) {
    orderRandom(tiles);
  } else {
    orderMosaic(tiles);
  }
}

function orderRandom(tiles) {
  for (var i=0; i<tiles.length; i++) {
    var tile = tiles[i];
    tile.style.width = sLen + 'px';
    tile.style.height = sLen + 'px';
    tile.style.transform = 'perspective(500px)'
    + ' translate3d(' + (Math.random()*w-w) + 'px,' + (Math.random()*h-h) + 'px,' + 1000 + 'px)';
    tile.style.webkitTransform = 'perspective(500px)'
    + ' translate3d(' + (Math.random()*w-w) + 'px,' + (Math.random()*h-h) + 'px,' + 1000 + 'px)';
  }
}

function orderMosaic(tiles) {
  for (var i=0; i<tiles.length; i++) {
    var tile = tiles[i];
    tile.style.width = sLen + 'px';
    tile.style.height = sLen + 'px';
    tile.style.transform = 'perspective(500px) translate3d(' + (startX + tile.x*sLen) + 'px,' + (startY + tile.y*sLen) + 'px,' + '0px)';
    tile.style.webkitTransform = 'perspective(500px) translate3d(' + (startX + tile.x*sLen) + 'px,' + (startY + tile.y*sLen) + 'px,' + '0px)';
  }
}

function setTileImgs() {
  var counter = 0;
  var tiles = document.getElementsByClassName('tile');
  for (var i=0; i<tiles.length; i++) {
    var tile = tiles[i];
    tile.style.backgroundImage = 'url(photos/tiles/' + photos[counter].file + ')';
    tile.photoId = counter;
    tile.fileName = photos[counter].file;
    tile.addEventListener('mouseover', function() {
      showPreview(this);
    });
    tile.addEventListener('mouseout', function() {

    });

    if(counter < photos.length - 1) {
      counter++;
    } else {
      counter = 0;
    }
  }
}

function showPreview(tile) {
  p.style.backgroundImage = 'url(photos/tiles/' + tile.fileName + ')';
  p.style.width = previewSize*sLen + 'px';
  p.style.height = previewSize*sLen + 'px';
  show(p);
  p.style.left = (startX + tile.x*sLen - (Math.ceil(previewSize/2)-1)*sLen) + 'px';
  p.style.top = (startY + tile.y*sLen - (Math.ceil(previewSize/2)-1)*sLen) + 'px';
  currentPhotoNum = tile.photoId;
  p.onmousemove = function(event) {
    if (event.x <= (startX + tile.x*sLen) || event.x > (startX + (tile.x+1)*sLen) ||
        event.y <= (startY + tile.y*sLen) || event.y > (startY + (tile.y+1)*sLen)) {
      hide(p);
    }
  };
  p.onclick = function() {
    hide(p);
    pushHist('?n='+currentPhotoNum);
    showFullscreen();
  }
}

function showFullscreen() {
  p.style.opacity = 0;
  updateSocial();
  var tiles = document.getElementsByClassName('tile');
  orderRandom(tiles);
  header.style.opacity = '0';
  f.style.visibility = 'visible';
  f.style.opacity = '1';
  fi.style.backgroundImage = 'url(photos/fullscreens/' + photos[currentPhotoNum].file + ')';
  f.style.zIndex = '5';
  fi.onclick = function() {
    updateFullscreen(1);
  };
  document.onkeydown = function(event) {
    switch (event.keyCode) {
      case 37: // left
      case 40: updateFullscreen(-1); // down
        break;
      case 39: // right
      case 38: updateFullscreen(1); // up
        break;
      case 27: updateFullscreen(); // escape
        break;
      default:
        break;
    }
  };
  document.getElementById('prev').onclick = function() {
    updateFullscreen(-1);
  };
  document.getElementById('next').onclick = function() {
    updateFullscreen(1);
  };
  document.getElementById('quit').onclick = function() {
    updateFullscreen();
  };
}

function updateFullscreen(jump) {
  if (jump < 0) {
    currentPhotoNum = currentPhotoNum+jump >= 0 ? currentPhotoNum+jump : photos.length+jump;
    fi.style.backgroundImage = 'url(photos/fullscreens/' + photos[currentPhotoNum].file + ')';
    pushHist('?n='+currentPhotoNum);
    updateSocial();
  } else if (jump > 0) {
    currentPhotoNum = currentPhotoNum+jump <= photos.length-1 ? currentPhotoNum+jump : jump-1;
    fi.style.backgroundImage = 'url(photos/fullscreens/' + photos[currentPhotoNum].file + ')';
    pushHist('?n='+currentPhotoNum);
    updateSocial();
  } else {
    hideFullscreen();
    pushHist('?');
  }
}

function updateSocial() {
  var encodedURL = encodeURIComponent(window.location.href);
  var encodedDesc = encodeURIComponent('balint.us photography');
  var facebook = document.getElementById('facebook');
  facebook.onclick = function() {
    window.location = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedURL;
  };
  var twitter = document.getElementById('twitter');
  twitter.onclick = function() {
    window.location = 'https://twitter.com/intent/tweet?url=' + encodedURL + '&text=' + encodedDesc + '&hashtags=photography';
  };
  var pinterest = document.getElementById('pinterest');
  pinterest.onclick = function() {
    window.location = 'http://pinterest.com/pin/create/button/?url=' + encodedURL + '&media=' + encodeURIComponent('http://www.balint.us/photo/photos/previews/' + photos[currentPhotoNum].file) + 'description=' + encodedDesc;
  };
  var google_plus = document.getElementById('google_plus');
  google_plus.onclick = function() {
    window.location = 'https://plus.google.com/share?url=' + encodedURL;
  };
  var buy = document.getElementById('buy');
  buy.setAttribute('href', photos[currentPhotoNum].shoplocket.link);
  buy.setAttribute('data-shoplocket-product-token', photos[currentPhotoNum].shoplocket.token);
  if (buy.getAttribute('href') == '') {
    buy.style.display = 'none';
  } else {
    buy.style.display = 'inline';
  }
}

function pushHist(newUrl) {
  window.history.pushState(null, null, newUrl);
}

function hideFullscreen() {
  p.style.opacity = 1;
  orderMosaic(document.getElementsByClassName('tile'));
  header.style.opacity = '1';
  f.style.visibility = 'hidden';
  f.style.opacity = '0';
  //fi.style.backgroundImage = '';
  f.style.zIndex = '-1';
}

// hides an element
function hide(el) {
  el.style.display = 'none';
  el.style.visibility = 'hidden';
}

function show(el) {
  el.style.display = 'inline';
  el.style.visibility = 'visible';
}

// on window resize, resize the mosaic
window.addEventListener('resize', function() {
  setVars();
  setSizeAndPositions();
  hide(p);
}, false);

window.addEventListener('popstate', function(e) {
  setVars();
  changeScreen();
});

window.onload = function(){
  getImageInfo();
  loadTileImages(function () {
    toggleLoading();
    init();
  });
};

function loadTileImages(callback) {
  var countLoaded = 0;
  // loads the tiles images so that they are cached
  for (var i = 0; i < photos.length; i++) {
    var img = new Image();
    img.src = 'photos/tiles/' + photos[i].file;
    img.onload = function() {
      countLoaded++;
      if(countLoaded == photos.length - 1) {
        callback();
      }
    }
  }
}

