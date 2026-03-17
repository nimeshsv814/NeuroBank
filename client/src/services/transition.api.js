import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const transitionApi = createApi({
  reducerPath: "transitionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3002/api/transition",
    credentials: "include",
  }),
  tagTypes: ["Transition"],
  endpoints: (build) => ({
    createTransition: build.mutation({
      query: (body) => ({
        url: "/createTransition",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transition"],
    }),
    getHistory: build.query({
      query: (accountId) => ({
        url: `/history/${accountId}`,
        method: "GET",
      }),
      providesTags: ["Transition"],
    }),
  }),
});

export const { useCreateTransitionMutation, useGetHistoryQuery } =
  transitionApi;
