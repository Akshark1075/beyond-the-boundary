import Box from "@mui/material/Box";
import DrawerAppBar from "../Components/Navbar";
import homecover from "../assets/homecover.webp";
import { Typography } from "@mui/material";
import MatchCard from "../Components/MatchCard";
//Home Page
const Home = () => {
  return (
    // @ts-ignore: Unreachable code error
    <Box className={"h-full bg-black sm:flex overflow-y-auto "}>
      <DrawerAppBar />;
      <Box className="mt-14 sm:mt-28 w-full p-4 ">
        <img src={homecover} width="100%" alt="Homecover" />
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
