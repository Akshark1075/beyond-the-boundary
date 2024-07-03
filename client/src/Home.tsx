import Box from "@mui/material/Box";
import DrawerAppBar from "./Components/Navbar";
import homecover from "../src/assets/homecover.jpg";
import { Typography } from "@mui/material";
import MatchCard from "./Components/MatchCard";
const Home = () => {
  console.log("ff");
  return (
    // @ts-ignore: Unreachable code error
    <Box className={"h-full bg-black sm:flex overflow-y-auto"}>
      <DrawerAppBar />;
      <Box className="mt-28 w-full">
        <img src={homecover} width="100%" />
        <Typography variant="h5" sx={{ color: "white", marginY: "1rem" }}>
          Live Matches
        </Typography>
        <MatchCard type="live" />
        <Typography variant="h5" sx={{ color: "white", marginY: "1rem" }}>
          Upcoming Matches
        </Typography>
        <MatchCard type="upcoming" />
        <Typography variant="h5" sx={{ color: "white", marginY: "1rem" }}>
          Recent Matches
        </Typography>
        <MatchCard type="recent" />
      </Box>
    </Box>
  );
};
export default Home;
