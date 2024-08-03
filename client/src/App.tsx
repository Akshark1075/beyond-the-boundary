import "./styles/App.css";

import Home from "./views/Home";
import { useRoutes } from "react-router-dom";
import XRCube from "./Components/XRCube";
import ShowPage from "./views/ShowPage";
import Rankings from "./views/RankingsPage";
import News from "./views/News";
function App() {
  let element = useRoutes([
    { path: "matches/:matchId", element: <ShowPage /> },
    { path: "matches", element: <XRCube /> },
    { path: "rankings", element: <Rankings /> },
    { path: "news", element: <News /> },
    {
      path: "/",
      element: <Home />,
    },
  ]);

  return element;
}

export default App;
