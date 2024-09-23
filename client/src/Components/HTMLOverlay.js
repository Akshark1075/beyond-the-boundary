import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function Html({
  children,
  width,
  height,
  color = "transparent",
  sceneSize,

  image,
}) {
  const { gl } = useThree();

  const texture = useTexture(image);

  const size = useMemo(() => {
    const imageAspect = texture.image.width / texture.image.height;
    let w = width || sceneSize.width;
    let h = height || w / imageAspect;

    if (width === undefined && height !== undefined) {
      w = height * imageAspect;
    }

    return { width: w, height: h };
  }, [texture, width, height, sceneSize]);

  useMemo(() => {
    texture.matrixAutoUpdate = false;
    const aspect = size.width / size.height;
    const imageAspect = texture.image.width / texture.image.height;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearFilter;
    if (aspect < imageAspect) {
      texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
    } else {
      texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
    }
  }, [texture, size]);

  return (
    <HTMLContent width={size.width} height={size.height} texture={texture} />
  );
}
const HTMLContent = ({ width, height, texture }) => {
  const darkenShader = {
    uniforms: {
      map: { value: texture },
      darkenAmount: { value: 1.3 }, // Adjust this value to change how dark the texture is
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
      uniform float darkenAmount;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(map, vUv);
        color.rgb *= darkenAmount; // Darken the texture
        gl_FragColor = color;
      }
    `,
  };
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        attach="material"
        args={[darkenShader]}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
};
