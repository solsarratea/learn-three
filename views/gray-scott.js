
var gui = new dat.GUI();
var w = window.innerWidth > 1200 ? 1200 : window.innerWidth, h = 600,timer=0;

///////////////////////////////////////////////////////////////
//Set up controlls
var guiData = {
    feed :0.01,
    kill: 0.01,
    colorA: [255,255,255],
    colorB: [0,0,0],
    dA: 0.1,
    dB: 0.1,
    dT:0.01
};

gui.add(guiData, 'feed', 0.3, 1.5).step(0.001);
gui.add(guiData, 'kill', 0, 1.).step(0.001);
gui.add(guiData, 'dA', 0., 1.).step(0.001);
gui.add(guiData, 'dB', 0., 1.).step(0.001);
gui.add(guiData, 'dT', 0., 1.).step(0.001);
gui.addColor(guiData,'colorA');
gui.addColor(guiData,'colorB');

var colorA = new THREE.Vector3( guiData.colorA[ 0 ] / 255, guiData.colorA[ 1 ] / 255, guiData.colorA[ 2 ] / 255 );
var colorB = new THREE.Vector3( guiData.colorB[ 0 ] / 255, guiData.colorB[ 1 ] / 255, guiData.colorB[ 2 ] / 255 );

///////////////////////////////////////////////////////////////
// Set up scene
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true } );

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101010);
document.body.appendChild(renderer.domElement);
scene = new THREE.Scene();   
camera = new THREE.Camera();
camera.position.z = 1;


///////////////////////////////////////////////////////////////
//Set initial buffers
var ping,
    texture;

function initText(){
    var cnvs = document.createElement( 'canvas' );
    cnvs.width = 1024;
    cnvs.height = 512;
    ctx = cnvs.getContext( '2d' );
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, 1024, 512 );
    ctx.font = '800 300px Roboto';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText( 'quema', 1024 / 2, 512 / 2 );
    startText = new THREE.Texture( cnvs );
} 

var textureI = new THREE.TextureLoader().load('cara.jpg' );

texture=initText();

///////////////////////////////////////////////////////////////
//Set up render shader  uniforms
uniforms = {
    texture: { type : 't', value : startText,
              minFilter : THREE.NearestFilter },
    resolution : { type : 'v2', value : new THREE.Vector2( w, h ) },
    colorA : { type : 'v3', value : colorA },
    colorB : { type : 'v3', value : colorB },
    }

///////////////////////////////////////////////////////////////
//Ping pong set up
var renderTargetParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
};

ping = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
pong = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
ping.texture.wrapS = THREE.ClampToEdgeWrapping;
ping.texture.wrapT = THREE.ClampToEdgeWrapping;
pong.texture.wrapS = THREE.ClampToEdgeWrapping;
pong.texture.wrapT = THREE.ClampToEdgeWrapping;

function swapBuffers() {
    var a = pong;
    pong = ping;
    ping = a;
    uniforms2.texture2.value = pong.texture;
}
///////////////////////////////////////////////////////////////
//Set up buffer shader  uniforms

uniforms2 = {
    timer : { type: 'i', value: 0 },
    resolution : { type : 'v2', value : new THREE.Vector2() },
    start : { type : 't', value : startText },
    texture2: { type : 't', value : pong.texture },
    dA : { type: 'f', value : guiData.dA },
    dB : { type: 'f', value : guiData.dB },
    kill : { type: 'f', value : guiData.kill },
    feed : { type: 'f', value : guiData.feed },
    dT : { type: 'f', value : guiData.dT },
};


///////////////////////////////////////////////////////////////
//Buffer 2

var material2 = new THREE.ShaderMaterial( {
    uniforms : uniforms2,
    vertexShader : document.getElementById( 'vertexShader' ).textContent,
    fragmentShader : document.getElementById( 'grayScott' ).textContent
} );

var geometry2 = new THREE.PlaneBufferGeometry( 2, 2 );
var mesh2 = new THREE.Mesh( geometry2, material2 );
scene.add( mesh2 );

startText.needsUpdate = true;

//////////////////////////////////////////////////////////////
///Buffer 1
var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
});

var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
var mesh = new THREE.Mesh( geometry, material );
//scene.add( mesh );
                    

render();

function stepSim() {
    renderer.render( scene, camera );
    renderer.setRenderTarget( ping );
    swapBuffers();
    renderer.setRenderTarget( null );
}

function render() {

    requestAnimationFrame(render);

    // for (var i = 0; i < 8; i++) {
    //     stepSim();
    //     stepSim();
    // }

    renderer.render(scene, camera);
    renderer.setRenderTarget( ping );

   //  ++ uniforms2.timer.value;

}
