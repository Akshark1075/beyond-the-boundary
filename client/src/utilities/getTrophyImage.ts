const getTrophyImage = (seriesName: string) => {
  if (seriesName.toLocaleLowerCase().includes("ashes")) return "ashesLog.png";
  else if (
    seriesName.toLocaleLowerCase().includes("bbl") ||
    seriesName.toLocaleLowerCase().includes("big bash")
  )
    return "bigBashLogo.png";
  else if (seriesName.toLocaleLowerCase().includes("county"))
    return "countyLogo.png";
  else if (
    seriesName.toLocaleLowerCase().includes("ipl") ||
    seriesName.toLocaleLowerCase().includes("indian")
  )
    return "iplLogo.png";
  else if (
    seriesName.toLocaleLowerCase().includes("mlc") ||
    seriesName.toLocaleLowerCase().includes("major")
  )
    return "mlcLogo.png";
  else if (
    seriesName.toLocaleLowerCase().includes("psl") ||
    seriesName.toLocaleLowerCase().includes("pakistan")
  )
    return "pslLogo.png";
  else if (seriesName.toLocaleLowerCase().includes("sa20"))
    return "sa20Logo.png";
  else if (
    seriesName.toLocaleLowerCase().includes("icc") ||
    seriesName.toLocaleLowerCase().includes("worldcup")
  )
    return "worldCupLogo.png";
  return "defaultLogo.png";
};
export default getTrophyImage;
