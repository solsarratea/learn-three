  var width = window.innerWidth;
  var height = window.innerHeight;

  var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.y = 0;
  camera.position.z = 10;


  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var scene = new THREE.Scene();
  var geometry = new THREE.PlaneBufferGeometry( 7, 4, 2,2);

  material = new THREE.ShaderMaterial( {
  uniforms: {
      "time": { value: 0.0 }
    },
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    vertexShader: document.getElementById( 'vertexShader' ).textContent

  } );

 


  var plane = new THREE.Mesh( geometry, material );
  scene.add( plane );


  plane.rotation.x = -1.2 ;

  function onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

  function animate() {
      renderer.render(scene, camera);

      var time = performance.now() * 0.005;
      material.uniforms[ "time" ].value = time;
    } 

  window.addEventListener('resize', onWindowResize, false);
  animate();
