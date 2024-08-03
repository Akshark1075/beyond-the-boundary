import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import fetchWithRetry from "../api/fetch";
import { GetNews } from "../types/getNews";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import DrawerAppBar from "../Components/Navbar";
import { Link } from "react-router-dom";
import getTimeAgo from "../utilities/getTimeAgo";

const News = () => {
  const fetchNews = async (): Promise<GetNews> => {
    const res = await fetchWithRetry(
      `https://cricbuzz-cricket.p.rapidapi.com/news/v1/index`
    );
    return res;
  };
  const { isLoading, isError, data } = useQuery<GetNews>({
    queryKey: ["newsData"],
    queryFn: useCallback(() => fetchNews(), []),
  });

  return (
    // @ts-ignore: Unreachable code error
    <Box className={"h-full bg-black flex flex-col  overflow-y-auto"}>
      <DrawerAppBar />
      <Box className="mt-14 sm:mt-28 w-full p-4">
        <Typography
          variant="h4"
          component="div"
          sx={{ color: "white", marginY: "1.5rem" }}
        >
          Live Matches Cricket News and Editorials{" "}
        </Typography>
        {isLoading || isError
          ? new Array(3).fill(null).map((_, i) => (
              <Card className="p-4 my-4 mx-12">
                <CardContent>
                  <Typography variant="body1" component="div">
                    {<Skeleton />}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {<Skeleton />}
                  </Typography>
                  <Typography variant="body1" component="div">
                    {<Skeleton />}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      marginTop: "1rem",
                    }}
                  >
                    {<Skeleton />}
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: "0px" }}>
                  <Button size="small">
                    <Skeleton />
                  </Button>
                </CardActions>
              </Card>
            ))
          : data?.storyList.map((item) => {
              if (item.hasOwnProperty("story")) {
                return (
                  <Card className="p-4 my-4 mx-12">
                    <CardContent>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "black",
                        }}
                      >
                        {`NEWS: ${item.story?.source}`}
                      </Typography>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "black",
                          fontWeight: "800",
                        }}
                      >
                        {item.story?.hline}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {item.story?.intro}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "black",
                          marginTop: "1rem",
                        }}
                      >
                        {getTimeAgo(item.story?.pubTime)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ padding: "0px" }}>
                      <Button size="small" color="primary">
                        <Link
                          to={`https://www.cricbuzz.com/cricket-news/${item.story?.id}/${item.story?.seoHeadline}`}
                        >
                          <b>View</b>
                        </Link>
                      </Button>
                    </CardActions>
                  </Card>
                );
              }
            })}
      </Box>
    </Box>
  );
};

export default News;
