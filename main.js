import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, // FOV  (Field of View)
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1, // Near Clipping Plane
    10000 // Far Clipping Plane
    );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ASSETS

//Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

//Directional Light - 1
const directionalLight1 = new THREE.DirectionalLight(0x0000ff, 2.5);    // Blue
directionalLight1.position.set(-50, 10, 0);
scene.add(directionalLight1);

//Directional Light - 2
const directionalLight2 = new THREE.DirectionalLight(0xff0000, 2,5);    // Red
directionalLight2.position.set(50, 10, 0);
scene.add(directionalLight2);

//Point Light
const pointLight = new THREE.PointLight(0x00ff00, 20);   // Green
pointLight.position.set(0, 2, 0);
scene.add(pointLight);


//Skybox
const loader = new THREE.CubeTextureLoader();
const skyboxMaterials = loader.load([
    'assets/skybox/1.jpg',
    'assets/skybox/6.jpg',
    'assets/skybox/3.jpg',
    'assets/skybox/4.jpg',
    'assets/skybox/5.jpg',
    'assets/skybox/2.jpg',
]);
scene.background = skyboxMaterials;

// Floor
const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
const floorTexture = new THREE.TextureLoader().load('assets/floor/concrete_2.jpg');
const floor = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ map: floorTexture }));

const repeat = 50;
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(repeat, repeat);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.6;
scene.add(floor);

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);



// Set the initial position of the camera.
camera.position.set(0, 0, 5);
camera.rotateX(0);

// I wanted to add a FPS counter because I was curious about the performance of my program.
let fps, then = performance.now();                  // It works by calculating the time between each frame.
const fpsCounter = document.createElement('div');   // Create a HTML element to display the FPS
fpsCounter.style.position = 'fixed';                // Set it to be fixed (not moving).
fpsCounter.style.top = '10px';                      // Placing it at the top-
fpsCounter.style.left = '10px';                     // left corner of the screen.
fpsCounter.style.color = 'white';                   // Set color to white.
document.body.appendChild(fpsCounter);


var movement_speed = 0.004;          // Movement speed of the camera.
var up = new THREE.Vector3(0, 1, 0); // We create a vector to store the up direction of the camera. (It is always fixed)
var direction = new THREE.Vector3(); // We create a vector to store the direction of the camera.

function init(now) {
    requestAnimationFrame(init);
    
    // Calculate delta time
    const delta = now - then;
    then = now;

    // Calculate FPS
    fps = 1 / (delta / 1000);
    fpsCounter.textContent = fps.toFixed(1) + " FPS";
    
    camera.updateMatrixWorld();
    camera.getWorldDirection(direction);

    // Movement
    var movement = new THREE.Vector3(0, 0, 0);  // We create a vector to store the movement.
    if (key_states[0]) movement.add(direction.clone().multiplyScalar(movement_speed * delta));               // W .clone() is used to copy the vector because we don't want to change the original vector.
    if (key_states[2]) movement.sub(direction.clone().multiplyScalar(movement_speed * delta));               // S
    if (key_states[1]) movement.sub(direction.clone().cross(up).multiplyScalar(movement_speed * delta));     // A we do cross product of direction with up to get the right vector (subtraction because we want to go left)
    if (key_states[3]) movement.add(direction.clone().cross(up).multiplyScalar(movement_speed * delta));     // D we do cross product of direction with up to get the right vector
    if (key_states[4]) movement.add(up.clone().multiplyScalar(movement_speed * delta)); // E
    if (key_states[5]) movement.sub(up.clone().multiplyScalar(movement_speed * delta)); // Q
    camera.position.add(movement);  // We add the movement to the camera position.

    if (camera.position.y < 0.0) camera.position.y = 0.0; // We don't want the camera to go below the floor.

    // Render
    renderer.render(scene, camera);
    cube.rotation.y += 0.002;
}
requestAnimationFrame(init);

// We create an array to store the key states.
                // W       A      S     D       E     Q
var key_states = [false, false, false, false, false, false];
// When the key is pressed, we set the key state to true.
document.addEventListener('keydown', onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87)  // W
        key_states[0] = true;
    if (keyCode == 83)  // S
        key_states[2] = true;
    if (keyCode == 65)  // A
        key_states[1] = true;
    if (keyCode == 68)  // D
        key_states[3] = true;
    if (keyCode == 69)  // E  
        key_states[4] = true;
    if (keyCode == 81)  // Q
        key_states[5] = true;
}
// When the key is released, we set the key state to false.
document.addEventListener('keyup', onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
    var keyCode = event.which;
    if (keyCode == 87)  // W
        key_states[0] = false;
    if (keyCode == 83)  // S
        key_states[2] = false;
    if (keyCode == 65)  // A
        key_states[1] = false;
    if (keyCode == 68)  // D
        key_states[3] = false;
    if (keyCode == 69)  // E  
        key_states[4] = false;
    if (keyCode == 81)  // Q
        key_states[5] = false;
}

// MOUSE (Camera) rotation
window.addEventListener('mousemove', onDocumentMouseMove, false);
var lastMouseX = 0, lastMouseY = 0;
var x_rotate = 0;
var y_rotate = 0;
function onDocumentMouseMove(event) {
    
    event.preventDefault();
    
    if (event.buttons == 1) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1
    
    var changeAmountX = (mouse.x - lastMouseX )* 1;
    var changeAmountY = (mouse.y - lastMouseY )* 1;
    
    lastMouseX = mouse.x;
    lastMouseY = mouse.y;
    
    x_rotate += -changeAmountY;
    y_rotate += changeAmountX;
    
    if (x_rotate > Math.PI / 2) x_rotate = Math.PI / 2;
    if (x_rotate < -Math.PI / 2) x_rotate = -Math.PI / 2;
    
    camera.setRotationFromEuler(new THREE.Euler(0, 0, 0, 'XYZ'));
    camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), y_rotate);
    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), x_rotate);
    
    }
    else {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1
        
        lastMouseX = mouse.x;
        lastMouseY = mouse.y;
    }
}

