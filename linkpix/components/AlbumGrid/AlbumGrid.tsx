import { lightTheme } from "@/theme";
import { Album } from "@/types/album";
import { PaginationParams, SortingParams } from "@/types/common";
import { ThemeProvider } from "@emotion/react";
import { Box, IconButton } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import React, { useCallback, useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface AlbumGridProps {
  data: Album[];
  rowCount: number;
  paginationParams: PaginationParams;
  sortingParams: SortingParams;
  onSort: (field: string, sort: SortingParams["sort"]) => void;
  onEditToggle: (isEditing: boolean) => void;
  onEditSubmit: (
    album: Partial<Album> & Required<Pick<Album, "id">>,
    prev: Partial<Album>
  ) => void;
  onDelete: (id: number, displayName: string) => void;
}

const AlbumGrid = (props: AlbumGridProps) => {
  const {
    data,
    rowCount,
    paginationParams,
    sortingParams,
    onSort,
    onEditToggle,
    onEditSubmit,
    onDelete,
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

  const handleCellEditStop = useCallback(() => {
    onEditToggle(false);
  }, [onEditToggle]);

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
        onEditSubmit(
          {
            id: Number(newRow.id),
            ...Object.fromEntries(updateData),
          },
          Object.fromEntries(
            updateData.map(([key]) => [key, oldRow[key as string]])
          )
        );
      }
      return oldRow;
    },
    [onEditSubmit]
  );

  const handleRowDelete = useCallback(
    (params: GridRenderCellParams) => {
      console.log();
      onDelete(
        +params.id.valueOf(),
        `${params.row?.author} - ${params.row?.name}`
      );
    },
    [onDelete]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "author", headerName: "Author", flex: 1, editable: true },
      { field: "name", headerName: "Name", flex: 1, editable: true },
      {
        field: "action",
        headerName: "Action",
        sortable: false,
        filterable: false,
        display: "flex",
        renderCell: (params) => (
          <IconButton onClick={() => handleRowDelete(params)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [handleRowDelete]
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
          onCellEditStop={handleCellEditStop}
          onSortModelChange={handleSortModelChange}
          processRowUpdate={handleProcessRowUpdate}
        />
      </Box>
    </ThemeProvider>
  );
};

export default AlbumGrid;
