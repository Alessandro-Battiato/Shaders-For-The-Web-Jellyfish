const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const sectionTag = document.querySelector("section");

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xff0000, 0);
sectionTag.appendChild(renderer.domElement);

const clock = new THREE.Clock();
const loader = new THREE.TextureLoader();
const cubeLoader = new THREE.CubeTextureLoader();

const uniforms = {
    time: { value: clock.getElapsedTime() }, // this line alone won't animate anything as this only runs once on load, you need to animate uniforms in the animate function
    cat: { value: loader.load("cat.jpg") },
    cube: {
        value: cubeLoader.load([
            "posx.jpg",
            "negx.jpg",
            "posy.jpg",
            "negy.jpg",
            "posz.jpg",
            "negz.jpg",
        ]),
    },
};

const dpi = 64;
// const geometry = new THREE.SphereGeometry(12, dpi, dpi);
const geometry = new THREE.TorusKnotGeometry(8, 1, 10 * dpi, dpi, 5, 9);
const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
});
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

let aimCamera = new THREE.Vector3(0, 0, 35);
let currentCamera = new THREE.Vector3(0, 200, 100);

camera.position.copy(currentCamera);

function animate() {
    requestAnimationFrame(animate);

    // camera zoom
    const diff = aimCamera.clone().sub(currentCamera).multiplyScalar(0.02); // the sub method is subtracting using the currentCamera so we get closer each time this function is invoked, while with the multiply scalar we can speed up or slow down the camera movement

    currentCamera.add(diff);

    camera.position.copy(currentCamera);

    // Update uniforms
    uniforms.time = { value: clock.getElapsedTime() };

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight; // so we avoid the stretch effect we see on the jellyfish when we resize the window
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});
