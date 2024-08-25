import { useEffect, useRef, useState } from "react";

type GetAlbumListRequest = Partial<{
  offset: number;
  limit: number;
  search: string;
}>;

type GetAlbumListResponse = {
  data: {
    author: string;
    category: string;
    id: number;
    name: string;
    source: string;
    thumbnail: string;
  }[];
  count: number;
  offset: number;
  limit: number;
};

export type AlbumListType = GetAlbumListResponse;

const useGetAlbumList = (initParams: GetAlbumListRequest = {}) => {
  const [data, setData] = useState<AlbumListType>({
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
