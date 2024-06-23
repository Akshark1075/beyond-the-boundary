import Box from "@mui/material/Box";
import DrawerAppBar from "./Components/Navbar";
import homecover from "../src/assets/homecover.jpg";
const Home = () => {
  console.log("ff");
  return (
    // @ts-ignore: Unreachable code error
    <Box className={"h-full bg-black sm:flex"}>
      <DrawerAppBar />;
      <Box className="mt-28 w-full">
        <img src={homecover} width="100%" />
      </Box>
    </Box>
  );
};
export default Home;
