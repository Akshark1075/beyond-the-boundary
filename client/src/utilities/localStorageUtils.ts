// localStorageUtils.ts
export const saveArrayToLocalStorage = (key: string, array: any[]) => {
  localStorage.setItem(key, JSON.stringify(array));
};

export const getArrayFromLocalStorage = (key: string): any[] => {
  const storedArray = localStorage.getItem(key);
  return storedArray ? JSON.parse(storedArray) : [];
};
