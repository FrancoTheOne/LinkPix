import { Album } from "@/types/album";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const albumApi = createApi({
  reducerPath: "albumApi",
  baseQuery: fetchBaseQuery({
    baseUrl: new URL(
      "/album",
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    ).toString(),
  }),
  tagTypes: ["AlbumList"],
  endpoints: (builder) => ({
    getAlbumList: builder.query<
      { data: Album[]; count: number; offset: number; limit: number },
      {
        offset?: number;
        limit?: number;
        search?: string;
        order?: string;
        direction?: string;
      }
    >({
      query: (params) => ({
        url: "/list",
        params: params,
      }),
      providesTags: () => ["AlbumList"],
    }),
    updateAlbum: builder.mutation<
      void,
      Partial<Album> & Required<Pick<Album, "id">>
    >({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: () => ["AlbumList"],
    }),
  }),
});

export const { useGetAlbumListQuery, useUpdateAlbumMutation } = albumApi;
