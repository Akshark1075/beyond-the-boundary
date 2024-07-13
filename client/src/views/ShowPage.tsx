import "../styles/ShowPage.css";
import React, { useEffect, useState } from "react";

import FloatingActionButton from "../Components/FloatingActionButton";
import Video from "../Components/Video";
import { getArrayFromLocalStorage } from "../utilities/localStorageUtils";
export interface SelectedOption {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
const ShowPage = () => {
  const [selections, setSelection] = useState<SelectedOption[]>([]);
  useEffect(() => {
    // Retrieve the array from local storage on component mount
    const storedItems = getArrayFromLocalStorage("selectedOptions");
    setSelection(storedItems);
  }, []);
  return (
    <>
      <Video />
      <FloatingActionButton
        selections={selections}
        setSelection={setSelection}
      />
    </>
  );
};
export default ShowPage;
