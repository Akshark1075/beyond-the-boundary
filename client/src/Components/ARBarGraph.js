import React, { useRef, useEffect } from "react";
import { Box, Line, Text } from "@react-three/drei";

const BarGraph = ({ data }) => {
  const barWidth = 0.1;
  const spacing = 0.02;

  return (
    <>
      {data.map((value, index) => {
        const height = value / 20;

        const barPosition = [
          index * (barWidth + spacing) -
            (data.length * (barWidth + spacing)) / 2 +
            barWidth / 2,
          height / 2,
          0,
        ];
        return (
          <Box
            key={index}
            args={[barWidth, height, barWidth]}
            position={barPosition}
          >
            <meshStandardMaterial attach="material" color="steelblue" />
          </Box>
        );
      })}
    </>
  );
};

const ARBarGraph = ({ data, position }) => {
  const barWidth = 0.1;
  const spacing = 0.02;

  const graphWidth = !!data ? (data.length * (barWidth + spacing)) / 2 : 5;

  return (
    <>
      <mesh>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial transparent={true} color={"none"} opacity={0} />
      </mesh>
      {!!data ? (
        <BarGraph data={data} />
      ) : (
        <Text
          position={[position.x, position.y + 1, position.z]}
          fontSize={0.1}
          color="white"
          fontWeight="bold"
        >
          Loading
        </Text>
      )}

      {/* Vertical axis - Replacing Line with Mesh */}
      <mesh position={[-0.05 - graphWidth, 1, 0]}>
        <boxGeometry args={[0.01, 2, 0.01]} /> {/* Thin vertical box */}
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Horizontal axis - Replacing Line with Mesh */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[graphWidth * 2 + 0.1, 0.01, 0.01]} />
        {/* Thin horizontal box */}
        <meshBasicMaterial color="white" />
      </mesh>

      <Text
        position={[-0.15 - graphWidth, 1.2, 0]}
        fontSize={0.1}
        color="white"
        fontWeight="bold"
      >
        Runs
      </Text>
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.1}
        color="white"
        fontWeight="bold"
      >
        Overs
      </Text>
      {[2, 4, 6, 8, 10].map((tick) => (
        <Line
          key={tick}
          points={[
            [-0.05 - graphWidth, tick / 20, 0],
            [-0.05 - graphWidth, tick / 20, 0],
          ]}
          color="white"
          lineWidth={1}
        />
      ))}
      {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((tick) => (
        <Text
          key={tick}
          position={[-0.15 - graphWidth, tick / 20, 0]}
          fontSize={0.08}
          color="white"
          fontWeight="bold"
        >
          {tick}
        </Text>
      ))}
      {data?.map((_, index) => (
        <Text
          key={index}
          position={[
            -0.05 + index * (barWidth + spacing) - graphWidth,
            -0.1,
            0,
          ]}
          fontSize={0.08}
          color="white"
          fontWeight="bold"
        >
          {index + 1}
        </Text>
      ))}
      <Text
        position={[-0.15 - graphWidth, -0.1, 0]}
        fontSize={0.08}
        color="white"
        fontWeight="bold"
      >
        0
      </Text>
    </>
  );
};

export default ARBarGraph;
