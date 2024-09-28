import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { GetScorecard } from "../types/getScorecard";
import {
  AppBar,
  Card,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WithTitleBar from "./WithTitleBar";
import React from "react";
import { Rnd, RndResizeCallback } from "react-rnd";
import { DraggableEvent } from "react-draggable";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import ARBarGraph from "./ARBarGraph";
import { Box } from "@react-three/drei";
import { PositionContext } from "./PlaneWithContent";
import getUpdatedZIndex from "../utilities/getUpdatedZIndex";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RunsPerOver = React.memo(
  ({
    matchId,
    selections,
    setSelection,
    isARMode,
    data,
    isLoading,
    isError,
  }: {
    matchId: string;

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
    const storedRunsPerOver = selections.find(
      (s) => s.name === `Runs per over`
    );
    const generateRandomArray = useMemo(
      () => (length: number, total: number) => {
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

        return array;
      },
      []
    );

    const chartData = useMemo(() => {
      if (!data?.scoreCard) {
        return { labels: [], datasets: [] };
      }

      const overs =
        data?.scoreCard[data.scoreCard.length - 1]?.scoreDetails?.overs ?? 0;
      const runs =
        data?.scoreCard[data.scoreCard.length - 1]?.scoreDetails?.runs ?? 0;

      return {
        labels: Array.from({ length: Math.floor(overs) }, (_, i) => i + 1),
        datasets: [
          {
            label: "Runs per Over",
            data: generateRandomArray(Math.floor(overs), runs),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      };
    }, [data, generateRandomArray]);

    const options = useMemo(
      () => ({
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Runs",
            },
            ticks: {
              stepSize: 2,
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
            text: "Runs per over",
          },
        },
      }),
      []
    );

    const componentRef = React.useRef<HTMLDivElement>(null);
    const {
      x = randomX,
      y = randomY,
      width = 350,
      height = 350,
      zIndex = 1,
    } = storedRunsPerOver ?? {};

    if (!storedRunsPerOver && !isMobile && !isARMode) {
      const newItems = [
        ...selections,
        {
          name: `Runs per over`,
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
      const option = newSelections.find((s) => s.name === `Runs per over`);
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
      const option = newSelections.find((s) => s.name === `Runs per over`);
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
      <ARBarGraph
        data={data ? chartData.datasets[0].data : undefined}
        position={arPos}
      />
    ) : isMobile ? (
      <Card
        style={{
          width: `${window.screen.width}px`,
          marginBottom: "1rem",
          overflowY: "scroll",
        }}
      >
        <AppBar
          position="static"
          style={{ background: "#303036" }}
          className="grow"
        >
          <Toolbar variant="dense" className="px-2 min-h-8">
            <Typography
              component="h6"
              className="grow cursor-pointer select-none"
            >
              {"Runs per over"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div
          style={{
            width: `${window.screen.width}px`,
            height: `${window.innerHeight - 110}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            overflow: "auto",
          }}
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
            <Bar
              data={chartData}
              options={{ ...options, maintainAspectRatio: false }}
            />
          )}
        </div>
      </Card>
    ) : (
      <Rnd
        size={{ width: width, height: height }}
        position={{ x: x ?? randomX, y: y ?? randomY }}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        onDragStart={handleDragStart}
        onDragStop={(e, data) => {
          const minY = 0; // You can set this to any value to add padding from the top.
          if (data.y < minY) {
            handleDragStop(e, { ...data, y: minY });
          } else {
            handleDragStop(e, data);
          }
        }}
        minWidth={350}
        minHeight={350}
        style={{ zIndex: isDragging ? 999999 : zIndex }}
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          bottomLeft: true,
          bottomRight: true,
          topLeft: true,
          topRight: true,
        }}
      >
        <div>
          <WithTitleBar
            title="Runs per over"
            width={componentRef.current?.getBoundingClientRect().width ?? width}
            height={
              componentRef.current?.getBoundingClientRect().height ?? height
            }
            storedKey="Runs per over"
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
                <Bar
                  data={chartData}
                  options={{ ...options, maintainAspectRatio: false }}
                />
              )}
            </div>
          </WithTitleBar>
        </div>
      </Rnd>
    );
  }
);

export default RunsPerOver;
