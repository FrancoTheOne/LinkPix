"use client";
import React, { useCallback, useEffect, useState } from "react";
import AlbumListItem from "./AlbumListItem";
import { Grid } from "@mui/material";
import useBreakpoint from "@/hook/useBreakpoint";
import { Album } from "@/services/album/useGetAlbumList";

const NUM_OF_COLUMN: Record<string, number> = {
  xs: 3,
  sm: 4,
  md: 5,
  lg: 6,
  xl: 7,
};

interface AlbumListProps {
  data: Album[];
  isKeyInterrupt: boolean;
}

const AlbumList = (props: AlbumListProps) => {
  const { data, isKeyInterrupt } = props;
  const [selectIndex, setSelectIndex] = useState(0);
  const { breakPointName } = useBreakpoint();

  useEffect(() => {
    setSelectIndex(0);
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const numOfColumn = NUM_OF_COLUMN[breakPointName];
      switch (event.code) {
        case "KeyW":
          setSelectIndex((prev) => {
            let result =
              (Math.floor(prev / numOfColumn) - 1) * numOfColumn +
              (prev % numOfColumn);
            if (result < 0) {
              while (result + numOfColumn < data.length) {
                result += numOfColumn;
              }
            }
            return result;
          });
          break;
        case "KeyS":
          setSelectIndex((prev) => {
            let result =
              (Math.floor(prev / numOfColumn) + 1) * numOfColumn +
              (prev % numOfColumn);
            return result < data.length ? result : prev % numOfColumn;
          });
          break;
        case "KeyA":
          setSelectIndex((prev) =>
            Math.min(
              Math.floor(prev / numOfColumn) * numOfColumn +
                ((prev - 1 + numOfColumn) % numOfColumn),
              data.length - 1
            )
          );
          break;
        case "KeyD":
          setSelectIndex((prev) => {
            const result =
              Math.floor(prev / numOfColumn) * numOfColumn +
              ((prev + 1) % numOfColumn);
            return result < data.length
              ? result
              : Math.floor(prev / numOfColumn) * numOfColumn;
          });
          break;
        case "KeyC":
          window.open(data[selectIndex].source, "_blank");
        default:
      }
    };
    if (!isKeyInterrupt) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [breakPointName, data, isKeyInterrupt, selectIndex]);

  return (
    <Grid container columns={NUM_OF_COLUMN} spacing={2}>
      {data.map((album, index) => (
        <AlbumListItem
          key={index}
          name={album.name}
          category={album.category}
          author={album.author}
          thumbnail={album.thumbnail}
          source={album.source}
          isSelected={index === selectIndex}
          onSelect={() => setSelectIndex(index)}
        />
      ))}
    </Grid>
  );
};

export default AlbumList;
