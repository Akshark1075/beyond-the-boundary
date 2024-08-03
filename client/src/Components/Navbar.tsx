import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import logo from "../assets/logo1.png";
import { useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  { title: "Live Scores", path: "/" },
  { title: "News", path: "/news" },
  { title: "Rankings", path: "/rankings" },
];

export default function DrawerAppBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = // prettier-ignore
    (
      // @ts-ignore: Unreachable code error
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <img src={logo} className="p-4" />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <Link to={item.path}>
                <ListItemButton sx={{ textAlign: "center" }}>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <CssBaseline />
      <AppBar component="nav" style={{ background: "black", color: "white" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            size="large"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon sx={{ fontSize: "2rem" }} />
          </IconButton>

          <Box sx={{ display: { md: "flex", flexGrow: 1 } }}>
            <Link to="/">
              <img src={logo} className="my-8 w-96 mr-12 " alt="logo" />
            </Link>
            {!isSmallScreen &&
              navItems.map((item) => (
                <Button
                  key={item.title}
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "16px", lg: "20px" },
                    marginX: "24px",
                  }}
                >
                  {<Link to={item.path}>{item.title}</Link>}
                </Button>
              ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "black",
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}
