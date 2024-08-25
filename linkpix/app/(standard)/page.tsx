"use client";
import Link from "next/link";
import AlbumList, { AlbumListType } from "../../components/AlbumList/AlbumList";
import {
  Container,
  Pagination,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import {
  ChangeEvent,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useGetAlbumList from "@/services/album/useGetAlbumList";
import AlbumSearch from "@/components/AlbumSearch/AlbumSearch";

enum HomeMode {
  "Browse",
  "Edit",
}

type PaginationParams = {
  page: number;
  limit: number;
};

const Home = () => {
  const [mode, setMode] = useState<HomeMode>(HomeMode.Browse);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    limit: 20,
  });
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: albumList, setParams: setAlbumListParams } =
    useGetAlbumList(paginationParams);
  const totalPage = useMemo(
    () => Math.floor(albumList.count / paginationParams.limit),
    [albumList.count, paginationParams.limit]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Backquote") {
        event.preventDefault();
        setIsSearchFocused((prev) => {
          // prev ? searchRef.current?.blur() : searchRef.current?.focus();
          return !prev;
        });
        return;
      }
      if (isSearchFocused) {
        return;
      }

      switch (event.code) {
        case "KeyZ":
          setPaginationParams((prev) =>
            prev.page > 0 ? { page: prev.page - 1, limit: prev.limit } : prev
          );
          break;
        case "KeyX":
          setPaginationParams((prev) =>
            prev.page < totalPage
              ? { page: prev.page + 1, limit: prev.limit }
              : prev
          );
          break;
        case "Backquote":
          break;
        default:
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isSearchFocused,
    paginationParams.limit,
    paginationParams.page,
    totalPage,
  ]);

  const handlePageChange = useCallback(
    (_event: any, page: number) =>
      setPaginationParams((prev) => ({ page: page - 1, limit: prev.limit })),
    []
  );

  useEffect(() => {
    setAlbumListParams({
      offset: paginationParams.page * paginationParams.limit,
      limit: paginationParams.limit,
      ...(searchText && { search: searchText }),
    });
  }, [paginationParams, searchText, setAlbumListParams]);

  const handleTabChange = useCallback((_: any, value: HomeMode) => {
    setMode(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    setPaginationParams((prev) => ({ page: 0, limit: prev.limit }));
  }, []);

  const handleSearchFocusChange = useCallback(
    (isFocused: boolean) => setIsSearchFocused(isFocused),
    []
  );

  return (
    <Container sx={{ py: 3 }} maxWidth="xl">
      <Stack
        mb={1}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"end"}
      >
        <AlbumSearch
          isFocused={isSearchFocused}
          onFocusChange={handleSearchFocusChange}
          onChange={handleSearchChange}
        ></AlbumSearch>
        <Pagination
          page={paginationParams.page + 1}
          count={Math.ceil(albumList.count / paginationParams.limit)}
          onChange={handlePageChange}
        ></Pagination>
        <Tabs
          value={mode}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Browse" value={HomeMode.Browse} />
          <Tab label="Edit" value={HomeMode.Edit} />
        </Tabs>
      </Stack>
      {mode === HomeMode.Browse && (
        <AlbumList data={albumList.data} isKeyInterrupt={isSearchFocused} />
      )}
    </Container>
  );
};

export default Home;
