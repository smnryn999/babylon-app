const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true);
var wheelRB, wheelRF, wheelLB, wheelLF;


const createScene = () => {
   const scene = new BABYLON.Scene(engine);
   // CAMERA AND LIGHT
   const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0,0,0));
   camera.attachControl(canvas, true);
   const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1,1,0));

   buildcar();
  
   // ANIMATION
   const wheelAnimation = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
   
   const wheelKeys = [];
   //At the animation key 0, the value of rotation.y is 0
   wheelKeys.push({frame: 0,value: 0});
   //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
   wheelKeys.push({frame: 30,value: Math.PI * 2});
   
   wheelAnimation.setKeys(wheelKeys);
   wheelRB.animations = [];
   wheelRB.animations.push(wheelAnimation);  //Link this animation to the right back wheel
   wheelRF.animations = [];
   wheelRF.animations.push(wheelAnimation);
   wheelLB.animations = [];
   wheelLB.animations.push(wheelAnimation);
   wheelLF.animations = [];
   wheelLF.animations.push(wheelAnimation);
   //Begin animation - object to animate, first frame, last frame and loop if true
   scene.beginAnimation(wheelRB, 0, 30, true);
   scene.beginAnimation(wheelRF, 0, 30, true);
   scene.beginAnimation(wheelLB, 0, 30, true);
   scene.beginAnimation(wheelLF, 0, 30, true);
        
   return scene;
}

const scene = createScene();

engine.runRenderLoop(function () {
   scene.render();
})

window.addEventListener("resize", function() {
   engine.resize();
})


/*** FUNCTION ***/
function buildcar() {
// CAR BODY
    //base
   const outline = [new BABYLON.Vector3(-0.6, 0, -0.2), new BABYLON.Vector3(0.4, 0, -0.2)];
   //curved front
   for (let i = 0; i < 20; i++) {
      outline.push(new BABYLON.Vector3(0.4 * Math.cos(i * Math.PI / 40), 0, 0.4 * Math.sin(i * Math.PI / 40) - 0.2));
   }
   //top
   outline.push(new BABYLON.Vector3(0, 0, 0.2));
   outline.push(new BABYLON.Vector3(-0.6, 0, 0.2));
   
   const faceUV = [];
   faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
   faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);
   faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);

   const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape:outline, depth:0.4, faceUV:faceUV, wrap:true});
   car.rotation.x = -Math.PI / 2;
   
   const carMaterial = new BABYLON.StandardMaterial("carMaterial");
   carMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");
   car.material = carMaterial;
   
   // WHEELS
   const wheelUV = [];
   wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
   wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
   wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
   
   const wheelMaterial = new BABYLON.StandardMaterial("wheelMaterial");
   wheelMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");   
   
   wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB",{diameter:0.25, height:0.1, faceUV:wheelUV});
      wheelRB.material = wheelMaterial;
      wheelRB.parent = car;  // Tieing car and wheels
      wheelRB.position.z = -0.2;
      wheelRB.position.x = -0.4;
      wheelRB.position.y = 0.07;
   wheelRF = wheelRB.clone("wheelRF");
      wheelRF.position.x= 0.2;
   wheelLB = wheelRB.clone("wheelLB");
      wheelLB.position.y= -0.4 - 0.07;
   wheelLF = wheelRF.clone("wheelLF");
      wheelLF.position.y = -0.4 - 0.07;
      
   return car;
}
   
   
