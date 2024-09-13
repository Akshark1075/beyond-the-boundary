import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import domtoimage from "dom-to-image-more"; // Import dom-to-image-more
import { renderToString } from "react-dom/server";

// Prevents dom-to-image-more warnings
// HTMLCanvasElement.prototype.getContext = (function (origFn) {
//   return function (type, attribs) {
//     attribs = attribs || {};
//     attribs.preserveDrawingBuffer = true;
//     return origFn.call(this, type, attribs);
//   };
// })(HTMLCanvasElement.prototype.getContext);

// let container = document.querySelector("#htmlContainer");
// if (!container) {
//   const node = document.createElement("div");
//   node.setAttribute("id", "htmlContainer");
//   node.style.position = "fixed";
//   node.style.opacity = "0";
//   node.style.pointerEvents = "none";
//   document.body.appendChild(node);
//   container = node;
// }

export default function Html({
  children,
  width,
  height,
  color = "transparent",
  sceneSize,

  image,
}) {
  const { camera, size: viewSize, gl } = useThree();

  // const sceneSize = useMemo(() => {
  //   const cam = camera;
  //   const fov = (cam.fov * Math.PI) / 180; // convert vertical fov to radians
  //   const height = 2 * Math.tan(fov / 2) * 5; // visible height
  //   const width = height * (viewSize.width / viewSize.height);
  //   return { width, height };
  // }, [camera, viewSize]);

  // const lastUrl = useRef(null);

  // const [image, setImage] = useState(
  //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  // );
  // const [textureSize, setTextureSize] = useState({ width, height });

  // useEffect(() => {
  //   // const timer = setTimeout(() => {
  //   container.appendChild(node);
  //   domtoimage.toBlob(node, { bgcolor: color }).then((blob) => {
  //     // const { width: blobWidth, height: blobHeight } =
  //     //   node.getBoundingClientRect();
  //     // setTextureSize({ width: blobWidth, height: blobHeight });
  //     if (container.contains(node)) {
  //       container.removeChild(node);
  //     }
  //     if (blob === null) return;
  //     if (lastUrl.current !== null) {
  //       URL.revokeObjectURL(lastUrl.current);
  //     }
  //     const url = URL.createObjectURL(blob);
  //     lastUrl.current = url;
  //     setImage(url);
  //   });
  //   // }, delay);

  //   return () => {
  //     // clearTimeout(timer);
  //     if (container && container.contains(node)) {
  //       container.removeChild(node);
  //     }
  //   };
  // }, [node, viewSize, sceneSize, color, children]);

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
      {/* <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        color={"white"}
      /> */}
      <shaderMaterial
        attach="material"
        args={[darkenShader]}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
};
