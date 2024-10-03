//Function for getting updated z index for component being dragged
import { SelectedOption } from "../views/ShowPage";

const getUpdatedZIndex = (items: SelectedOption[], title: string): number => {
  // Find the component with the specified title
  const targetComponent = items.find((item) => item.name === title);

  if (!targetComponent) {
    // Return 1 if the specified component is not found
    return 1;
  }

  const {
    x: targetX,
    y: targetY,
    width: targetWidth,
    height: targetHeight,
    zIndex: targetZIndex,
  } = targetComponent;

  // Function to check if two components overlap
  const isOverlapping = (comp1: SelectedOption, comp2: SelectedOption) => {
    return (
      comp1.x < comp2.x + comp2.width &&
      comp1.x + comp1.width > comp2.x &&
      comp1.y < comp2.y + comp2.height &&
      comp1.y + comp1.height > comp2.y
    );
  };

  let maxZIndex = targetZIndex;
  let overlapDetected = false;

  // Iterate through the array to find overlapping components
  items.forEach((item) => {
    if (item.name !== title && isOverlapping(targetComponent, item)) {
      overlapDetected = true;

      // If there's an overlap, check if this component has a higher or equal z-index
      if (item.zIndex >= maxZIndex) {
        maxZIndex = item.zIndex;
      }
    }
  });

  // Increment the z-index only if there's overlap
  return overlapDetected ? maxZIndex + 1 : targetZIndex;
};

export default getUpdatedZIndex;
