import { useParams } from "react-router-dom";
import ScoreCardTable from "../Components/ScoreCard";
import "../styles/ShowPage.css";
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
      <ScoreCardTable matchID={matchId ?? ""} type="Batting" />
    </>
  );
};
export default ShowPage;
