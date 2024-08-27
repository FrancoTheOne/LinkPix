import { lightTheme } from "@/theme";
import { Album } from "@/types/album";
import { PaginationParams, SortingParams } from "@/types/common";
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridSortModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import React, { useCallback } from "react";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "author", headerName: "Author", flex: 1, editable: true },
  { field: "name", headerName: "Name", flex: 1, editable: true },
];

interface AlbumGridProps {
  data: Album[];
  rowCount: number;
  paginationParams: PaginationParams;
  sortingParams: SortingParams;
  onSort: (field: string, sort: SortingParams["sort"]) => void;
  onEditSubmit: (
    album: Partial<Album> & Required<Pick<Album, "id">>
  ) => Promise<void>;
}

const AlbumGrid = (props: AlbumGridProps) => {
  const {
    data,
    rowCount,
    paginationParams,
    sortingParams,
    onSort,
    onEditSubmit,
  } = props;
  const apiRef = useGridApiRef();

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      if (model.length) {
        onSort(model[0].field, model[0].sort ?? "desc");
      }
    },
    [onSort]
  );

  const handleCellClick = useCallback(
    (params: GridCellParams) => {
      if (
        apiRef.current &&
        apiRef.current.getCellMode(params.id, params.field) === "view"
      ) {
        apiRef.current.startCellEditMode({
          id: params.id,
          field: params.field,
        });
      }
    },
    [apiRef]
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
        try {
          await onEditSubmit({
            id: Number(newRow.id),
            ...Object.fromEntries(updateData),
          });
        } catch (err) {
          console.log(err);
          return oldRow;
        }
        return newRow;
      } else {
        return oldRow;
      }
    },
    [onEditSubmit]
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
          onCellClick={handleCellClick}
          onSortModelChange={handleSortModelChange}
          processRowUpdate={handleProcessRowUpdate}
        />
      </Box>
    </ThemeProvider>
  );
};

export default AlbumGrid;
