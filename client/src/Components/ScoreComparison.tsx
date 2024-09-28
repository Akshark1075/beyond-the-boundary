import { useContext, useEffect, useRef, useState } from "react";
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
import {
  AppBar,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Rnd, RndResizeCallback } from "react-rnd";
import WithTitleBar from "./WithTitleBar";
import React from "react";
import { DraggableEvent } from "react-draggable";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import ARLineGraph from "./ARLineGraph";
import { Box } from "@react-three/drei";
import { PositionContext } from "./PlaneWithContent";
import getUpdatedZIndex from "../utilities/getUpdatedZIndex";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Scorecomparison = ({
  data,
  selections,
  setSelection,
  isARMode,
  isLoading,
  isError,
}: {
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
  data: GetScorecard | undefined;
  isLoading: boolean;
  isError: boolean;
}) => {
  const arPos = useContext(PositionContext);
  const [isDragging, setIsDragging] = useState(false);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const storedScoreComparison = selections.find(
    (s) => s.name === `Scorecard comparison`
  );
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

  const team1ScoreRef = useRef(
    generateRandomArray(
      Math.floor(data?.scoreCard[0]?.scoreDetails?.overs ?? 0),
      data?.scoreCard[0]?.scoreDetails?.runs ?? 0
    )
  );
  const team2ScoreRef = useRef(
    generateRandomArray(
      Math.floor(data?.scoreCard[1]?.scoreDetails?.overs ?? 0),
      data?.scoreCard[1]?.scoreDetails?.runs ?? 0
    )
  );
  useEffect(() => {
    team1ScoreRef.current = generateRandomArray(
      Math.floor(data?.scoreCard[0]?.scoreDetails?.overs ?? 0),
      data?.scoreCard[0]?.scoreDetails?.runs ?? 0
    );
    team2ScoreRef.current = generateRandomArray(
      Math.floor(data?.scoreCard[1]?.scoreDetails?.overs ?? 0),
      data?.scoreCard[1]?.scoreDetails?.runs ?? 0
    );
  }, [data]);
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
        data: team1ScoreRef.current, // Y-axis data
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: data?.scoreCard[1]?.batTeamDetails.batTeamName ?? "Team 2",
        data: team2ScoreRef.current, // Y-axis data
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
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
    zIndex = 1,
  } = storedScoreComparison ?? {};

  if (!storedScoreComparison && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Scorecard comparison`,
        x: x,
        y: y,
        width: width,
        height: height,
        zIndex: 1,
      },
    ];
    setSelection(newItems);
    saveArrayToLocalStorage("selectedOptions", newItems);
  }

  const setPosition = (x: number, y: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Scorecard comparison`);
    if (option && !isMobile) {
      option.x = x;
      option.y = y;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };

  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Scorecard comparison`);
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  const handleResize: RndResizeCallback = (
    e,
    direction,
    ref,
    delta,
    position
  ) => {
    if (ref && ref.style && !isMobile) {
      const newWidth = parseInt(ref.style.width, 10);
      const newHeight = parseInt(ref.style.height, 10);
      setSize(newWidth, newHeight);
    }
  };
  const handleDragStart = (e: DraggableEvent) => {
    setIsDragging(true);
  };
  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setIsDragging(false);
    setPosition(d.x, d.y);
  };
  const handleResizeStart = (e: DraggableEvent) => {
    setIsDragging(true);
  };
  const handleResizeStop = (e: DraggableEvent) => {
    setIsDragging(false);
  };
  if ((isLoading || isError) && isARMode) return <Box></Box>;

  return isARMode ? (
    <ARLineGraph
      data={chartData.datasets}
      position={[arPos?.x, arPos?.y, arPos?.z]}
    />
  ) : isMobile ? (
    <div
      style={{
        width: `${window.screen.width}px`,
        marginBottom: "1rem",
        overflowY: "scroll",
      }}
      className={isARMode ? "bg-white" : ""}
    >
      <AppBar
        position="static"
        style={{ background: "#303036" }}
        className="grow"
      >
        <Toolbar variant="dense" className="px-2 min-h-8">
          <Typography
            component="h6"
            className="grow cursor-pointer select-none text-white"
          >
            {"Score Comparison"}
          </Typography>
        </Toolbar>
      </AppBar>

      <div
        style={{
          width: `${window.screen.width}px`,
          height: `${window.screen.height}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          overflow: "auto",
        }}
        ref={componentRef}
        className={isARMode ? "bg-white" : ""}
      >
        {isLoading || isError ? (
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
    </div>
  ) : (
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x ?? randomX, y: y ?? randomY }}
      onDragStart={handleDragStart}
      onResize={handleResize}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      minWidth={350}
      minHeight={350}
      bounds="window"
      style={{ zIndex: isDragging ? 999999 : zIndex }}
    >
      <div style={{ width: `${width}px` }}>
        <WithTitleBar
          title="Score comparison"
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
          storedKey="Scorecard comparison"
          selections={selections}
          setSelection={setSelection}
        >
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              overflow: "auto",
            }}
            ref={componentRef}
          >
            {isLoading || isError ? (
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
