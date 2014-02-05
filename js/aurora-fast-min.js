var canvas,context,simplex,h=200;(function(){var b=0;var c=["ms","moz","webkit","o"];window.addEventListener("resize",onWindowResize,false);for(var a=0;a<c.length&&!window.requestAnimationFrame;++a){window.requestAnimationFrame=window[c[a]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[c[a]+"CancelAnimationFrame"]||window[c[a]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(i,e){var d=new Date().getTime();var f=Math.max(0,16-(d-b));var g=window.setTimeout(function(){i(d+f)},f);b=d+f;return g}}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(d){clearTimeout(d)}}simplex=new SimplexNoise();canvas=createAurora(window.innerWidth,h);animate()}());function createAurora(b,a){canvas=document.getElementById("aurora");canvas.width=b;canvas.height=a;context=canvas.getContext("2d");this.redraw=function(){var e=Date.now();var o=e/4000;context.clearRect(0,0,b,a);var d=context.createLinearGradient(0,0,b,a);d.addColorStop(0,"rgba(86,59,148,1)");d.addColorStop((Math.sin(o)+1)*0.5*0.2+0.1,"rgba(178,64,95,.3)");d.addColorStop((Math.cos(o)+1)*0.5*0.2+0.3,"rgba(255,255,50,0.3)");d.addColorStop((Math.sin(o)+1)*0.5*0.2+0.55,"rgba(0,200,0,.3)");d.addColorStop((Math.cos(o)+1)*0.5*0.2+0.8,"rgba(55,60,140,.6)");context.fillStyle=d;context.fillRect(0,0,b,a);context.save();context.globalCompositeOperation="source-over";var d=context.createLinearGradient(0,0,0,a);d.addColorStop(0,"rgba(0,0,0,0.01)");d.addColorStop(1,"rgba(0,0,0,1)");context.fillStyle=d;context.fillRect(0,0,b,a);context.restore();var t=context.createImageData(b,a);var C=context.getImageData(0,0,b,a);var B=t.data;var c=C.data;var p,A,u;var f=0.3;var E=4/f,D=0.25/f;for(var z=0,y=0,x=B.length;z<x;z+=4,y++){A=Math.floor(y/b);p=y%b;u=0;var r=0.3;var k=1.5;var g;for(var q=0;q<f;q++){r*=2;g=Math.pow(k,q);u+=simplex.noise3D(p/b*r*E,A/a*r*D,o)*g}var v=u;var s=u*0.5+0.5;u=Math.floor(s*255);B[z]=Math.floor(s*c[z]);B[z+1]=Math.floor(s*c[z+1]);B[z+2]=Math.floor(s*c[z+2]);B[z+3]=255}context.putImageData(t,0,0)};this.redraw();return this}function animate(){requestAnimationFrame(animate);render()}function render(){canvas.redraw()}function onWindowResize(){canvas=createAurora(window.innerWidth,h)};