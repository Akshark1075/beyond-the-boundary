/**
 * @jest-environment jsdom
 */
import getRandomCoordinates from "./getRandomCoordinates";

describe("getRandomCoordinates", () => {
  beforeEach(() => {
    // Mock the window dimensions before each test
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

    // The random coordinates should be within the calculated range
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(1000 - 350); // screenWidth - minWidth
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(800 - 350); // screenHeight - minHeight
  });

  it("should return different coordinates on successive calls", () => {
    const firstCall = getRandomCoordinates();
    const secondCall = getRandomCoordinates();

    // While it's possible for coordinates to be the same, we expect randomness to usually produce different values
    expect(firstCall).not.toEqual(secondCall);
  });

  it("should handle smaller screen sizes", () => {
    // Simulate a small screen
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 400,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      value: 400,
    });

    const { x, y } = getRandomCoordinates();

    // On a small screen, the range for X and Y coordinates will be limited
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(400 - 350); // Limited range for X
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(400 - 350); // Limited range for Y
  });
});
