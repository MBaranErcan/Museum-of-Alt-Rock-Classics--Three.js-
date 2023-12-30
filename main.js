//write "npx vite" in the terminal to start the server.
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
    directionalLight1.position.set(-50, 5, 0);
    scene.add(directionalLight1);

    //Directional Light - 2
    const directionalLight2 = new THREE.DirectionalLight(0xff0000, 2.5);    // Red
    directionalLight2.position.set(50, 5, 0);
    scene.add(directionalLight2);

    //Point Light
    const pointLight = new THREE.PointLight(0x00ff00, 20);   // Green
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);


    //Skybox
    const loader = new THREE.CubeTextureLoader();
    const skyboxMaterials = loader.load([
        'assets/skybox/1.jpg',
        'assets/skybox/6.jpg',
        'assets/skybox/3.jpg',
        'assets/skybox/2.jpg',
        'assets/skybox/5.jpg',
        'assets/skybox/4.jpg',
    ]);
    scene.background = skyboxMaterials;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const floorTexture = new THREE.TextureLoader().load('assets/floor/concrete_2.jpg');
    const floor = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ map: floorTexture }));

    const repeat = 25;
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(repeat, repeat);

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.6;
    scene.add(floor);

    // Walls
        // Front Wall
        const wallGeometry = new THREE.PlaneGeometry(30, 10, 1, 1);
        const wallTexture = new THREE.TextureLoader().load('assets/walls/wall_inside.jpg');
        const wall = new THREE.Mesh(wallGeometry, new THREE.MeshBasicMaterial({ map: wallTexture, color: 0xffffff, side: THREE.DoubleSide, transparent: true}));

        const repeatWallInside = 25;
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(repeatWallInside, repeatWallInside);

        wall.rotation.x = Math.PI;
        wall.position.y = 0.6; wall.position.z = -10;
        scene.add(wall);

        // Right Side Wall
        const wallRight = wall.clone();
        wallRight.rotation.y = Math.PI / 2;
        wallRight.position.x = 15; wallRight.position.z = 5;
        scene.add(wallRight);

        // Left Side Wall
        const wallLeft = wallRight.clone();
        wallLeft.position.x = -15;
        scene.add(wallLeft);
        
        // Back Wall
        const wallBack = wall.clone();
        wallBack.position.z = 20;
        scene.add(wallBack);
    

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.rotateZ(0.5); cube.position.y = 2;
    scene.add(cube);

    // Ring
    const ringGeometry = new THREE.TorusGeometry(1, 0.08, 30, 40);
    const ringMaterial = new THREE.MeshToonMaterial({ color: 0x1976D2, shininess: 10 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotateX(Math.PI / 2); ring.position.y = 2;
    scene.add(ring);

    // Text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 180;
    context.font = "Bold 40px Arial";
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.fillText('MUSEUM OF ALT-ROCK CLASSICS!', 0, 50);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    // Define the color for the color pass
    const textColor = new THREE.Color(0x00ff00);
    const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: texture },
            color: { value: textColor },
        },
        vertexShader: ` 
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
            }
        `,
        fragmentShader: `
            uniform sampler2D map;
            uniform vec3 color;
            varying vec2 vUv;
            void main() {
                vec4 texColor = texture2D(map, vUv);
                gl_FragColor = vec4(texColor.rgb * color, texColor.a);
            }
        `,
        transparent: true,
    });
    
    const textGeometry = new THREE.PlaneGeometry(40, 10);
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.y = 11;
    text.position.z = -9.9;
    scene.add(text);

    // Outlines
        // Function to create an outline
        function createOutline(mesh, color, scale) {
            const outlineMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.BackSide });
            const outlineGeometry = mesh.geometry.clone();
            const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
            outlineMesh.scale.multiplyScalar(scale);
            mesh.add(outlineMesh);
        }
        // Cube Outline
        createOutline(cube, 0x000000, 1.05);

        

// Set the initial position and angle of the camera.
camera.position.set(0, 0, 5);
camera.rotateX(Math.PI / 10);

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
    
    // Animation
    // We rotate the cube.
    cube.rotation.x -= 0.003; cube.rotation.y += 0.003;

    // We rotate the ring.
    ring.rotation.y += 0.006; ring.rotation.x -= 0.006;
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
var x_rotate = Math.PI / 10; // Initial rotation of the camera.
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

