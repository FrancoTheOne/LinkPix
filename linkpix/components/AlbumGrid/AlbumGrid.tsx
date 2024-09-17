import { lightTheme } from "@/theme";
import { AlbumItem } from "@/types/album";
import { PaginationParams, SortingParams } from "@/types/common";
import { ThemeProvider } from "@emotion/react";
import { Box, IconButton, Rating, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
  MuiEvent,
  useGridApiRef,
} from "@mui/x-data-grid";
import React, { useCallback, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import {
  activateKeyShortcut,
  deactivateKeyShortcut,
} from "@/lib/setting/settingSlice";

interface AlbumGridProps {
  data: AlbumItem[];
  rowCount: number;
  paginationParams: PaginationParams;
  sortingParams: SortingParams;
  onSort: (field: string, sort: SortingParams["sort"]) => void;
  onItemEditSubmit: (
    album: Partial<AlbumItem> & Required<Pick<AlbumItem, "id">>,
    prev: Partial<AlbumItem>,
    force?: boolean
  ) => void;
  onItemRatingChange: (index: number, rating: number) => void;
  onItemDelete: (id: number, displayName: string) => void;
}

const AlbumGrid = (props: AlbumGridProps) => {
  const {
    data,
    rowCount,
    paginationParams,
    sortingParams,
    onSort,
    onItemEditSubmit,
    onItemRatingChange,
    onItemDelete,
  } = props;
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const [isNextSubmitForce, setIsNextSubmitForce] = useState(false);

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      if (model.length) {
        onSort(model[0].field, model[0].sort ?? "desc");
      }
    },
    [onSort]
  );

  const handleCellEditStart = useCallback(() => {
    dispatch(deactivateKeyShortcut());
  }, [dispatch]);

  const handleCellEditStop = useCallback(() => {
    dispatch(activateKeyShortcut());
  }, [dispatch]);

  const handleCellKeydown = useCallback(
    (_params: any, event: MuiEvent<React.KeyboardEvent<HTMLElement>>) => {
      if (event.code === "Enter" && event.shiftKey) {
        setIsNextSubmitForce(true);
      }
    },
    []
  );

  const handleProcessRowUpdate = useCallback(
    async (
      newRow: Record<string, unknown>,
      oldRow: Record<string, unknown>
    ) => {
      const updateData = Object.entries(newRow)
        .map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
        .filter(([key, value]) => oldRow[key as string] !== value);
      if (updateData.length) {
        onItemEditSubmit(
          {
            id: Number(newRow.id),
            ...Object.fromEntries(updateData),
          },
          Object.fromEntries(
            updateData.map(([key]) => [key, oldRow[key as string]])
          ),
          isNextSubmitForce
        );
        setIsNextSubmitForce(false);
      }
      return oldRow;
    },
    [isNextSubmitForce, onItemEditSubmit]
  );

  const handleRowDelete = useCallback(
    (params: GridRenderCellParams) => {
      onItemDelete(
        +params.id.valueOf(),
        `${params.row?.author} - ${params.row?.name}`
      );
    },
    [onItemDelete]
  );

  const handleRatingChange = useCallback(
    (params: GridRenderCellParams, rating: number) => {
      const index = data.findIndex((item) => item.id === +params.id);
      if (index !== -1) {
        onItemRatingChange(index, rating);
      }
    },
    [data, onItemRatingChange]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "subtitle", headerName: "Author", flex: 1, editable: true },
      { field: "title", headerName: "Name", flex: 1, editable: true },
      {
        field: "rating",
        headerName: "Rating",
        width: 110,
        display: "flex",
        renderCell: (params) => (
          <Rating
            value={params.row.rating}
            size="small"
            onChange={(_, value) => handleRatingChange(params, value ?? 0)}
          />
        ),
      },
      {
        field: "action",
        headerName: "Action",
        sortable: false,
        filterable: false,
        width: 80,
        display: "flex",
        renderCell: (params) => (
          <Tooltip title="Delete">
            <IconButton onClick={() => handleRowDelete(params)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [handleRatingChange, handleRowDelete]
  );

  return (
    <ThemeProvider theme={lightTheme}>
      <Box bgcolor="grey.100" borderRadius={1}>
        <DataGrid
          apiRef={apiRef}
          className="w-full"
          columns={columns}
          rows={data}
          density="compact"
          paginationMode="server"
          sortingMode="server"
          sortingOrder={["asc", "desc"]}
          disableColumnFilter
          disableColumnMenu
          hideFooter
          rowCount={rowCount}
          paginationModel={{
            page: paginationParams.page,
            pageSize: paginationParams.limit,
          }}
          sortModel={[sortingParams]}
          onCellEditStart={handleCellEditStart}
          onCellEditStop={handleCellEditStop}
          onCellKeyDown={handleCellKeydown}
          onSortModelChange={handleSortModelChange}
          processRowUpdate={handleProcessRowUpdate}
        />
      </Box>
    </ThemeProvider>
  );
};

export default AlbumGrid;
