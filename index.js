import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log(THREE);

function main() {

    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const aspect = 2;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const scene = new THREE.Scene();

    const light1 = new THREE.DirectionalLight(0xFFFFFF, 1);
    light1.position.set(-1, 2, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xFF0000, 1);
    light2.position.set(2, 3, -3);
    scene.add(light2);

    const light3 = new THREE.SpotLight(0x0000FF, 1);
    light3.position.set(-2, -3, 3);
    scene.add(light3);

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);

    function makeInstance(geometry, color, x, y, z) {
        const material = new THREE.MeshPhongMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.set(x, y, z);
        return cube;
    }

    function makeTexturedInstance(geometry, x) {
        const loader = new THREE.TextureLoader();
        const materials = [
            new THREE.MeshBasicMaterial({ map: loadColorTexture('Alan.PNG') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('Charlie.PNG') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('Glep.PNG') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('Pim.PNG') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('Shrimp.PNG') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('Smormu.PNG') }),
        ];

        function loadColorTexture(path) {
            const texture = loader.load(path);
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }

    const cubes = [];

    cubes.push(makeTexturedInstance(geometry, 0));
    cubes.push(makeInstance(sphereGeometry, 0xaa8844, -2, 0, 0));
    cubes.push(makeInstance(cylinderGeometry, 0x8844aa, 2, 0, 0));

    for (let i = 0; i < 20; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        const color = Math.random() * 0xffffff;
        cubes.push(makeInstance(geometry, color, x, y, z));
    }

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load('iphone X.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('iphone X.obj', (root) => {
            root.scale.set(0.5, 0.5, 0.5);
            root.position.z -= 1;
            root.position.y += 0.2;
            scene.add(root);
        });
    });

    const loader = new THREE.TextureLoader();
    const texture = loader.load('images.jpg', () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    function render(time) {
        time *= 0.001;

        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
