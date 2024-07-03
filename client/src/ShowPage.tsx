import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import DenseTable from "./Components/ScoreCard";
import "./ShowPage.css";
const ShowPage = () => {
  let { matchId } = useParams();
  const videoUrl = "https://www.youtube.com/embed/4TLHORImdL4";
  return (
    <>
      <div className="video-responsive">
        <iframe
          width="853"
          height="480"
          src={videoUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube Video"
        />
      </div>
      <DenseTable matchID={matchId ?? ""} type="Batting" />
    </>
  );
};
export default ShowPage;
