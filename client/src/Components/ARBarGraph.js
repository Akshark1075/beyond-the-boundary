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
            barWidth / 2 -
            0.7,
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
  const barPositionRef = useRef(position);
  useEffect(() => {
    barPositionRef.current = position;
  }, [position]);
  return (
    <>
      <mesh position={barPositionRef.position}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial transparent={true} color={"none"} opacity={0} />
      </mesh>
      <BarGraph data={data} position={barPositionRef.current} />
      <mesh position={barPositionRef.position}>
        <Line
          points={[
            [-1.3, 0, 0],
            [-1.3, 2, 0],
          ]}
          color="white"
          lineWidth={2}
        />
        <Line
          points={[
            [-1.2, 0, 0],
            [1, 0, 0],
          ]}
          color="white"
          lineWidth={2}
        />
        <Text
          position={[-1.6, 1.2, 0]}
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
              [-1.4, tick / 20, 0],
              [-1.3, tick / 20, 0],
            ]}
            color="white"
            lineWidth={1}
          />
        ))}
        {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((tick) => (
          <Text
            key={tick}
            position={[-1.5, tick / 20, 0]}
            fontSize={0.08}
            color="white"
            fontWeight="bold"
          >
            {tick}
          </Text>
        ))}
        {data.map((_, index) => (
          <Text
            key={index}
            position={[-1.2 + index * (barWidth + spacing), -0.1, 0]}
            fontSize={0.08}
            color="white"
            fontWeight="bold"
          >
            {index + 1}
          </Text>
        ))}
        <Text
          position={[-1.2, -0.1, 0]}
          fontSize={0.08}
          color="white"
          fontWeight="bold"
        >
          0
        </Text>
      </mesh>
    </>
  );
};

export default ARBarGraph;
