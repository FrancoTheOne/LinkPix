"use client";
import AlbumList from "../../components/AlbumList/AlbumList";
import { Button, Container, Pagination, Stack, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import AlbumSearch from "@/components/AlbumSearch/AlbumSearch";
import AlbumGrid from "@/components/AlbumGrid/AlbumGrid";
import { PaginationParams, SortingParams } from "@/types/common";
import {
  useDeleteAlbumMutation,
  useGetAlbumListQuery,
  useUpdateAlbumMutation,
} from "@/services/album";
import { Album } from "@/types/album";
import BasicDialog from "@/components/Diaolog/BasicDialog";
import useDialog from "@/hook/useDialog";

enum HomeMode {
  "Browse",
  "Edit",
}

const Home = () => {
  const [mode, setMode] = useState<HomeMode>(HomeMode.Browse);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    limit: 20,
  });
  const [sortingParams, setSortingParams] = useState<SortingParams>({
    field: "id",
    sort: "desc",
  });
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAlbumEditing, setIsAlbumEditing] = useState(false);

  const { data: albumList, isLoading: isAlbumListLoading } =
    useGetAlbumListQuery({
      offset: paginationParams.page * paginationParams.limit,
      limit: paginationParams.limit,
      order: sortingParams.field,
      direction: sortingParams.sort,
      search: searchText,
    });
  const [updateAlbum] = useUpdateAlbumMutation({
    fixedCacheKey: "update-album",
  });
  const [deleteAlbum] = useDeleteAlbumMutation();

  const { dialogData, setDialogData, openDialog } = useDialog();

  const totalPage = useMemo(() => {
    return Math.floor((albumList?.count ?? 0) / paginationParams.limit);
  }, [albumList?.count, paginationParams.limit]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Backquote") {
        event.preventDefault();
        setIsSearchFocused((prev) => !prev);
        return;
      }
      if (isSearchFocused || isAlbumEditing) {
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
        default:
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isAlbumEditing,
    isSearchFocused,
    mode,
    paginationParams.limit,
    paginationParams.page,
    totalPage,
  ]);

  const handlePageChange = useCallback(
    (_event: any, page: number) =>
      setPaginationParams((prev) => ({ page: page - 1, limit: prev.limit })),
    []
  );

  const handleTabChange = useCallback((_: any, value: HomeMode) => {
    setMode(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    setPaginationParams((prev) => ({ page: 0, limit: prev.limit }));
  }, []);

  const handleSort = useCallback(
    (field: string, sort: SortingParams["sort"]) => {
      setSortingParams({ field, sort });
    },
    []
  );

  const handleAlbumEditToggle = useCallback(
    (isEditing: boolean) => setIsAlbumEditing(isEditing),
    []
  );

  const handleAlbumEditSubmit = useCallback(
    async (album: Partial<Album> & Required<Pick<Album, "id">>) => {
      try {
        await updateAlbum(album);
      } catch (err) {
        console.log(err);
      }
    },
    [updateAlbum]
  );

  const handleAlbumEditRequest = useCallback(
    (
      album: Partial<Album> & Required<Pick<Album, "id">>,
      prev: Partial<Album>
    ) => {
      const changeList = Object.entries(prev).map(
        ([key, value]) => `${key} from ${value} to ${album[key as keyof Album]}`
      );
      setDialogData({
        title: "Confirmation",
        content: changeList.join("\n"),
        onConfirm: () => handleAlbumEditSubmit(album),
      });
      openDialog();
    },
    [handleAlbumEditSubmit, openDialog, setDialogData]
  );

  const handleAlbumDelete = useCallback(
    async (id: number) => {
      try {
        await deleteAlbum(id);
      } catch (err) {
        console.log(err);
      }
    },
    [deleteAlbum]
  );

  const handleAlbumDeleteRequest = useCallback(
    (id: number, displayName: string) => {
      setDialogData({
        title: "Confirmation",
        content: `Delete ${displayName}?`,
        onConfirm: () => handleAlbumDelete(id),
      });
      openDialog();
    },
    [handleAlbumDelete, openDialog, setDialogData]
  );

  const handleSearchFocusChange = useCallback(
    (isFocused: boolean) => setIsSearchFocused(isFocused),
    []
  );

  return (
    <>
      <BasicDialog {...dialogData} />
      {albumList !== undefined ? (
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
            <Tabs value={mode} onChange={handleTabChange}>
              <Tab label="Browse" value={HomeMode.Browse} />
              <Tab label="Edit" value={HomeMode.Edit} />
            </Tabs>
          </Stack>
          {mode === HomeMode.Browse && (
            <AlbumList data={albumList.data} isKeyInterrupt={isSearchFocused} />
          )}
          {mode === HomeMode.Edit && (
            <AlbumGrid
              data={albumList.data}
              rowCount={albumList.count}
              paginationParams={paginationParams}
              sortingParams={sortingParams}
              onSort={handleSort}
              onEditToggle={handleAlbumEditToggle}
              onEditSubmit={handleAlbumEditRequest}
              onDelete={handleAlbumDeleteRequest}
            />
          )}
        </Container>
      ) : (
        <Container sx={{ py: 3 }} maxWidth="xl"></Container>
      )}
    </>
  );
};

export default Home;
