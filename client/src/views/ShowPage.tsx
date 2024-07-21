import "../styles/ShowPage.css";
import React, { useEffect, useState } from "react";
import FloatingActionButton from "../Components/FloatingActionButton";
import { getArrayFromLocalStorage } from "../utilities/localStorageUtils";
import { useParams } from "react-router-dom";
import SquadComponent from "../Components/Squad";
import FieldSettings from "../Components/FieldPosition";
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
  const { matchId } = useParams();
  return (
    <>
      <FloatingActionButton
        selections={selections}
        setSelection={setSelection}
      />
    </>
  );
};
export default ShowPage;
