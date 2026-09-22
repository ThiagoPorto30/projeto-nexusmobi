"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentRef,
} from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { Box3, Group, Loader, PerspectiveCamera, Vector3 } from "three";
import { fitBikeCamera } from "@/lib/bike-camera";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";

/** Reuses the Flexmobi geometry unchanged. Gzip transport is ~3.9 MB instead of ~10.4 MB. */
class BikeAssetLoader extends Loader<GLTF> {
  load(
    url: string,
    onLoad: (gltf: GLTF) => void,
    _progress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void,
  ): void {
    const compressed = typeof DecompressionStream === "function";
    fetch(`${url}.${compressed ? "bin" : "glb"}`)
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Model download failed: ${response.status}`);
        const buffer =
          compressed && response.body
            ? await new Response(
                response.body.pipeThrough(new DecompressionStream("gzip")),
              ).arrayBuffer()
            : await response.arrayBuffer();
        return new GLTFLoader(this.manager).parseAsync(buffer, "/models/");
      })
      .then(onLoad)
      .catch((error: unknown) => onError?.(error));
  }
}

interface Props {
  visible: boolean;
  reducedMotion: boolean;
  orientation: { angle: number; reset: number };
  onReady: () => void;
  onError: () => void;
}
function Model(props: Props) {
  const gltf = useLoader(BikeAssetLoader, "/models/v20-brake-pro");
  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const center = new Box3().setFromObject(clone).getCenter(new Vector3());
    clone.position.sub(center);
    return clone;
  }, [gltf.scene]);
  const root = useRef<Group>(null);
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const previousReset = useRef(-1);
  const fitted = useRef(false);
  const { gl, scene, camera, invalidate, size } = useThree();
  const { angle, reset } = props.orientation;
  const { onReady } = props;

  useLayoutEffect(() => {
    if (
      !root.current ||
      !controls.current ||
      !(camera instanceof PerspectiveCamera)
    )
      return;
    root.current.updateWorldMatrix(true, true);
    const restore = !fitted.current || previousReset.current !== reset;
    fitBikeCamera(
      camera,
      controls.current,
      new Box3().setFromObject(root.current),
      restore,
    );
    previousReset.current = reset;
    fitted.current = true;
    invalidate();
  }, [camera, invalidate, size.width, size.height, angle, reset]);

  // Only reveal after fitting the loaded geometry and drawing an actual frame.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      gl.render(scene, camera);
      onReady();
    });
    return () => cancelAnimationFrame(frame);
  }, [gl, scene, camera, onReady]);
  return (
    <>
      <group ref={root} rotation={[0, angle, 0]}>
        <primitive object={model} dispose={null} />
      </group>
      <OrbitControls
        ref={controls}
        makeDefault
        enabled={props.visible}
        enablePan={false}
        enableZoom={false}
        enableDamping={!props.reducedMotion}
        dampingFactor={0.09}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.35}
        maxPolarAngle={Math.PI * 0.52}
      />
    </>
  );
}

function Studio({ onError }: { onError: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onError]);
  return (
    <>
      <Environment resolution={128} frames={1} environmentIntensity={1.1}>
        <Lightformer
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
          intensity={2}
        />
        <Lightformer
          position={[-4, 2, 3]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[6, 4, 1]}
          intensity={3}
        />
        <Lightformer
          position={[4, 1, -3]}
          rotation={[0, (-Math.PI * 2) / 3, 0]}
          scale={[6, 4, 1]}
          intensity={2}
        />
      </Environment>
      <ambientLight intensity={0.75} />
      <directionalLight position={[-2, 4, 4]} intensity={3} color="#fff8e9" />
      <directionalLight position={[3, 3, -3]} intensity={4} color="#ddffc0" />
    </>
  );
}

export default function BikeScene(props: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={props.visible ? "demand" : "never"}
      camera={{ position: [-0.8, 0.35, 3.4], fov: 32, near: 0.01, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "default" }}
      fallback={null}
    >
      <Studio onError={props.onError} />
      <Suspense fallback={null}>
        <Model {...props} />
      </Suspense>
    </Canvas>
  );
}
