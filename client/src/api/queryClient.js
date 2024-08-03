// src/api/queryClient.js
import { QueryClient } from "@tanstack/react-query";
import fetchWithHeaders from "./fetch";

const defaultQueryFn = async ({ queryKey }) => {
  return fetchWithHeaders(queryKey[0]);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
