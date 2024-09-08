"use client";
import AlbumList from "../../components/AlbumList/AlbumList";
import {
  Button,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
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
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  SortRounded,
  ViewComfy,
} from "@mui/icons-material";
import { darkTheme as theme } from "@/theme";

enum HomeMode {
  "Browse",
  "Edit",
}

const ALBUM_COLUMN = [
  { field: "lastViewAt", name: "Last Viewed" },
  { field: "rating", name: "Rating" },
  { field: "id", name: "ID" },
  { field: "name", name: "Name" },
  { field: "author", name: "Author" },
];

const PAGINATION_LIMIT = [14, 21, 28];

const Home = () => {
  const [mode, setMode] = useState<HomeMode>(HomeMode.Browse);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    limit: PAGINATION_LIMIT[1],
  });
  const [sortingParams, setSortingParams] = useState<SortingParams>({
    field: ALBUM_COLUMN[0].field,
    sort: "desc",
  });
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const isSortMenuOpen = Boolean(sortMenuAnchor);
  const [limitMenuAnchor, setLimitMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const isLimitMenuOpen = Boolean(limitMenuAnchor);
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

  const handleSortMenuOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      setSortMenuAnchor(event.currentTarget),
    []
  );

  const handleSortMenuClose = useCallback(() => setSortMenuAnchor(null), []);

  const handleSortMenuItemClick = useCallback(
    (field: string, sort?: "asc" | "desc") => {
      setSortingParams((prev) => ({
        field,
        sort:
          sort ??
          (field !== prev.field || prev.sort === "desc" ? "asc" : "desc"),
      }));
      handleSortMenuClose();
    },
    [handleSortMenuClose]
  );

  const handleLimitMenuOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      setLimitMenuAnchor(event.currentTarget),
    []
  );

  const handleLimitMenuClose = useCallback(() => setLimitMenuAnchor(null), []);

  const handleLimitMenuItemClick = useCallback(
    (limit: number) => {
      setPaginationParams({
        page: 0,
        limit,
      });
      handleLimitMenuClose();
    },
    [handleLimitMenuClose]
  );

  const handleAlbumClick = useCallback(
    (index: number) => {
      if (albumList) {
        window.open(albumList.data[index].source, "_blank");
        updateAlbum({
          id: albumList.data[index].id,
          lastViewAt: new Date().toISOString(),
        });
      }
    },
    [albumList, updateAlbum]
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
        ([key, value]) => `${key}:\n${value} ⇒ ${album[key as keyof Album]}`
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

  const handleAlbumRatingChange = useCallback(
    (index: number, rating: number) => {
      if (albumList) {
        updateAlbum({
          id: albumList.data[index].id,
          rating,
        });
      }
    },
    [albumList, updateAlbum]
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
            alignItems={"center"}
          >
            <Stack
              direction={"row"}
              gap={1}
              position={"relative"}
              alignItems={"center"}
            >
              <AlbumSearch
                isFocused={isSearchFocused}
                onFocusChange={handleSearchFocusChange}
                onChange={handleSearchChange}
              ></AlbumSearch>
              <Tooltip title="Sort" placement="top">
                <IconButton
                  id="sort-menu-button"
                  aria-controls={isSortMenuOpen ? "sort-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={isSortMenuOpen ? "true" : undefined}
                  onClick={handleSortMenuOpen}
                >
                  <SortRounded></SortRounded>
                </IconButton>
              </Tooltip>
              <Menu
                id="sort-menu"
                open={isSortMenuOpen}
                anchorEl={sortMenuAnchor}
                onClose={handleSortMenuClose}
                MenuListProps={{
                  "aria-labelledby": "sort-menu",
                }}
              >
                {ALBUM_COLUMN.map((column) => (
                  <MenuItem
                    key={column.field}
                    selected={column.field === sortingParams.field}
                    // onClick={() => handleSortMenuItemClick(column.field)}
                  >
                    <ListItemText>{column.name}</ListItemText>
                    <ListItemIcon
                      sx={{
                        pl: 2,
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          ...(column.field === sortingParams.field &&
                            sortingParams.sort === "asc" && {
                              backgroundColor: `${theme.palette.grey[600]} !important`,
                            }),
                        }}
                        onClick={() =>
                          handleSortMenuItemClick(column.field, "asc")
                        }
                      >
                        <KeyboardArrowUp />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          ...(column.field === sortingParams.field &&
                            sortingParams.sort === "desc" && {
                              backgroundColor: `${theme.palette.grey[600]} !important`,
                            }),
                        }}
                        onClick={() =>
                          handleSortMenuItemClick(column.field, "desc")
                        }
                      >
                        <KeyboardArrowDown />
                      </IconButton>
                      {/* {column.field === sortingParams.field &&
                        (sortingParams.sort === "asc" ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        ))} */}
                    </ListItemIcon>
                  </MenuItem>
                ))}
              </Menu>
              <Tooltip title="Pagination Limit" placement="top">
                <IconButton
                  id="limit-menu-button"
                  aria-controls={isLimitMenuOpen ? "limit-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={isLimitMenuOpen ? "true" : undefined}
                  onClick={handleLimitMenuOpen}
                >
                  <ViewComfy />
                </IconButton>
              </Tooltip>
              <Menu
                id="limit-menu"
                open={isLimitMenuOpen}
                anchorEl={limitMenuAnchor}
                onClose={handleLimitMenuClose}
                MenuListProps={{
                  "aria-labelledby": "limit-menu",
                }}
              >
                {PAGINATION_LIMIT.map((limit) => (
                  <MenuItem
                    key={limit}
                    selected={limit === paginationParams.limit}
                    onClick={() => handleLimitMenuItemClick(limit)}
                  >
                    <ListItemText>{limit}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
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
            <AlbumList
              data={albumList.data}
              isKeyInterrupt={isSearchFocused}
              onAlbumClick={handleAlbumClick}
              onAlbumRatingChange={handleAlbumRatingChange}
            />
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
              onAlbumRatingChange={handleAlbumRatingChange}
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
