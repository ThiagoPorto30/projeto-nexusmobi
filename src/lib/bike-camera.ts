import { Box3, MathUtils, PerspectiveCamera, Vector3 } from "three";
interface CameraControls {
  target: Vector3;
  update: () => unknown;
}

const initialDirection = new Vector3(-0.8, 0.35, 3.4).normalize();

/** Fit every bounding-box corner in camera space, including perspective depth.
 * This avoids a loading-time snapshot and works again at every viewport size. */
export function fitBikeCamera(
  camera: PerspectiveCamera,
  controls: CameraControls,
  bounds: Box3,
  reset: boolean,
): void {
  const center = bounds.getCenter(new Vector3());
  const direction = reset
    ? initialDirection.clone()
    : camera.position.clone().sub(controls.target).normalize();
  const right = new Vector3().crossVectors(camera.up, direction).normalize();
  const up = new Vector3().crossVectors(direction, right).normalize();
  const tangent = Math.tan(MathUtils.degToRad(camera.fov / 2));
  let distance = 0;
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const corner = new Vector3(x, y, z).sub(center);
        const depth = corner.dot(direction);
        distance = Math.max(
          distance,
          depth +
            (Math.abs(corner.dot(right)) / (tangent * camera.aspect)) * 1.12,
          depth + (Math.abs(corner.dot(up)) / tangent) * 1.12,
        );
      }
    }
  }
  controls.target.copy(center);
  camera.position.copy(center).addScaledVector(direction, distance);
  camera.lookAt(center);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  controls.update();
}
