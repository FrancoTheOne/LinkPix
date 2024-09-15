import { Repository } from "@/types/repository";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const repositoryApi = createApi({
  reducerPath: "repositoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: new URL(
      "/repository",
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    ).toString(),
  }),
  tagTypes: ["repository"],
  endpoints: (builder) => ({
    getRepository: builder.query<{ data: Repository[]; count: number }, {}>({
      query: () => ({
        url: "/",
      }),
      providesTags: () => ["repository"],
    }),
    createAlbum: builder.mutation<void, Omit<Repository, "id">>({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
      }),
      invalidatesTags: () => ["repository"],
    }),
  }),
});

export const { useGetRepositoryQuery, useCreateAlbumMutation } = repositoryApi;
