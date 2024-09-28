import getUpdatedZIndex from "./getUpdatedZIndex";
import { SelectedOption } from "../views/ShowPage";

describe("getUpdatedZIndex", () => {
  let items: SelectedOption[];

  beforeEach(() => {
    items = [
      {
        name: "Component A",
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 2,
      },
      {
        name: "Component B",
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        zIndex: 3,
      },
      {
        name: "Component C",
        x: 200,
        y: 200,
        width: 100,
        height: 100,
        zIndex: 1,
      },
    ];
  });

  it("should return 1 when the target component is not found", () => {
    const zIndex = getUpdatedZIndex(items, "Nonexistent Component");
    expect(zIndex).toBe(1);
  });

  it("should return the current z-index + 1 when components overlap", () => {
    const zIndex = getUpdatedZIndex(items, "Component A");
    // Component A overlaps with Component B (zIndex 3), so the new z-index should be 4
    expect(zIndex).toBe(4);
  });

  it("should return the current z-index if no components overlap", () => {
    const zIndex = getUpdatedZIndex(items, "Component C");
    // Component C does not overlap with any other component, so its z-index should remain 1
    expect(zIndex).toBe(1);
  });

  it("should return the highest z-index + 1 when multiple components overlap", () => {
    // Add another overlapping component with a higher z-index
    items.push({
      name: "Component D",
      x: 30,
      y: 30,
      width: 100,
      height: 100,
      zIndex: 5,
    });

    const zIndex = getUpdatedZIndex(items, "Component A");
    // Component A overlaps with Component B (zIndex 3) and Component D (zIndex 5),
    // so the new z-index should be 6
    expect(zIndex).toBe(6);
  });

  it("should ignore components with the same name as the target component", () => {
    // Add a duplicate component with the same name but a different zIndex
    items.push({
      name: "Component A",
      x: 150,
      y: 150,
      width: 50,
      height: 50,
      zIndex: 10,
    });

    const zIndex = getUpdatedZIndex(items, "Component A");
    // The function should only consider overlaps with components that have a different name,
    // so the result should still be 4
    expect(zIndex).toBe(4);
  });
});
