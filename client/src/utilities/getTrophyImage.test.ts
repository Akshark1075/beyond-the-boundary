import getTrophyImage from "./getTrophyImage";
describe("getTrophyImage", () => {
  it('should return ashesLogo.png for "The Ashes"', () => {
    expect(getTrophyImage("The Ashes")).toBe("ashesLogo.png");
  });

  it('should return bigBashLogo.png for "BBL"', () => {
    expect(getTrophyImage("BBL")).toBe("bigBashLogo.png");
  });

  it('should return bigBashLogo.png for "Big Bash League"', () => {
    expect(getTrophyImage("Big Bash League")).toBe("bigBashLogo.png");
  });

  it('should return countyLogo.webp for "County Championship"', () => {
    expect(getTrophyImage("County Championship")).toBe("countyLogo.webp");
  });

  it('should return iplLogo.png for "IPL"', () => {
    expect(getTrophyImage("IPL")).toBe("iplLogo.png");
  });

  it('should return iplLogo.png for "Indian Premier League"', () => {
    expect(getTrophyImage("Indian Premier League")).toBe("iplLogo.png");
  });

  it('should return mlcLogo.svg for "MLC"', () => {
    expect(getTrophyImage("MLC")).toBe("mlcLogo.svg");
  });

  it('should return mlcLogo.svg for "Major League Cricket"', () => {
    expect(getTrophyImage("Major League Cricket")).toBe("mlcLogo.svg");
  });

  it('should return pslLogo.png for "PSL"', () => {
    expect(getTrophyImage("PSL")).toBe("pslLogo.png");
  });

  it('should return pslLogo.png for "Pakistan Super League"', () => {
    expect(getTrophyImage("Pakistan Super League")).toBe("pslLogo.png");
  });

  it('should return sa20Logo.svg for "SA20"', () => {
    expect(getTrophyImage("SA20")).toBe("sa20Logo.svg");
  });

  it('should return hundred.png for "The Hundred"', () => {
    expect(getTrophyImage("The Hundred")).toBe("hundred.png");
  });

  it('should return iccLogo.png for "ICC World Cup"', () => {
    expect(getTrophyImage("ICC World Cup")).toBe("iccLogo.png");
  });

  it("should return defaultLogo.jpeg for unknown series", () => {
    expect(getTrophyImage("Unknown Series")).toBe("defaultLogo.jpeg");
  });
});
