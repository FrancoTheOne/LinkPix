"use client";
import React, { useCallback, useEffect, useState } from "react";
import AlbumGalleryItem from "./AlbumGalleryItem";
import { Grid } from "@mui/material";
import useBreakpoint from "@/hook/useBreakpoint";
import { AlbumItem } from "@/types/album";

const NUM_OF_COLUMN: Record<string, number> = {
  xs: 3,
  sm: 4,
  md: 5,
  lg: 6,
  xl: 7,
};

interface AlbumListProps {
  data: AlbumItem[];
  isKeyInterrupt: boolean;
  onItemClick: (index: number) => void;
  onItemRatingChange: (index: number, rating: number) => void;
}

const AlbumGallery = (props: AlbumListProps) => {
  const { data, isKeyInterrupt, onItemClick, onItemRatingChange } = props;
  const [selectIndex, setSelectIndex] = useState(0);
  const { breakPointName } = useBreakpoint();

  useEffect(() => {
    setSelectIndex((prev) => (prev >= data.length ? 0 : prev));
  }, [data]);

  const handleRatingKeydown = useCallback(
    (rating: number) => {
      onItemRatingChange(
        selectIndex,
        data[selectIndex].rating === rating ? 0 : rating
      );
    },
    [data, onItemRatingChange, selectIndex]
  );

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
          onItemClick(selectIndex);
          break;
        case "Digit0":
          handleRatingKeydown(0);
          break;
        case "Digit1":
          handleRatingKeydown(1);
          break;
        case "Digit2":
          handleRatingKeydown(2);
          break;
        case "Digit3":
          handleRatingKeydown(3);
          break;
        case "Digit4":
          handleRatingKeydown(4);
          break;
        case "Digit5":
          handleRatingKeydown(5);
          break;
        default:
      }
    };
    if (!isKeyInterrupt) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    breakPointName,
    data,
    handleRatingKeydown,
    isKeyInterrupt,
    onItemClick,
    selectIndex,
  ]);

  return (
    <Grid container columns={NUM_OF_COLUMN} spacing={1}>
      {data.map((album, index) => (
        <AlbumGalleryItem
          key={index}
          title={album.title}
          subtitle={album.subtitle}
          thumb={album.thumb}
          rating={album.rating}
          info={album.info}
          isSelected={index === selectIndex}
          onClick={() => onItemClick(index)}
          onSelect={() => setSelectIndex(index)}
          onRatingChange={(rating: number) => onItemRatingChange(index, rating)}
        />
      ))}
    </Grid>
  );
};

export default AlbumGallery;
