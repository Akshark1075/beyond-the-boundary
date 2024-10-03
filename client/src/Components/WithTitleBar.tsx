import React, { ReactNode, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import "../styles/index.css";
import NewWindow from "react-new-window";
import { deleteFromLocalStorage } from "../utilities/localStorageUtils";
import { SelectedOption } from "../views/ShowPage";
//Title bar component for displaying controls
const WithTitleBar = ({
  title,
  children,
  width,
  height,
  storedKey,
  selections,
  setSelection,
}: {
  title: string;
  width: number;
  height: number;
  children: ReactNode;
  storedKey: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}) => {
  const [isNewWindow, setOpenWindow] = useState(false);
  const [isShowingComponent, setIsShowingComponent] = useState(true);
  const handleOpenNewWindow = () => {
    setOpenWindow(true);
  };

  const onClose = () => {
    deleteFromLocalStorage(storedKey);
    setIsShowingComponent(false);
    setSelection(selections.filter((s) => s.name !== storedKey));
  };

  return isShowingComponent ? (
    !isNewWindow ? (
      <div style={{ width: width }}>
        <AppBar
          position="static"
          color="default"
          className="grow"
          style={{ width: width }}
        >
          <Toolbar variant="dense" className="px-2 min-h-8">
            <Typography
              variant="h6"
              className="grow cursor-pointer select-none"
            >
              {title}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              className="p-2"
              onClick={handleOpenNewWindow}
            >
              <OpenInNewIcon />
            </IconButton>

            <IconButton
              edge="end"
              color="inherit"
              className="p-2"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {children}
        <AppBar
          position="static"
          color="default"
          className="grow"
          style={{ width: width, height: "20px" }}
        />
      </div>
    ) : (
      //Opens the component in new window
      <NewWindow
        title={title}
        features={{ width: width, height: height }}
        copyStyles
      >
        {children}
      </NewWindow>
    )
  ) : (
    <></>
  );
};

export default WithTitleBar;
