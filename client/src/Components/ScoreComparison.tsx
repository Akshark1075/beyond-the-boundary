import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { GetScorecard } from "../types/getScorecard";
import { Skeleton } from "@mui/material";
import { Rnd, RndResizeCallback } from "react-rnd";
import WithTitleBar from "./TitleBar";
import React from "react";
import { DraggableEvent } from "react-draggable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const fetchOvers = async (matchId: string): Promise<Response> => {
  try {
    const res = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`,
      {
        headers: {
          "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
          "x-rapidapi-key":
            "71c49e5ccfmsh4e7224d6d7fbb0ap11128bjsnd1bdf317c93e",
        },
      }
    );
    if (!res.ok) {
      throw new Error("First API call failed");
    }
    return res;
  } catch (error) {
    const fallbackRes = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`,
      {
        headers: {
          "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
          "x-rapidapi-key":
            "34bc3eb86dmsh62c3088fe607e6fp186023jsnf139d6bf65e7",
          // "7a2ed3513cmsh433f85b7a4ab9f8p1883cfjsn1b4c80608f1b",
        },
      }
    );
    if (!fallbackRes.ok) {
      throw new Error("Both API calls failed");
    }
    return fallbackRes;
  }
};

const Scorecomparison = ({
  matchId,
  x,
  y,
}: {
  matchId: string;
  x: number;
  y: number;
}) => {
  const { isLoading, error, data } = useQuery<GetScorecard>({
    queryKey: ["scoresData", matchId],
    queryFn: useCallback(
      () => fetchOvers(matchId).then((res) => res.json()),
      [matchId]
    ),
  });

  function generateRandomArray(length: number, total: number) {
    if (length <= 0 || total <= 0) {
      return [];
    }

    let array = Array(length).fill(0);
    let remainingTotal = total;

    for (let i = 0; i < length - 1; i++) {
      let maxVal = Math.min(35, remainingTotal - (length - 1 - i));
      array[i] = Math.floor(Math.random() * (maxVal + 1));
      remainingTotal -= array[i];
    }

    array[length - 1] = remainingTotal; // Ensure the total sum is reached

    // Shuffle the array to randomize the distribution
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    let score = 0;
    return array.map((x) => {
      score += x;
      return score;
    });
  }
  const chartData = {
    labels: Array.from(
      {
        length: Math.floor(
          data?.scoreCard[1]?.scoreDetails?.overs ??
            data?.scoreCard[0]?.scoreDetails?.overs ??
            0
        ),
      },
      (v, i) => i + 1
    ), // X-axis labels
    datasets: [
      {
        label: data?.scoreCard[0]?.batTeamDetails.batTeamName ?? "Team 1",
        data: generateRandomArray(
          Math.floor(data?.scoreCard[0]?.scoreDetails?.overs ?? 0),
          data?.scoreCard[0]?.scoreDetails?.runs ?? 0
        ), // Y-axis data
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: data?.scoreCard[1]?.batTeamDetails.batTeamName ?? "Team 2",
        data: generateRandomArray(
          Math.floor(data?.scoreCard[1]?.scoreDetails?.overs ?? 0),
          data?.scoreCard[1]?.scoreDetails?.runs ?? 0
        ), // Y-axis data
        borderColor: "rgba(255, 192, 192, 1)",
        backgroundColor: "rgba(255, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Runs",
        },

        ticks: {
          stepSize: 20, // Adjust this value to set the step size for y-axis ticks
          autoSkip: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Overs",
        },
      },
    },
    legend: {
      display: false,
    },
    plugins: {
      title: {
        display: true,
        text: "Scorecard Comparison",
      },
    },
  };
  const componentRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(350);
  const [position, setPosition] = useState({ x: x, y: y });
  const handleResize: RndResizeCallback = (
    e,
    direction,
    ref,
    delta,
    position
  ) => {
    if (ref && ref.style) {
      const newWidth = parseInt(ref.style.width, 10);
      const newHeight = parseInt(ref.style.height, 10);
      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setPosition({ x: d.x, y: d.y });
  };
  return (
    <Rnd
      size={{ width: width, height: height }}
      position={position}
      onResize={handleResize}
      onDragStop={handleDragStop}
      minWidth={350}
      minHeight={350}
      bounds="window"
    >
      <div style={{ width: `${width}px` }}>
        <WithTitleBar
          title="Score Comparison"
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
        >
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
            ref={componentRef}
          >
            {isLoading || error ? (
              <>
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
              </>
            ) : (
              <Line
                data={chartData}
                options={{ ...options, maintainAspectRatio: false }}
              />
            )}
          </div>
        </WithTitleBar>
      </div>
    </Rnd>
  );
};

export default Scorecomparison;
