import { SelectedOption } from "../views/ShowPage";

export const saveArrayToLocalStorage = (key: string, array: any[]) => {
  localStorage.setItem(key, JSON.stringify(array));
};
export const deleteFromLocalStorage = (key: string) => {
  const storedArray = localStorage.getItem("selectedOptions");
  if (storedArray === "") {
    localStorage.removeItem("selectedOptions");
  } else if (storedArray) {
    localStorage.setItem(
      "selectedOptions",
      JSON.stringify(
        JSON.parse(storedArray).filter(
          (item: SelectedOption) => item.name !== key
        )
      )
    );
  }
};

export const getArrayFromLocalStorage = (key: string): any[] => {
  const storedArray = localStorage.getItem(key);
  return storedArray ? JSON.parse(storedArray) : [];
};
