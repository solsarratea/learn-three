var guiData = {
    "preset": "cells",
    "remembered": {
      "worms": {
        "0": {
            "color1": {
            "r": 89.07628676470587,
            "g": 177.5,
            "b": 111.43630620351591
            },
            "color2": {
            "r": 192.5,
            "g": 51.30974264705883,
            "b": 96.72758766968325
            },
            "color3": {
            "r": 31.46446078431372,
            "g": 49.99999999999999,
            "b": 31.46446078431372
            },
            "dA": 0.876,
            "dB": 0.453,
            "feed": 0.037,
            "k": 0.06,
            "flow": 1,
            "brushSize": 30,
            "iterations": 1,
            "timeStep":0.03,
             "enableBrush":0,
            }
        },
        "cells": {
            "0": {
              "color1": {
                "r": 1.5487132352941122,
                "g": 1.5487132352941122,
                "b": 2.499999999999991
              },
              "color2": {
                "r": 220,
                "g": 32.75735294117648,
                "b": 32.75735294117648
              },
              "color3": {
                "r": 67.87224264705884,
                "g": 202.50000000000003,
                "b": 67.87224264705884
              },
              "dA": 0.421,
              "dB": 0.171,
              "timeStep": 0.01,
              "feed": 0.106,
              "k": 0.055,
              "flow": 1,
              "brushSize": 30,
              "iterations": 1
            }
        },
        "fire": {
            "0": {
              "color1": {
                "r": 130,
                "g": 0,
                "b": 0
              },
              "color2": {
                "r": 220,
                "g": 32.75735294117648,
                "b": 32.75735294117648
              },
              "color3": {
                "r": 66.10294117647057,
                "g": 101.71349789915965,
                "b": 120
              },
              "dA": 0.352,
              "dB": 0.161,
              "timeStep": 0.01,
              "feed": 0.006,
              "k": 0.037000000000000005,
              "flow": 1,
              "brushSize": 40.955361251725726,
              "iterations": 10
        }
    },
    "viol":  {
        "0": {
          "color1": {
            "r": 232.5,
            "g": 232.5,
            "b": 232.5
          },
          "color2": {
            "r": 150,
            "g": 119.39338235294117,
            "b": 119.39338235294117
          },
          "color3": {
            "r": 81.10782480727337,
            "g": 61.233149509803916,
            "b": 177.5
          },
          "dA": 0.128,
          "dB": 0.096,
          "timeStep": 0.0529,
          "feed": 0.006,
          "k": 0.0257,
          "flow": 1,
          "brushSize": 100,
          "iterations": 3
        }
      },
    "liv": {
        "0": {
          "color1": {
            "r": 1.5487132352941122,
            "g": 1.5487132352941122,
            "b": 2.499999999999991
          },
          "color2": {
            "r": 52.500000000000014,
            "g": 30.978860294117656,
            "b": 30.978860294117656
          },
          "color3": {
            "r": 38.64583333333333,
            "g": 135.37952196382432,
            "b": 170.00000000000003
          },
          "dA": 0.215,
          "dB": 0.182,
          "timeStep": 0.005200000000000001,
          "feed": 0.006,
          "k": 0.0257,
          "flow": 1,
          "brushSize": 30,
          "iterations": 1
        }
      },
    "hip": {
        "0": {
          "color1": {
            "r": 1.5487132352941122,
            "g": 1.5487132352941122,
            "b": 2.499999999999991
          },
          "color2": {
            "r": 220,
            "g": 32.75735294117648,
            "b": 32.75735294117648
          },
          "color3": {
            "r": 63.00000000000001,
            "g": 169.29411764705875,
            "b": 202
          },
          "dA": 0.388,
          "dB": 0.161,
          "timeStep": 0.01,
          "feed": 0.006,
          "k": 0.037000000000000005,
          "flow": 1,
          "brushSize": 30,
          "iterations": 24
        }
      },
    }
}


function Brush(){
	this.x = window.innerWidth;
    this.y = window.innerHeight;
    this.enable = 0;
    
	this.isDown = false;

	var vx = 0;
	var vy = 0;
	var mx = 0;
	var my = 0;
    var mouseIsDown = false;
    
    this.swap = function(){
        this.enable = !this.enable;
        console.log(this.enable)
    }

	this.update = function(){
        if (!mouseIsDown) {
            vx += (Math.random() * 2 - 1) * 1.0;
            vy += (Math.random() * 2 - 1) * 1.0;

            vx *= 0.99;
            vy *= 0.99;

            mx += vx;
            my += vy;

            if (mx > window.innerWidth) mx = 0;
            if (mx < 0) mx = window.innerWidth;

            if (my > window.innerHeight) my = 0;
            if (my < 0) my = window.innerHeight;
        }

        this.isDown = 1;
        if (mouseIsDown) this.isDown = 1;
        else this.isDown = 0;

		this.x = mx;
		this.y = my;
	}

	window.addEventListener('mousedown', function() {
	    mouseIsDown = true;
	    vx = 0;
	    vy = 0;
	    mx = event.clientX;
		my = window.innerHeight - event.clientY;
	});

	window.addEventListener('mouseup', function() {
	    mouseIsDown = false;
	});

	window.addEventListener('mousemove', function() {
		if (mouseIsDown)
		{
			mx = event.clientX;
			my = window.innerHeight - event.clientY;
		}
	    
	})
}

var scene, camera, renderer, width,height,controls,dragControls;

function setupMainScene()
{
  scene = new THREE.Scene();
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
  camera.position.z = 2;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  controls = new THREE.OrbitControls(camera, renderer.domElement);  
  controls.enableRotate = false;
}




var dA = .2;
var dB = 0.2;
var feed = 0.031;
var k = 0.057;
var brushSize = 1;
var clear = 0;
var iterations = 1;
var flow = 1.00;
var timeStep = 0.01;
var brush = new Brush();


var bufferScene, textureA,textureB, initText;
function setupBufferScene() {

    bufferScene = new THREE.Scene();
  
    textureA = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { 
    minFilter: THREE.LinearFilter, 
    magFilter: THREE.LinearMipMapLinearFilter, 
    format: THREE.RGBAFormat,
    type: THREE.FloatType});

    textureB = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { 
    minFilter: THREE.LinearFilter, 
    magFilter: THREE.LinearMipMapLinearFilter, 
    format: THREE.RGBAFormat,
    type: THREE.FloatType} );

    initText = new THREE.TextureLoader().load('cara.jpg' );
}

var plane, bufferObject;
function initBufferScene(){ 
    bufferMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        bufferTexture: { type: "t", value: textureA.texture },
        start: { type: "t", value: initText },
        res : {type: 'v2',value:new THREE.Vector2(window.innerWidth ,window.innerHeight)},
        brush: {type:'v3',value:new THREE.Vector3(0,0,0)},
        time: {type:'f', value:0.0},
        dA: {type:'f', value:dA},
        dB: {type:'f', value:dB},
        feed: {type:'f', value:feed},
        k: {type:'f', value:k},
        brushSize: {type:'f', value:brushSize},
        clear: {type:'i', value:clear},
        enableBrush: {type:'i', value: 0},
        flow: {type:'f', value:flow},
        diff1:  {type:'f', value: 0.2*flow},
        diff2:  {type:'f', value: 0.05*flow},
    },
        fragmentShader: document.getElementById( 'fragShader' ).innerHTML
    } );

    plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
    bufferObject = new THREE.Mesh( plane, bufferMaterial );
    bufferScene.add(bufferObject);
}


var color1 = new THREE.Color(255, 255, 0);
var color2 = new THREE.Color(255, 0, 0);
var color3 = new THREE.Color(0, 204, 255);

var finalMaterial, geom, quad;
function initFinalScene(){
  finalMaterial = new THREE.ShaderMaterial( {
    uniforms : {
      resolution : { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight) },
      texture : { type : 't', value : textureB.texture, minFilter : THREE.NearestFilter },
      color1 : { type : 'c', value : color1 },
      color2 : { type : 'c', value : color2 },
      color3 : { type : 'c', value : color3 }
  },
    fragmentShader : document.getElementById( 'colorize' ).textContent
  } );

  geom = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
  quad = new THREE.Mesh( geom, finalMaterial );
  scene.add(quad);   
}

setupMainScene();
setupBufferScene();
initBufferScene();
initFinalScene();

function clearScreen() { clear = 1; }
function Brushable() { brush.swap(); }

function addGuiControls(){

    var gui = new dat.GUI({load: guiData });
        gui.remember(this);
       
        gui.addColor(this, "color1");
        gui.addColor(this, "color2");
        gui.addColor(this, "color3");
        gui.add(this, "dA", 0.0, 1.0).step(0.001);
        gui.add(this, "dB", 0.0, 1.0).step(0.001);
        gui.add(this, "timeStep", 0.0, 0.1).step(0.0001);
        gui.add(this, "feed", 0.0, 0.15).step(0.0001);
        gui.add(this, "k", 0.0, 0.15).step(0.0001);
        gui.add(this, "flow", 1.0, 1.01);
        gui.add(this, "brushSize", 1, 100);
        gui.add(this, "iterations", 0, 100).step(1);
        gui.add(this, "clearScreen");
        gui.add(this, "Brushable");

        gui.close();
}
addGuiControls();

function nStepSimulation(){
    for (var i=0; i<iterations; i++){
        //Draw to textureB
        renderer.setRenderTarget(textureB);
        renderer.render(bufferScene, camera);
    
        renderer.setRenderTarget(null);
        renderer.clear();
            
   
       //Swap textureA and B
       var temp = textureA;
       textureA = textureB;
       textureB = temp;
   
       quad.material.map = textureB.texture;
       bufferMaterial.uniforms.bufferTexture.value = textureA.texture;
    }
}

var currentTime = bufferMaterial.uniforms.time.value;
function render() {
    requestAnimationFrame( render );

    brush.update();
    bufferMaterial.uniforms.brush.value.x = brush.x;
    bufferMaterial.uniforms.brush.value.y = brush.y;
    bufferMaterial.uniforms.brush.value.z = brush.isDown;

    nStepSimulation(); 

    bufferMaterial.uniforms.time.value += timeStep;
    bufferMaterial.uniforms.dA.value = dA;
    bufferMaterial.uniforms.dB.value = dB + Math.sin(currentTime/4)/10;
    bufferMaterial.uniforms.feed.value = feed;
    bufferMaterial.uniforms.k.value = k;
    bufferMaterial.uniforms.brushSize.value = brushSize;
    bufferMaterial.uniforms.clear.value = clear;
    bufferMaterial.uniforms.enableBrush.value = brush.enable;
    bufferMaterial.uniforms.flow.value = flow;

    finalMaterial.uniforms.color1.value.r = color1.r/255;
    finalMaterial.uniforms.color1.value.g = color1.g/255;
    finalMaterial.uniforms.color1.value.b = color1.b/255;

    finalMaterial.uniforms.color2.value.r = color2.r/255;
    finalMaterial.uniforms.color2.value.g = color2.g/255;
    finalMaterial.uniforms.color2.value.b = color2.b/255;

    finalMaterial.uniforms.color3.value.r = color3.r/255;
    finalMaterial.uniforms.color3.value.g = color3.g/255;
    finalMaterial.uniforms.color3.value.b = color3.b/255;

  clear = 0;

  renderer.render( scene, camera );
}

render();