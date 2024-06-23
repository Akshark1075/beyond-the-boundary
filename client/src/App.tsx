import "./App.css";

import Home from "./Home";
import { useRoutes } from "react-router-dom";
import XRCube from "./Components/XRCube";
function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    { path: "matches", element: <XRCube /> },
  ]);

  return element;
}

export default App;
