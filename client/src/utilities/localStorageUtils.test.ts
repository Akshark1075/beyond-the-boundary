import {
  saveArrayToLocalStorage,
  deleteFromLocalStorage,
  getArrayFromLocalStorage,
} from "./localStorageUtils";
import { SelectedOption } from "../views/ShowPage";

describe("Local Storage Utils", () => {
  beforeEach(() => {
    // Clear the local storage before each test
    localStorage.clear();
  });

  describe("saveArrayToLocalStorage", () => {
    it("should save an array to localStorage", () => {
      const key = "testKey";
      const array = [{ name: "option1" }, { name: "option2" }];

      saveArrayToLocalStorage(key, array);

      expect(localStorage.getItem(key)).toBe(JSON.stringify(array));
    });
  });

  describe("deleteFromLocalStorage", () => {
    it("should delete an item from localStorage array", () => {
      const key = "selectedOptions";
      const array = [{ name: "option1" }, { name: "option2" }];
      localStorage.setItem(key, JSON.stringify(array));

      deleteFromLocalStorage("option1");

      const updatedArray = JSON.parse(localStorage.getItem(key)!);
      expect(updatedArray).toEqual([{ name: "option2" }]);
    });

    it("should do nothing if the item does not exist", () => {
      const key = "selectedOptions";
      const array = [{ name: "option1" }];
      localStorage.setItem(key, JSON.stringify(array));

      deleteFromLocalStorage("nonExistentOption");

      const updatedArray = JSON.parse(localStorage.getItem(key)!);
      expect(updatedArray).toEqual(array);
    });

    it("should remove the key if the array becomes empty", () => {
      const key = "selectedOptions";
      const array = [{ name: "option1" }];
      localStorage.setItem(key, JSON.stringify(array));

      deleteFromLocalStorage("option1");

      expect(localStorage.getItem(key)).toEqual("[]");
    });
  });

  describe("getArrayFromLocalStorage", () => {
    it("should return an empty array if nothing is stored", () => {
      const result = getArrayFromLocalStorage("testKey");
      expect(result).toEqual([]);
    });

    it("should return the stored array", () => {
      const key = "testKey";
      const array = [{ name: "option1" }, { name: "option2" }];
      localStorage.setItem(key, JSON.stringify(array));

      const result = getArrayFromLocalStorage(key);
      expect(result).toEqual(array);
    });
  });
});
