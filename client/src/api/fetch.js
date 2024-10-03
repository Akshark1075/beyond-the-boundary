const apiKeys = [
  "71c49e5ccfmsh4e7224d6d7fbb0ap11128bjsnd1bdf317c93e",
  "34bc3eb86dmsh62c3088fe607e6fp186023jsnf139d6bf65e7",
  "7a2ed3513cmsh433f85b7a4ab9f8p1883cfjsn1b4c80608f1b",
  "69e3970950msh0ed0f9442e90defp11d30djsnf4f943413c89",
  "54d75650ddmshcf182fa775ec6fap1039b2jsnaa79e2961462",
  "18e62705admshcf104001eaa3503p1d5ea4jsn33a591bb7208",
  "628da8a7f0msh90d1dfa21b8b92fp192525jsn7612ce48a526",
  "996a7c1834msh33d27aefce5d1e3p17b6d2jsn68ad5ebd3a44",
  "1cc6bc17f9msh16c26c529c9d557p1f4306jsn92513464018a",
  "fb825d76camshc89a23d3b25430ap1d884fjsn5e38a5b81ca1",
];
//Fetch function that retries with new api key on failure
const fetchWithRetry = async (url, options = {}) => {
  let apiKey = apiKeys[0];
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

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    apiKey = apiKeys[2];
    const response = await fetch(url, {
      ...newOptions,
      headers: { "x-rapidapi-key": apiKey },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }
};

export default fetchWithRetry;
