var guiData = {
    "preset": "def",
    "remembered": {
      "def": {
        "0": {
          "color1": {
            "r": 230,
            "g": 230,
            "b": 230
          },
          "color2": {
            "r": 35,
            "g": 91.47058823529406,
            "b": 155
          },
          "color3": {
            "r": 0.9895833333333299,
            "g": 1.9664486434108492,
            "b": 85.00000000000001
          },
          "dA": 0.616,
          "dB": 0.301,
          "timeStep": 0.0041,
          "feed": 0.006,
          "k": 0.0257,
          "flow": 1,
          "brushSize": 30,
          "zoom": 0.005809,
          "rotate": -0.007188,
          "iterations": 1,
          "centroX": 918.5774767146486,
          "centroY": 433.93259949195595
        }
      }
    },
    "closed": false,
    "folders": {}
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
    camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 50;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls(camera, renderer.domElement);  
  //  controls.enableRotate = false;
    scene.background = new THREE.Color('#1a1818');
    var lights = [];
              lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
              lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
              lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  
              lights[ 0 ].position.set( 0, 200, 0 );
              lights[ 1 ].position.set( 100, 200, 100 );
              lights[ 2 ].position.set( - 100, - 200, - 100 );
  
    // scene.add( lights[ 0 ] );
    // scene.add( lights[ 1 ] );
    // scene.add( lights[ 2 ] );
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
  var zoom = 0.;
  var rotate = 0.;
  var centroX = window.innerWidth/2.;
  var centroY = window.innerHeight/2.;
  
  
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
          zoom:  {type:'f', value: zoom},
          rotate:  {type:'f', value: rotate},
          centroX:  {type:'f', value: centroX},
          centroY:  {type:'f', value: centroY},
          
  
      },
          fragmentShader: document.getElementById( 'fragShader' ).innerHTML,
          
      } );
  
      bufferMaterial.side = THREE.DoubleSide;
  
      plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
      bufferObject = new THREE.Mesh( plane, bufferMaterial );
      bufferScene.add(bufferObject);
  }
  
  
  var color1 = new THREE.Color(255, 255, 0);
  var color2 = new THREE.Color(255, 0, 0);
  var color3 = new THREE.Color(0, 204, 255);
  
  var finalMaterial, geometry, quad;
  function initFinalScene(){
    finalMaterial = new THREE.ShaderMaterial( {
      uniforms : {
        resolution : { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight) },
        texture : { type : 't', value : textureB.texture, minFilter : THREE.NearestFilter },
        color1 : { type : 'c', value : color1 },
        color2 : { type : 'c', value : color2 },
        color3 : { type : 'c', value : color3 }
    },
      fragmentShader : document.getElementById( 'colorize' ).textContent,
      vertexShader: document.getElementById('vertexShader').textContent
    } );
  
    geometry = new THREE.TorusKnotBufferGeometry( 10, 2., 200, 16);
  
    quad = new THREE.Mesh( geometry, finalMaterial );
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
          gui.add(this, "brushSize", 1, 200);
          gui.add(this, "zoom", -0.1, 0.1).step(0.000001);
          gui.add(this, "rotate", -0.1, 0.1).step(0.000001);
          gui.add(this, "iterations", 0, 100).step(1);
          gui.add(this, "clearScreen");
          gui.add(this, "Brushable");
          gui.add(this, "centroX",0,window.innerWidth);
          gui.add(this, "centroY",0,window.innerHeight);
  
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
      bufferMaterial.uniforms.zoom.value = zoom;
      bufferMaterial.uniforms.dA.value = dA;
      bufferMaterial.uniforms.dB.value = dB;
      bufferMaterial.uniforms.feed.value = feed;
      bufferMaterial.uniforms.k.value = k;
      bufferMaterial.uniforms.brushSize.value = brushSize;
      bufferMaterial.uniforms.clear.value = clear;
      bufferMaterial.uniforms.enableBrush.value = brush.enable;
      bufferMaterial.uniforms.flow.value = flow;
      bufferMaterial.uniforms.rotate.value = rotate;
      bufferMaterial.uniforms.centroX.value = centroX;
      bufferMaterial.uniforms.centroY.value = centroY;
  
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