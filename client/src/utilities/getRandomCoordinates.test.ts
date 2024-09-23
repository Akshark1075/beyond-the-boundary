/**
 * @jest-environment jsdom
 */
import getRandomCoordinates from "./getRandomCoordinates";

describe("getRandomCoordinates", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1000,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      value: 800,
    });
  });

  it("should return coordinates within the allowed screen width and height", () => {
    const { x, y } = getRandomCoordinates();

    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(1000 - 350);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(800 - 350);
  });

  it("should return different coordinates on successive calls", () => {
    const firstCall = getRandomCoordinates();
    const secondCall = getRandomCoordinates();
    expect(firstCall).not.toEqual(secondCall);
  });

  it("should handle smaller screen sizes", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 400,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      value: 400,
    });

    const { x, y } = getRandomCoordinates();

    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(400 - 350);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(400 - 350);
  });
});
