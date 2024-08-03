const apiKeys = [
  "71c49e5ccfmsh4e7224d6d7fbb0ap11128bjsnd1bdf317c93e",
  "34bc3eb86dmsh62c3088fe607e6fp186023jsnf139d6bf65e7",
  "7a2ed3513cmsh433f85b7a4ab9f8p1883cfjsn1b4c80608f1b",
];

const fetchWithRetry = async (url, options = {}) => {
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
    };

    try {
      const response = await fetch(url, newOptions);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (i === apiKeys.length - 1) {
        throw new Error("All API keys have failed");
      }
    }
  }
};
export default fetchWithRetry;
