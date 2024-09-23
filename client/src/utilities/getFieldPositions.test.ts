import { fieldPositions } from "./getFieldPositions";
it("should return 10 random positions", () => {
  const expectedLength = 10;
  expect(fieldPositions.length).toBe(expectedLength);
});

it("should have subarrays of size 3 (x, y, z coordinates)", () => {
  fieldPositions.forEach((pos) => {
    expect(pos.length).toBe(3);
  });
});
it("should map the random positions into 3-coordinate arrays", () => {
  // Check if each entry is a valid position [x, y, z]
  fieldPositions.forEach((pos) => {
    expect(pos.length).toBe(3);
    pos.forEach((coord) => {
      expect(typeof coord).toBe("number");
    });
  });
});
it("should not return duplicate positions", () => {
  const uniquePositions = new Set(fieldPositions.map((pos) => pos.toString()));
  expect(uniquePositions.size).toBe(fieldPositions.length);
});
