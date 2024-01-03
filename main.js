//
// Title:
// Author:  Mustafa Baran Ercan,    Neslihan Pelin Metin
// ID:      2881055520,             71047171244 
// Section: Sec_01,                 Sec_02
// Project: 9
// Description: Museum of Galactic Icons. A three js project that contains 3D models of famous characters from movies.
// The user can move around the museum and look at the characters. The characters are Batman, Darth Vader, Jack Sparrow, John Wick.
// write "npx vite" in the terminal to start the server.

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

// SCENE
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

    // These 3 lights are used to light up the cube with different colors.
    //Point Light - 1
    const pointLight1 = new THREE.PointLight(0x0000ff, 50, 7);    // Blue
    pointLight1.position.set(-2, 0, 0);
    scene.add(pointLight1);

    //Point Light - 2
    const pointLight2 = new THREE.PointLight(0xff0000, 50, 7);    // Red
    pointLight2.position.set(2, 0, 0);
    scene.add(pointLight2);

    //Point Light - 3
    const pointLight3 = new THREE.PointLight(0x00ff00, 50, 7);    // Green
    pointLight3.position.set(0, 4, 0);
    scene.add(pointLight3);


    //Skybox
    const CubeTextureLoader = new THREE.CubeTextureLoader();
    const skyboxMaterials = CubeTextureLoader.load([
        'assets/skybox/1.jpg',
        'assets/skybox/6.jpg',
        'assets/skybox/5.jpg',
        'assets/skybox/2.jpg',
        'assets/skybox/3.jpg',
        'assets/skybox/4.jpg',
    ]);
    scene.background = skyboxMaterials;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const floorTexture = new THREE.TextureLoader().load('assets/floor/rubber_tiles.jpg');
    const floor = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ map: floorTexture }));

    const repeat = 13;
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(repeat, repeat);

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.6;
    scene.add(floor);

    // Walls
        // Front Wall
        const wallGeometry = new THREE.PlaneGeometry(30, 17, 1, 1);
        const wallTexture = new THREE.TextureLoader().load('assets/walls/concrete.jpg');
        const wall = new THREE.Mesh(wallGeometry, new THREE.MeshBasicMaterial({ map: wallTexture, color: 0xffffff, side: THREE.DoubleSide, transparent: true}));

        const repeatWallInsideWidth = 2, repeatWallInsideHeight = 1;
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(repeatWallInsideWidth, repeatWallInsideHeight);

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
    context.fillText('GALACTIC ICONS MUSEUM', 0, 50);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // Define the color for the color pass (shader) 
    const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: texture },
            time: { value: 0.0 },
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
            uniform float time; // To animate the text.
            varying vec2 vUv;

            void main() {
                vec4 texColor = texture2D(map, vUv);

                vec3 colors = vec3(
                    0.5 + 0.5 * sin(time * 2.0 + vUv.x * 10.0),
                    0.5 + 0.5 * sin(time * 2.0 + vUv.x * 10.0 + 2.0),
                    0.5 + 0.5 * sin(time * 2.0 + vUv.x * 10.0 + 4.0)
                );

                gl_FragColor = vec4(texColor.rgb * colors, texColor.a);
            }
        `,
        transparent: true,
    });
    // Create a plane to display the text.
    const textGeometry = new THREE.PlaneGeometry(40, 10);
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.y = 11.5;
    text.position.z = -9.9;
    text.position.x = 6;
    scene.add(text);

    // Set render order to fix the transparency issue. (Half of the wall was not visible)
    wall.renderOrder = 1;
    text.renderOrder = 2;


    // Objects (GLTF & OBJ)
        // GLTF
        // loaderGLTF.load('assets/gltf/rock.gltf', function (gltf) {
        //     const rock = gltf.scene;
        //     rock.position.x = 0; rock.position.y = 1.5; rock.position.z = 5;
        //     rock.scale.multiplyScalar(0.1);
        //     scene.add(rock);
        //});


        // Loaders. They are used to load the models.
        var loaderOBJ = new OBJLoader();
        var loaderSTL = new STLLoader();
        var loaderMTL = new MTLLoader();


        // Batman texture
        // I used a texture loader to load the texture.
        const batmanTexture = new THREE.TextureLoader().load('assets/characters/batman/Batman_texture.png');
        const batmanMaterial = new THREE.MeshPhongMaterial({ map: batmanTexture });

        // Batman
        // I used OBJLoader to load the model.
        loaderOBJ.load('assets/characters/batman/Batman.obj', (batman) => {
            batman.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = batmanMaterial;
                }
            });
            batman.position.x = -5; 
            batman.position.y = 2.65; 
            batman.position.z = -6;
            batman.scale.multiplyScalar(0.3);
            
            scene.add(batman);
        });

        // Batman Poster
        // I used a plane geometry to display the poster.
        const darkKnightTexture = new THREE.TextureLoader().load('assets/posters/batman/batman.jpg');
        const darkKnightMaterial = new THREE.MeshPhongMaterial({ map: darkKnightTexture});
        var darkKnightPoster = new THREE.Mesh(new THREE.PlaneGeometry(7, 5), darkKnightMaterial);
        darkKnightPoster.position.x = -5.6;
        darkKnightPoster.position.y = 5;
        darkKnightPoster.position.z = -9.9;
        scene.add(darkKnightPoster);

        
        // Captain Jack Sparrow
        loaderMTL.load('assets/characters/captain/Jack_Sparrow.mtl', function (materials) {
            materials.preload();

            // Set the materials obtained from the MTL file.
            loaderOBJ.setMaterials(materials);

            // Load the OBJ file
            loaderOBJ.load('assets/characters/captain/Jack_Sparrow.obj', function(jack_sparrow) {
                jack_sparrow.position.x = 6; 
                jack_sparrow.position.y = -0.6; 
                jack_sparrow.position.z = -6;
                jack_sparrow.scale.multiplyScalar(0.015);
                scene.add(jack_sparrow);
            });
        });

        // Pirates of the Caribbean poster
        const piratesTexture = new THREE.TextureLoader().load('assets/posters/pirates/pirates.jpg');
        const piratesMaterial = new THREE.MeshPhongMaterial({ map: piratesTexture});
        var piratesPoster = new THREE.Mesh(new THREE.PlaneGeometry(6.66, 5), piratesMaterial);
        piratesPoster.position.x = 6.4;
        piratesPoster.position.y = 5;
        piratesPoster.position.z = -9.9;
        scene.add(piratesPoster);

        // Darth Vader
        let darth_vader; // In here, different than the previous models, I tried to use a global variable to store the model.
        // Darth vader texture
        const darthTexture = new THREE.TextureLoader().load('assets/characters/darth_vader/darth_vader.jpg');
        const darthMaterial = new THREE.MeshPhongMaterial({ map: darthTexture, color: 0x0f0f0f, shininess: 30 });
        // Load Darth Vader model
        loaderOBJ.load('assets/characters/darth_vader/Darth Vader.obj', (model) => {
            darth_vader = model;
            darth_vader.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = darthMaterial;
                }
            });
            darth_vader.rotation.y = Math.PI;
            darth_vader.position.x = 7.5;
            darth_vader.position.y = 2.08;
            darth_vader.position.z = 16;
            darth_vader.scale.multiplyScalar(0.62);

            scene.add(darth_vader);

            
        });
        // Red Special Light just for Darth Vader (cus he is so cool).
        const vaderLight = new THREE.PointLight(0xff0000, 1000, 5);
        vaderLight.position.x = 6.5; vaderLight.position.y = 5; vaderLight.position.z = 14;
        scene.add(vaderLight);

        // Load Star Wars poster
        const starWarsTexture = new THREE.TextureLoader().load('assets/posters/star wars/star_wars.webp');
        const starWarsMaterial = new THREE.MeshPhongMaterial({ map: starWarsTexture, color: 0xffffff, shininess: 30 });
        var starWarsPoster = new THREE.Mesh(new THREE.PlaneGeometry(7, 5), starWarsMaterial);
        starWarsPoster.position.x = 6;
        starWarsPoster.position.y = 5;
        starWarsPoster.position.z = 19.9;
        starWarsPoster.rotation.y = Math.PI;
        scene.add(starWarsPoster);


        // John Wick
        loaderSTL.load('assets/characters/john_wick/john_wick.stl', function (john_wick) {
            const johnWickMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
            var john_wick = new THREE.Mesh(john_wick, johnWickMaterial);
            john_wick.rotation.z = -Math.PI / 20;
            john_wick.rotation.y = -Math.PI / 6;
            john_wick.position.x = -6.8; 
            john_wick.position.y = -0.8; 
            john_wick.position.z = 16;
            john_wick.scale.multiplyScalar(0.03);
            
            scene.add(john_wick);
        });

        // John Wick poster
        const johnWickTexture = new THREE.TextureLoader().load('assets/posters/john_wick/john_wick.jpg');
        const johnWickMaterial = new THREE.MeshPhongMaterial({ map: johnWickTexture});
        var johnWickPoster = new THREE.Mesh(new THREE.PlaneGeometry(5, 6), johnWickMaterial);
        johnWickPoster.position.x = -8;
        johnWickPoster.position.y = 5;
        johnWickPoster.position.z = 19.9;
        johnWickPoster.rotation.y = Math.PI;
        scene.add(johnWickPoster);

        // light for john wick, cus he is cool too.
        const johnWickLight = new THREE.PointLight(0x122368, 1000, 5);
        johnWickLight.position.x = -7; johnWickLight.position.y = 5; johnWickLight.position.z = 14;
        scene.add(johnWickLight);


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
//End of assets

// Set the initial position and angle of the camera.
camera.position.set(0, 0, 5);
camera.rotateX(Math.PI / 10);

// I wanted to add a FPS counter because I was curious about the performance of my program. And it was pretty good.
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

// This function is called every frame.
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

    // Update time for the text animation.
    textMaterial.uniforms.time.value += 0.005;

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
window.addEventListener('mousemove', onDocumentMouseMove, false);   // When the mouse is moved, we call the function with event listener.
var lastMouseX = 0, lastMouseY = 0; // We create variables to store the last mouse position.
var x_rotate = Math.PI / 10; // Initial rotation of the camera.
var y_rotate = 0;   // Initial rotation of the camera.
function onDocumentMouseMove(event) {       // This function is called when the mouse is moved.
    
    event.preventDefault(); // Prevent the default action of the mouse.
    
    if (event.buttons == 1) { // If the left mouse button is pressed.
        var mouse = new THREE.Vector2();   // We create a vector of 2 to store the mouse position.
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1
    
    var changeAmountX = (mouse.x - lastMouseX )* 1; // We calculate the change in mouse position.
    var changeAmountY = (mouse.y - lastMouseY )* 1; 
    
    lastMouseX = mouse.x;   // We set the last mouse position to the current mouse position.
    lastMouseY = mouse.y;
    
    x_rotate += -changeAmountY; // We add the change in mouse position to the rotation of the camera.
    y_rotate += changeAmountX;
    
    if (x_rotate > Math.PI / 2) x_rotate = Math.PI / 2; // We don't want the camera to rotate more than 90 degrees.
    if (x_rotate < -Math.PI / 2) x_rotate = -Math.PI / 2;
    
    camera.setRotationFromEuler(new THREE.Euler(0, 0, 0, 'XYZ')); // We reset the rotation of the camera.
    camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), y_rotate);  // We rotate the camera on the y and x axis.
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