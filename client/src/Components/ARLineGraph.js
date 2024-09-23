import React, { useRef, useEffect } from "react";
import { Line, Text } from "@react-three/drei";
import { Vector3 } from "three";

const ARLineGraph = ({ data, position }) => {
  const maxRuns = Math.max(...data.map((team) => Math.max(...team.data)));
  const minRuns = Math.min(...data.map((team) => Math.min(...team.data))); // Get the minimum runs
  const oversCount = data[0].data.length;
  const linePositionRef = useRef(position);
  useEffect(() => {
    linePositionRef.current = position;
  }, [position]);
  return (
    <>
      <mesh position={linePositionRef.position}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial transparent={true} color={"none"} opacity={0} />
      </mesh>
      <mesh position={linePositionRef.position}>
        {data.map((team, teamIndex) => {
          const points = team.data.map((value, index) => {
            const x = (index / (oversCount - 1)) * 2 - 1; // Scale to [-1, 1]
            const y = ((value - minRuns) / (maxRuns - minRuns)) * 2; // Scale to [0, 2] based on min and max
            return new Vector3(x, y, 0);
          });

          return (
            <Line
              key={teamIndex}
              points={points.map((point) => [point.x, point.y, point.z])}
              color={team.backgroundColor || "white"} // Default to white if color is not defined
              lineWidth={2}
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
          position={[-1.5, 0, 0]} // Moved to the left
          fontSize={0.1}
          color="white"
          fontWeight="bold"
        >
          Runs
        </Text>

        {/* X-axis labels for Overs  */}
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
                -1.5,
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
