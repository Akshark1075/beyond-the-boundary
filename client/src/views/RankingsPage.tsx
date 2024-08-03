import { Box } from "@mui/material";
import ICCRankings from "../Components/ICCRankings";
import DrawerAppBar from "../Components/Navbar";

const Rankings = () => {
  return (
    // @ts-ignore: Unreachable code error
    <Box className={"h-full bg-black sm:flex overflow-y-auto"}>
      <DrawerAppBar />;
      <Box className="mt-14 sm:mt-28 w-full p-4">
        <ICCRankings />
      </Box>
    </Box>
  );
};
export default Rankings;
