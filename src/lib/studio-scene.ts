import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StudioView = "perspective" | "side" | "front";

/** Owns all GPU resources; rendering occurs only after a view change. */
export async function createStudio(
  host: HTMLElement,
  signal: AbortSignal,
  onLost: () => void,
) {
  const response = await fetch("/models/v20-brake-pro.bin", { signal });
  if (!response.ok || !response.body) throw new Error("Modelo indisponível");
  const buffer = await new Response(
    response.body.pipeThrough(new DecompressionStream("gzip")),
  ).arrayBuffer();
  signal.throwIfAborted();
  const gltf = await new GLTFLoader().parseAsync(buffer, "/models/");
  const disposeModel = () =>
    gltf.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      materials.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value instanceof THREE.Texture) value.dispose();
        });
        material.dispose();
      });
    });
  if (signal.aborted) {
    disposeModel();
    signal.throwIfAborted();
  }
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch (error) {
    disposeModel();
    throw error;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  room.dispose();
  pmrem.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  scene.add(model);
  const size = box.getSize(new THREE.Vector3());
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.minPolarAngle = Math.PI * 0.28;
  controls.maxPolarAngle = Math.PI * 0.56;
  controls.rotateSpeed = 0.6;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.touchAction = "pan-y";
  host.appendChild(renderer.domElement);
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(-3, 4, 5);
  scene.add(key, new THREE.HemisphereLight(0xe8f2ff, 0x424836, 0.6));
  let disposed = false;
  let visible = true;
  let frame = 0;
  let view: StudioView = "perspective";
  const draw = () => {
    if (disposed || !visible || document.hidden) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (!disposed) renderer.render(scene, camera);
    });
  };
  const fit = () => {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const distance =
      (Math.max(size.y / 2, size.x / (2 * camera.aspect)) /
        Math.tan(THREE.MathUtils.degToRad(16))) *
      1.22;
    const direction =
      view === "front"
        ? new THREE.Vector3(1, 0.13, 0.05)
        : view === "side"
          ? new THREE.Vector3(0, 0.04, 1)
          : new THREE.Vector3(-0.38, 0.15, 1);
    camera.position.copy(direction.normalize().multiplyScalar(distance));
    controls.target.set(0, -size.y * 0.02, 0);
    controls.update();
    draw();
  };
  controls.addEventListener("change", draw);
  const resize = new ResizeObserver(fit);
  resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    draw();
  });
  intersection.observe(host);
  const lost = (event: Event) => {
    event.preventDefault();
    onLost();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  document.addEventListener("visibilitychange", draw);
  fit();
  renderer.render(scene, camera);
  return {
    setView(next: StudioView) {
      view = next;
      fit();
    },
    rotate(amount: number) {
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), amount);
      controls.update();
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      controls.dispose();
      document.removeEventListener("visibilitychange", draw);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.remove();
      disposeModel();
      environment.dispose();
      renderer.dispose();
    },
  };
}
