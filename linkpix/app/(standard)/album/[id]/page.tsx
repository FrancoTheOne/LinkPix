"use client";
import AlbumGallery from "@/components/AlbumGallery/AlbumGallery";
import {
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
  useDeleteAlbumItemMutation,
  useGetAlbumQuery,
  useUpdateAlbumItemMutation,
} from "@/services/album";
import { AlbumItem } from "@/types/album";
import BasicDialog from "@/components/Diaolog/BasicDialog";
import useDialog from "@/hook/useDialog";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  SortRounded,
  ViewComfy,
} from "@mui/icons-material";
import { darkTheme as theme } from "@/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

enum ViewMode {
  "Browse",
  "Edit",
}

const ALBUM_COLUMN = [
  { field: "lastViewAt", name: "Last Viewed" },
  { field: "rating", name: "Rating" },
  { field: "id", name: "ID" },
  { field: "title", name: "Name" },
  { field: "subtitle", name: "Author" },
];

const PAGINATION_LIMIT = [14, 21, 28];

const AlbumPage = ({ params }: { params: { id: string } }) => {
  const albumId = parseInt(params.id);
  const isKeyShortcutDisabled = useSelector(
    (state: RootState) => state.setting.isKeyShortcutDisabled
  );

  const [mode, setMode] = useState<ViewMode>(ViewMode.Browse);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    limit: PAGINATION_LIMIT[1],
  });
  const [sortingParams, setSortingParams] = useState<SortingParams>({
    field: ALBUM_COLUMN[0].field,
    sort: "desc",
  });
  const [searchText, setSearchText] = useState("");
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const isSortMenuOpen = Boolean(sortMenuAnchor);
  const [limitMenuAnchor, setLimitMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const isLimitMenuOpen = Boolean(limitMenuAnchor);

  const { data: albumData, isLoading: isAlbumListLoading } = useGetAlbumQuery({
    albumId,
    offset: paginationParams.page * paginationParams.limit,
    limit: paginationParams.limit,
    order: sortingParams.field,
    direction: sortingParams.sort,
    search: searchText,
  });
  const [updateAlbum] = useUpdateAlbumItemMutation({
    fixedCacheKey: "update-album",
  });
  const [deleteAlbum] = useDeleteAlbumItemMutation();

  const { dialogData, setDialogData, openDialog } = useDialog();

  const totalPage = useMemo(() => {
    return Math.floor((albumData?.count ?? 0) / paginationParams.limit);
  }, [albumData?.count, paginationParams.limit]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    if (!isKeyShortcutDisabled) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isKeyShortcutDisabled,
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

  const handleTabChange = useCallback((_: any, value: ViewMode) => {
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

  const handleItemClick = useCallback(
    (index: number) => {
      if (albumData) {
        const action = albumData.data[index].action;
        if (!action) {
          alert("Error: Link is missing");
          return;
        }
        window.open(action, "_blank");
        updateAlbum({
          albumId,
          id: albumData.data[index].id,
          lastViewAt: new Date().toISOString(),
        });
      }
    },
    [albumId, albumData, updateAlbum]
  );

  const handleItemEditSubmit = useCallback(
    async (item: Partial<AlbumItem> & Required<Pick<AlbumItem, "id">>) => {
      try {
        await updateAlbum({ albumId, ...item });
      } catch (err) {
        console.log(err);
      }
    },
    [albumId, updateAlbum]
  );

  const handleItemEditRequest = useCallback(
    (
      item: Partial<AlbumItem> & Required<Pick<AlbumItem, "id">>,
      prev: Partial<AlbumItem>,
      force = false
    ) => {
      const changeList = Object.entries(prev).map(
        ([key, value]) => `${key}:\n${value} ⇒ ${item[key as keyof AlbumItem]}`
      );
      if (force) {
        handleItemEditSubmit(item);
      } else {
        setDialogData({
          title: "Confirmation",
          content: changeList.join("\n"),
          onConfirm: () => handleItemEditSubmit(item),
        });
        openDialog();
      }
    },
    [handleItemEditSubmit, openDialog, setDialogData]
  );

  const handleItemRatingChange = useCallback(
    (index: number, rating: number) => {
      if (albumData) {
        updateAlbum({
          albumId,
          id: albumData.data[index].id,
          rating,
        });
      }
    },
    [albumId, albumData, updateAlbum]
  );

  const handleItemDelete = useCallback(
    async (id: number) => {
      try {
        await deleteAlbum({ albumId, id });
      } catch (err) {
        console.log(err);
      }
    },
    [albumId, deleteAlbum]
  );

  const handleItemDeleteRequest = useCallback(
    (id: number, displayName: string) => {
      setDialogData({
        title: "Confirmation",
        content: `Delete ${displayName}?`,
        onConfirm: () => handleItemDelete(id),
      });
      openDialog();
    },
    [handleItemDelete, openDialog, setDialogData]
  );

  return (
    <>
      <BasicDialog {...dialogData} />
      {albumData !== undefined ? (
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
              <AlbumSearch onChange={handleSearchChange}></AlbumSearch>
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
            {Boolean(albumData.count) && (
              <Pagination
                page={paginationParams.page + 1}
                count={Math.ceil(albumData.count / paginationParams.limit)}
                onChange={handlePageChange}
              ></Pagination>
            )}
            <Tabs value={mode} onChange={handleTabChange}>
              <Tab label="Browse" value={ViewMode.Browse} />
              <Tab label="Edit" value={ViewMode.Edit} />
            </Tabs>
          </Stack>
          {mode === ViewMode.Browse && (
            <AlbumGallery
              data={albumData.data}
              onItemClick={handleItemClick}
              onItemRatingChange={handleItemRatingChange}
            />
          )}
          {mode === ViewMode.Edit && (
            <AlbumGrid
              data={albumData.data}
              rowCount={albumData.count}
              paginationParams={paginationParams}
              sortingParams={sortingParams}
              onSort={handleSort}
              onItemEditSubmit={handleItemEditRequest}
              onItemRatingChange={handleItemRatingChange}
              onItemDelete={handleItemDeleteRequest}
            />
          )}
        </Container>
      ) : (
        <Container sx={{ py: 3 }} maxWidth="xl"></Container>
      )}
    </>
  );
};

export default AlbumPage;
