  var width = window.innerWidth;
  var height = window.innerHeight;

var camera,scene,geometry;
function setupScene(){
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.y = 0;
    camera.position.z = 10;
  
  
   renderer = new THREE.WebGLRenderer();
   renderer.setSize( window.innerWidth, window.innerHeight );
   document.body.appendChild( renderer.domElement );
  
   scene = new THREE.Scene();
  }

var geometry, material, uniforms,plane;
function initScene(){
  geometry = new THREE.PlaneBufferGeometry( 7, 4, 2,2);
  material = new THREE.ShaderMaterial( {
  uniforms: {
      "time": { value: 0.0 }
    },
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    vertexShader: document.getElementById( 'vertexShader' ).textContent

  } );
  plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -1.2 ;
  scene.add( plane );
}
 
function onWindowResize() {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

var time;
function animate() {
  renderer.render(scene, camera);

  var time = performance.now() * 0.005;
  material.uniforms[ "time" ].value = time;
} 

window.addEventListener('resize', onWindowResize, false);

setupScene();
initScene();
animate();
