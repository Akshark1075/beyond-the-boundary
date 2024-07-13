import React, { ReactNode, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import "../styles/index.css";
import NewWindow from "react-new-window";

const WithTitleBar = ({
  title,
  children,
  width,
  height,
}: {
  title: string;
  width: number;
  height: number;
  children: ReactNode;
}) => {
  const [isNewWindow, setOpenWindow] = useState(false);
  const [isShowingComponent, setIsShowingComponent] = useState(true);
  const handleOpenNewWindow = () => {
    setOpenWindow(true);
  };
  const handleMinimize = () => {
    console.log("Minimize button clicked");
  };

  const handleMaximize = () => {
    console.log("Maximize button clicked");
  };

  const handleClose = () => {
    setIsShowingComponent(false);
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
              onClick={handleMaximize}
            >
              <CropSquareIcon />
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              className="p-2"
              onClick={handleClose}
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
