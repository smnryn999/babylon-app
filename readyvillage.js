const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true);


/****   FUNCTIONS   ****/
var village = () => {
   BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb").then(() => {
      var ground = scene.getMeshByName("ground")
      ground.material.maxSimultaneousLights = 15;
   });

   BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
      const car = scene.getMeshByName("car");
      car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
      car.position = new BABYLON.Vector3(-3, 0.16, 8);
      
      const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
   const carKeys = []; 
   carKeys.push({
      frame: 0,
      value: 10
   });
   carKeys.push({
      frame: 200,
      value: -15
   });
   animCar.setKeys(carKeys);

   car.animations = [];
   car.animations.push(animCar);

   scene.beginAnimation(car, 0, 200, true);

   //wheel animation
   const wheelRB = scene.getMeshByName("wheelRB");
   const wheelRF = scene.getMeshByName("wheelRF");
   const wheelLB = scene.getMeshByName("wheelLB");
   const wheelLF = scene.getMeshByName("wheelLF");
   
   scene.beginAnimation(wheelRB, 0, 30, true);
   scene.beginAnimation(wheelRF, 0, 30, true);
   scene.beginAnimation(wheelLB, 0, 30, true);
   scene.beginAnimation(wheelLF, 0, 30, true);
   });
}

var sky = () => {
   const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150});
   const skyboxMaterial = new BABYLON.StandardMaterial("skyBox");
   skyboxMaterial.backFaceCulling = false;
   skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/textures/skybox");
   skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
   skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
   skybox.material = skyboxMaterial;
}

var woods = (a,b) => {
   const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "https://assets.babylonjs.com/textures/palm.png", 2000, {width: 512, height: 1024});
   for(let i=0; i<500; i++){
      const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
      tree.position = new BABYLON.Vector3(Math.random()*(-15), 0.5, Math.random()*15+5);
   }
   for(let i=0; i<500; i++){
      const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
      tree.position = new BABYLON.Vector3(Math.random()*(-15), 0.5, Math.random()*(-15)-5);
   }
}

var ufo = () => {
   const spriteManagerUFO = new BABYLON.SpriteManager("UFOManager","https://assets.babylonjs.com/environments/ufo.png", 2, {width: 128, height: 76});
   const ufo = new BABYLON.Sprite("ufo", spriteManagerUFO);
   ufo.position.y = 5;
   ufo.width = 1;
   ufo.height = 0.5;
   ufo.playAnimation(0, 16, true, 250);
   
   const ufo2 = new BABYLON.Sprite("ufo2", spriteManagerUFO);
   ufo2.position = new BABYLON.Vector3(10,5,0);
   ufo2.width = 1;
   ufo2.height = 0.5;
   ufo2.playAnimation(0, 16, true, 500);      
}

var fountain = () => {
   const fountainShape = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0.5, 0, 0),
      new BABYLON.Vector3(0.5, 0.2, 0),
      new BABYLON.Vector3(0.4, 0.2, 0),
      new BABYLON.Vector3(0.4, 0.05, 0),
      new BABYLON.Vector3(0.05, 0.1, 0),
      new BABYLON.Vector3(0.05, 0.75, 0),
      new BABYLON.Vector3(0.15, 0.85, 0)];	
   const fountain = new BABYLON.CreateLathe("fountain", {shape: fountainShape, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
   fountain.position = new BABYLON.Vector3(-2, 0, -3);
   
   // Water Particles
   const particleSystem = new BABYLON.ParticleSystem("particles", 5000);
   particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png");
   
   particleSystem.emitter = new BABYLON.Vector3(-2, 0.8, -3); // the point at the top of the fountain
   particleSystem.minEmitBox = new BABYLON.Vector3(-0.01, 0, -0.01); // minimum box dimensions
   particleSystem.maxEmitBox = new BABYLON.Vector3(0.01, 0, 0.01); // maximum box dimensions
   
   particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
   particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
   particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
   
   particleSystem.minSize = 0.01;
   particleSystem.maxSize = 0.05;
   particleSystem.minLifeTime = 0.3;
   particleSystem.maxLifeTime = 1.5;
   
   particleSystem.emitRate = 1500;
   
   particleSystem.direction1 = new BABYLON.Vector3(-1, 8, 1);
   particleSystem.direction2 = new BABYLON.Vector3(1, 8, -1);
   particleSystem.minEmitPower = 0.2;
   particleSystem.maxEmitPower = 0.6;
   particleSystem.updateSpeed = 0.01;
   
   particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
   particleSystem.start();
   
   // Off-On the Fountain
   let switched = false;
   scene.onPointerObservable.add((pointerInfo) => { 		
      switch (pointerInfo.type) {
         case BABYLON.PointerEventTypes.POINTERDOWN:
            if(pointerInfo.pickInfo.hit) {
               clickFountain(pointerInfo.pickInfo.pickedMesh);}
         break;
      }
   });
   
  const clickFountain = (mesh) => {
  if(mesh===fountain) {    
      if(switched) {particleSystem.start();}
      else {particleSystem.stop();}
   }
      switched = !switched;
   }
}

var lamps = () => {
   BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "lamp.babylon").then(() => {
      const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), 0.8 * Math.PI, 0.01, scene);
      lampLight.diffuse = new BABYLON.Color3.Yellow();
      lampLight.parent = scene.getMeshByName("bulb");
      
      const lamp = scene.getMeshByName("lamp");
      lamp.position = new BABYLON.Vector3(2,0,2);
      lamp.rotation.y = -Math.PI/4;
      for(let i=0; i<12; i=i+4){
         const lampx = lamp.clone("lampx");
         lampx.position = new BABYLON.Vector3(2,0,-i);
         lampx.rotation.y = 0;
      }
      for(let i=0; i<16; i=i+4){
         const lampx = lamp.clone("lampx");
         lampx.position = new BABYLON.Vector3(3.8,0,-i+2);
         lampx.rotation.y = Math.PI;
      }
      for(let i=0; i<10; i=i+4){
         const lampx = lamp.clone("lampx");
         lampx.position = new BABYLON.Vector3(-i,0,1.5-i/3.5);
         lampx.rotation.y = -Math.PI / 2;
      }
   });
}

var day_night = () => {
   const adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
   const panel = new BABYLON.GUI.StackPanel();
   panel.width = "220px";
   panel.top = "-50px";
   panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
   panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
   adt.addControl(panel);
   
   const header = new BABYLON.GUI.TextBlock();
   header.text = "Night to Day";
   header.height = "30px";
   header.color = "white";
   panel.addControl(header);
   
   const slider = new BABYLON.GUI.Slider();
   slider.minimum = 0;
   slider.maximum = 1;
   slider.borderColor = "black";
   slider.color = "#AAAAAA";
   slider.background = "#white";
   slider.value = 1;
   slider.height = "20px";
   slider.width = "200px";
   panel.addControl(slider);
   slider.onValueChangedObservable.add((value) => {
      if (light) {
         light.intensity = value;
      }
   });  
}

var dude = () => {

   const walk = function (turn, dist) {
      this.turn = turn;
      this.dist = dist;
    }
   const track = [];
   track.push(new walk(86, 7));
   track.push(new walk(-85, 14.8));
   track.push(new walk(-93, 16.5));
   track.push(new walk(48, 25.5));
   track.push(new walk(-112, 30.5));
   track.push(new walk(-72, 33.2));
   track.push(new walk(42, 37.5));
   track.push(new walk(-98, 45.2));
   track.push(new walk(0, 47));
   
   BABYLON.SceneLoader.ImportMeshAsync("him", "https://www.babylonjs-playground.com/scenes/Dude/", "Dude.babylon").then((result) => {
      const dude = result.meshes[0];
      dude.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
      dude.position = new BABYLON.Vector3(-6,0,0);
      dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
      const startRotation = dude.rotationQuaternion.clone();
      
      //camera.parent = dude;
      camera.lockedTarget = dude;
      scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
      
      let distance = 0, step = 0.015, p = 0;
      scene.onBeforeRenderObservable.add(() => {
         dude.movePOV(0, 0, step);
         distance += step;
         if (distance > track[p].dist) {
            dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
            p +=1;
            p %= track.length; 
            if (p === 0) {
               distance = 0;
               dude.position = new BABYLON.Vector3(-6, 0, 0);
               dude.rotationQuaternion = startRotation.clone();
            }
         }
      });
   });
}


/****   SCENE   ****/
const createScene = () => {
   const scene = new BABYLON.Scene(engine);

   sky();
   village();
   woods();
   ufo();
   lamps();
   day_night();
   dude();
         
   return scene;
};

const scene = createScene();
engine.runRenderLoop(function() {
   scene.render();
});
const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-6, 0, 0), scene);
   camera.heightOffset = 8;
   camera.radius = 1;
   camera.rotationOffset = 0;
   camera.cameraAcceleration = 0.005;
   camera.maxCameraSpeed = 10;
   camera.attachControl(canvas, true);
  
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
   light.intensity = 1;

fountain();


/* ALTERNATIVE ELEMENTS */

/* const light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0,-1,1), scene);
   light.position = new BABYLON.Vector3(0, -15, 30);
   
   const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
   
   shadowGenerator.addShadowCaster(dude, true);
   ground.receiveShadows = true;
   */
   
   
/* const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 150, new BABYLON.Vector3(0, 60, 0));
   camera.upperBetaLimit = Math.PI / 2.2; */