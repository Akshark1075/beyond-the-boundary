import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
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
import { Skeleton } from "@mui/material";
import WithTitleBar from "./WithTitleBar";
import React from "react";
import { Rnd, RndResizeCallback } from "react-rnd";
import { DraggableEvent } from "react-draggable";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
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

const RunsPerOver = React.memo(
  ({
    matchId,
    selections,
    setSelection,
  }: {
    matchId: string;

    selections: SelectedOption[];
    setSelection: (option: SelectedOption[]) => void;
  }) => {
    const { isLoading, error, data } = useQuery<GetScorecard>({
      queryKey: ["scoresData", matchId],
      queryFn: useCallback(
        () => fetchOvers(matchId).then((res) => res.json()),
        [matchId]
      ),
    });
    const { x: randomX, y: randomY } = getRandomCoordinates();
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
    } = storedRunsPerOver ?? {};
    if (!storedRunsPerOver) {
      const newItems = [
        ...selections,
        {
          name: `Runs per over`,
          x: x,
          y: y,
          width: width,
          height: height,
        },
      ];
      setSelection(newItems);
      saveArrayToLocalStorage("selectedOptions", newItems);
    }

    const setPosition = (x: number, y: number) => {
      const newSelections = [...selections];
      const option = newSelections.find((s) => s.name === `Runs per over`);
      if (option) {
        option.x = x;
        option.y = y;
        setSelection(newSelections);
        saveArrayToLocalStorage("selectedOptions", newSelections);
      }
    };

    const setSize = (w: number, h: number) => {
      const newSelections = [...selections];
      const option = newSelections.find((s) => s.name === `Runs per over`);
      if (option) {
        option.width = w;
        option.height = h;
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
      if (ref && ref.style) {
        const newWidth = parseInt(ref.style.width, 10);
        const newHeight = parseInt(ref.style.height, 10);
        setSize(newWidth, newHeight);
      }
    };

    const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
      setPosition(d.x, d.y);
    };

    return (
      <Rnd
        size={{ width: width, height: height }}
        position={{ x: x ?? randomX, y: y ?? randomY }}
        onResize={handleResize}
        onDragStop={handleDragStop}
        minWidth={350}
        minHeight={350}
        bounds="window"
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
              {isLoading || error ? (
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
