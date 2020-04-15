var guiData = {
    "preset": "worms",
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
            "iterations": 4,
            "timeStep":0.1,
            }
        }
    }
}


function Brush(){
	this.x = window.innerWidth;
	this.y = window.innerHeight;
	this.isDown = false;

	var vx = 0;
	var vy = 0;
	var mx = 0;
	var my = 0;
	var mouseIsDown = false;

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

var scene, camera, renderer;

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

function addGuiControls(){

    var gui = new dat.GUI({load: guiData });
        gui.remember(this);

        gui.addColor(this, "color1");
        gui.addColor(this, "color2");
        gui.addColor(this, "color3");
        gui.add(this, "dA", 0.0, 1.0).step(0.001);
        gui.add(this, "dB", 0.0, 1.0).step(0.001);
        gui.add(this, "timeStep", 0.0, 0.1).step(0.0001);
        gui.add(this, "feed", 0.0, 0.1).step(0.0001);
        gui.add(this, "k", 0.0, 0.1).step(0.0001);
        gui.add(this, "flow", 1.0, 1.01);
        gui.add(this, "brushSize", 1, 100);
        gui.add(this, "iterations", 0, 100).step(1);
        gui.add(this, "clearScreen");

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