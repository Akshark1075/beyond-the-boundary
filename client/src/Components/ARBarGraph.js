import React from "react";
import { Box, Line, Text, Plane } from "@react-three/drei";

const BarGraph = ({ data }) => {
  const barWidth = 0.1; // Width of each bar
  const spacing = 0.02; // Space between bars

  return (
    <>
      {data.map((value, index) => {
        const height = value / 20; // Scale the height for better visibility
        return (
          <Box
            key={index}
            args={[barWidth, height, barWidth]} // Width, Height, Depth
            position={[
              index * (barWidth + spacing) -
                (data.length * (barWidth + spacing)) / 2 +
                barWidth / 2 +
                0.5, // Adjust position to center the bars
              height / 2, // Position the bar on the y-axis
              0, // Z position
            ]}
          >
            <meshStandardMaterial attach="material" color="steelblue" />
          </Box>
        );
      })}
    </>
  );
};

const ARBarGraph = ({ data, position = [0, 1, -2] }) => {
  const barWidth = 0.1; // Width of each bar
  const spacing = 0.02; // Space between bars

  return (
    <>
      <ambientLight />
      <Plane args={[1, 1]} position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial attach="material" color="white" />
      </Plane>
      <BarGraph data={data} />
      <Line
        points={[
          [-1.3, 0, 0],
          [-1.3, 2, 0],
        ]}
        color="white"
        lineWidth={2}
      />{" "}
      <Line
        points={[
          [-1.2, 0, 0],
          [1, 0, 0],
        ]}
        color="white"
        lineWidth={2}
      />{" "}
      <Text
        position={[-1.6, 1, 0]}
        fontSize={0.1}
        color="white"
        fontWeight="bold"
      >
        Runs
      </Text>{" "}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.1}
        color="white"
        fontWeight="bold"
      >
        Overs
      </Text>{" "}
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
          position={[-1.2, tick / 20, 0]}
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
          position={[
            -1.2 + index * (barWidth + spacing), // Align with the bars
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
        position={[-1.2, -0.1, 0]}
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
