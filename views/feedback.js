
var gui = new dat.GUI();
///////////////////////////////////////////////////////////////
var w = window.innerWidth;
var h = window.innerHeight;
//Set up controlls
var guiData = {
    colorA : [ 30, 38, 48 ],
    colorB : [ 251, 53, 80 ],
};

gui.addColor(guiData,'colorA');
gui.addColor(guiData,'colorB');

// gui.addColor(guiData,'valX');
// gui.addColor(guiData,'valY');

var colorA = new THREE.Vector3( guiData.colorA[ 0 ] / 255, guiData.colorA[ 1 ] / 255, guiData.colorA[ 2 ] / 255 );
var colorB = new THREE.Vector3( guiData.colorB[ 0 ] / 255, guiData.colorB[ 1 ] / 255, guiData.colorB[ 2 ] / 255 );

///////////////////////////////////////////////////////////////
// Set up camera, renderer and scene
camera = new THREE.Camera();


var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x665544, 1 );
document.body.appendChild( renderer.domElement );

//Render scene
var scene = new THREE.Scene();

///////////////////////////////////////////////////////////////
//Set up render shader  uniforms
uniforms = {
    resolution : { type : 'v2', value : new THREE.Vector2( w, h ) },
    colorA : { type : 'v3', value : colorA },
    colorB : { type : 'v3', value : colorB },

    }
    
var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    fragmentShader: document.getElementById( 'fragShader' ).textContent
});

///////////////////////////////////////////////////////////////
//Set up bufferScene and textures 

var bufferScene
    ,ping 
    ,pong; 

bufferScene = new THREE.Scene();
var renderTargetParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
};
    
ping = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
pong = new THREE.WebGLRenderTarget( w, h, renderTargetParams );

bufferUniforms = {
    texture: { type : 't', value : pong.texture },
    resolution : { type : 'v2', value : new THREE.Vector2( w, h ) },
    smokeSource: {type:"v3",value:new THREE.Vector3(0,0,0)}
};

var bufferMaterial = new THREE.ShaderMaterial({
    uniforms : bufferUniforms,
    fragmentShader : document.getElementById( 'fragShader' ).textContent
    });

var plane = new THREE.PlaneBufferGeometry( 2, 2 );
var bufferObject = new THREE.Mesh( plane, bufferMaterial );
bufferScene.add(bufferObject);


//Send position of smoke source with value
var mouseDown = false;
function UpdateMousePosition(X,Y){
    var mouseX = X;
      var mouseY = h - Y;
      bufferMaterial.uniforms.smokeSource.value.x = mouseX;
      bufferMaterial.uniforms.smokeSource.value.y = mouseY;
}
document.onmousemove = function(event){
      UpdateMousePosition(event.clientX,event.clientY)
}

document.onmousedown = function(event){
    mouseDown = true;
    bufferMaterial.uniforms.smokeSource.value.z = 0.01;
}
document.onmouseup = function(event){
    mouseDown = false;
    bufferMaterial.uniforms.smokeSource.value.z = 0;
}

//Draw ping to screen
var finalMaterial;
finalMaterial =  new THREE.MeshBasicMaterial({map: ping});
quad = new THREE.Mesh( plane, finalMaterial );
scene.add(quad);


function render() {

    requestAnimationFrame( render );
    //Draw ping to buffer
    renderer.setRenderTarget(ping);
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget(null);
    renderer.clear();
        
    //Swap ping and pong
    let temp = pong;
    pong = ping;
    ping = temp;

    //Update uniforms
    quad.material.map = ping;
    bufferMaterial.uniforms.texture.value=pong;

    //Draw to screen
    renderer.render( scene, camera );
    }
    
render();
