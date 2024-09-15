import { AlbumItem } from "@/types/album";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const albumApi = createApi({
  reducerPath: "albumApi",
  baseQuery: fetchBaseQuery({
    baseUrl: new URL(
      "/album",
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    ).toString(),
  }),
  tagTypes: ["album"],
  endpoints: (builder) => ({
    getAlbum: builder.query<
      { data: AlbumItem[]; count: number; offset: number; limit: number },
      {
        albumId: number;
        offset?: number;
        limit?: number;
        search?: string;
        order?: string;
        direction?: string;
      }
    >({
      query: (params) => {
        const { albumId, ...otherParams } = params;
        return {
          url: `/${albumId}`,
          params: otherParams,
        };
      },
      providesTags: (_result, _error, arg) => [
        { type: "album", id: arg.albumId },
      ],
    }),
    updateAlbumItem: builder.mutation<
      void,
      { albumId: number } & Partial<AlbumItem> & Required<Pick<AlbumItem, "id">>
    >({
      query: ({ albumId, id, ...body }) => ({
        url: `/${albumId}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: () => ["album"],
    }),
    deleteAlbumItem: builder.mutation<void, { albumId: number; id: number }>({
      query: ({ albumId, id }) => ({
        url: `/${albumId}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["album"],
    }),
  }),
});

export const {
  useGetAlbumQuery,
  useUpdateAlbumItemMutation,
  useDeleteAlbumItemMutation,
} = albumApi;
