import React from "react";
import { Box, IconButton, Card, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface MatchLoadingCardProps {
  showLeftButton: boolean;
  showRightButton: boolean;
}

const MatchLoadingCard: React.FC<MatchLoadingCardProps> = ({
  showLeftButton,
  showRightButton,
}) => {
  const skeletonItems = Array.from(new Array(5)); // Array to hold skeleton cards

  return (
    // @ts-ignore: Unreachable code error
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      {showLeftButton && (
        <IconButton
          sx={{
            position: "absolute",
            left: 0,
            zIndex: 1,
            display: { xs: "none", md: "block" },
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      )}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          py: 1,
          overflow: "auto",
          scrollSnapType: "x mandatory",
          "& > *": {
            scrollSnapAlign: "center",
          },
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        {skeletonItems.map((_, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              minWidth: "450px",
              maxWidth: "450px",
              padding: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "25px",
              }}
            >
              <Skeleton variant="rectangular" width={60} height={60} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">
                  <Skeleton />
                </Typography>
                <Typography variant="body1">
                  <Skeleton />
                </Typography>
                <Typography variant="body2">
                  <Skeleton />
                </Typography>
                <Typography variant="body2">
                  <Skeleton />
                </Typography>
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={2} />
            <Typography variant="body1" sx={{ color: "black" }}>
              <Skeleton />
            </Typography>
          </Card>
        ))}
      </Box>
      {showRightButton && (
        <IconButton
          sx={{
            position: "absolute",
            right: 0,
            zIndex: 1,
            display: { xs: "none", md: "block" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default MatchLoadingCard;
