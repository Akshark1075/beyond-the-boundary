import "./styles/App.css";

import Home from "./views/Home";
import { useRoutes } from "react-router-dom";
import XRCube from "./Components/XRCube";
import ShowPage from "./views/ShowPage";
function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    { path: "matches/:matchId", element: <ShowPage /> },
    { path: "matches", element: <XRCube /> },
  ]);

  return element;
}

export default App;
