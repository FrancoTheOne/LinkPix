import { Album } from "@/services/album/useGetAlbumList";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "author", headerName: "Author" },
  { field: "name", headerName: "Name" },
];

interface AlbumGridProps {
  data: Album[];
}

const AlbumGrid = (props: AlbumGridProps) => {
  const { data } = props;
  return <DataGrid columns={columns} rows={data} />;
};

export default AlbumGrid;
