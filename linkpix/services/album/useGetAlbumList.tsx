import { useEffect, useRef, useState } from "react";

type GetAlbumListRequest = Partial<{
  offset: number;
  limit: number;
  search: string;
}>;

type Album = {
  id: number;
  name: string;
  category: string;
  author: string;
  thumbnail: string;
  source: string;
};

type GetAlbumListResponse = {
  data: Album[];
  count: number;
  offset: number;
  limit: number;
};

type AlbumList = GetAlbumListResponse;

const useGetAlbumList = (initParams: GetAlbumListRequest = {}) => {
  const [data, setData] = useState<AlbumList>({
    data: [],
    count: 0,
    offset: 0,
    limit: 0,
  });
  const [params, setParams] = useState<GetAlbumListRequest>(initParams);
  const isLoading = useRef(false);

  useEffect(() => {
    const fetchGetAlbumList = async () => {
      try {
        isLoading.current = true;

        const url = new URL(
          "/album/list",
          process.env.NEXT_PUBLIC_SERVER_DOMAIN
        );
        url.search = new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        ).toString();

        const res = await fetch(url, {
          method: "GET",
        });
        const resData: GetAlbumListResponse = await res.json();
        setData(resData);
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.current = false;
      }
    };
    if (!isLoading.current) {
      fetchGetAlbumList();
    }
  }, [params]);

  return { data, setParams };
};

export default useGetAlbumList;
export type { Album, AlbumList };
