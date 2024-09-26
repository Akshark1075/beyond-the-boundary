import React from "react";
import { Vector3 } from "three";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const CustomLine = ({ points, color, position }) => {
  // Create a curve from the points
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => new Vector3(point[0], point[1], point[2]))
  );

  const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.02, 8, false); // Adjust the radius for thickness

  return (
    <mesh position={position}>
      <primitive object={tubeGeometry} />
      <meshBasicMaterial color={color || "white"} />
    </mesh>
  );
};

const ARLineGraph = ({ data, position }) => {
  const maxRuns = Math.max(...data.map((team) => Math.max(...team.data)));
  const minRuns = Math.min(...data.map((team) => Math.min(...team.data)));
  const oversCount = data[0].data.length;

  return (
    <>
      <mesh>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial transparent={true} color={"white"} opacity={0} />
      </mesh>
      <mesh>
        {data.map((team, teamIndex) => {
          const points = team.data.map((value, index) => {
            const x = (index / (oversCount - 1)) * 2 - 1; // Scale to [-1, 1]
            const y = ((value - minRuns) / (maxRuns - minRuns)) * 2; // Scale to [0, 2]
            return [x, y, 0];
          });

          return (
            <CustomLine
              key={teamIndex}
              points={points}
              color={team.backgroundColor || "white"}
            />
          );
        })}

        <Text
          position={[0, -0.3, 0]}
          fontSize={0.1}
          color="white"
          fontWeight="bold"
        >
          Overs
        </Text>
        <Text
          position={[-0.15, 0, 0]} // Moved to the left
          fontSize={0.1}
          color="white"
          fontWeight="bold"
        >
          Runs
        </Text>

        {/* X-axis labels for Overs */}
        {[...Array(Math.ceil(oversCount / 5)).keys()].map((tick) => {
          const oversLabel = (tick + 1) * 5; // Calculate the overs label
          return (
            <Text
              key={tick}
              position={[(oversLabel / (oversCount - 1)) * 2 - 1, -0.1, 0]} // Adjusted to fit the graph horizontally
              fontSize={0.08}
              color="white"
              fontWeight="bold"
            >
              {oversLabel}
            </Text>
          );
        })}

        {/* Y-axis labels for Runs */}
        {[...Array(5).keys()].map((tick) => {
          const yValue = minRuns + (tick + 1) * ((maxRuns - minRuns) / 5); // Calculate the y value for the label
          return (
            <Text
              key={tick}
              position={[
                (5 / (oversCount - 1)) * 2 - 1 - 0.15,
                ((yValue - minRuns) / (maxRuns - minRuns)) * 2,
                0,
              ]}
              fontSize={0.08}
              color="white"
              fontWeight="bold"
            >
              {Math.round(yValue)}
            </Text>
          );
        })}
      </mesh>
    </>
  );
};

export default ARLineGraph;
