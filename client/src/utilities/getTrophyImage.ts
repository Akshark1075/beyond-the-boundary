//Function for getting trophy images
const getTrophyImage = (seriesName: string) => {
  if (seriesName.toLocaleLowerCase().includes("ashes")) return "ashesLogo.png";
  else if (
    seriesName.toLocaleLowerCase().includes("bbl") ||
    seriesName.toLocaleLowerCase().includes("big bash")
  )
    return "bigBashLogo.png";
  else if (seriesName.toLocaleLowerCase().includes("county"))
    return "countyLogo.webp";
  else if (
    seriesName.toLocaleLowerCase().includes("ipl") ||
    seriesName.toLocaleLowerCase().includes("indian")
  )
    return "iplLogo.png";
  else if (
    seriesName.toLocaleLowerCase().includes("mlc") ||
    seriesName.toLocaleLowerCase().includes("major")
  )
    return "mlcLogo.svg";
  else if (
    seriesName.toLocaleLowerCase().includes("psl") ||
    seriesName.toLocaleLowerCase().includes("pakistan")
  )
    return "pslLogo.png";
  else if (seriesName.toLocaleLowerCase().includes("sa20"))
    return "sa20Logo.svg";
  else if (seriesName.toLocaleLowerCase().includes("hundred")) {
    return "hundred.png";
  } else if (
    seriesName.toLocaleLowerCase().includes("icc") ||
    seriesName.toLocaleLowerCase().includes("worldcup")
  )
    return "iccLogo.png";
  return "defaultLogo.webp";
};
export default getTrophyImage;
