"use client";
import React, { useCallback, useEffect, useState } from "react";
import AlbumGalleryItem from "./AlbumGalleryItem";
import { Grid } from "@mui/material";
import useBreakpoint from "@/hook/useBreakpoint";
import { AlbumItem } from "@/types/album";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const NUM_OF_COLUMN: Record<string, number> = {
  xs: 3,
  sm: 4,
  md: 5,
  lg: 6,
  xl: 7,
};

interface AlbumListProps {
  data: AlbumItem[];
  onItemEditSubmit: (
    album: Partial<AlbumItem> & Required<Pick<AlbumItem, "id">>,
    prev?: Partial<AlbumItem>
  ) => void;
  onItemAction: (id: number) => void;
}

const AlbumGallery = (props: AlbumListProps) => {
  const { data, onItemEditSubmit, onItemAction } = props;
  const isKeyShortcutDisabled = useSelector(
    (state: RootState) => state.setting.isKeyShortcutDisabled
  );

  const [selectIndex, setSelectIndex] = useState(0);
  const { breakPointName } = useBreakpoint();

  useEffect(() => {
    setSelectIndex((prev) => (prev >= data.length ? 0 : prev));
  }, [data]);

  const handleRatingKeydown = useCallback(
    (rating: number) => {
      onItemEditSubmit({
        id: data[selectIndex].id,
        rating: data[selectIndex].rating === rating ? 0 : rating,
      });
    },
    [data, onItemEditSubmit, selectIndex]
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
          onItemAction(data[selectIndex].id);
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
    if (!isKeyShortcutDisabled) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    breakPointName,
    data,
    handleRatingKeydown,
    isKeyShortcutDisabled,
    onItemAction,
    selectIndex,
  ]);

  return (
    <Grid container columns={NUM_OF_COLUMN} spacing={1}>
      {data.map((album, index) => (
        <AlbumGalleryItem
          key={album.id}
          title={album.title}
          subtitle={album.subtitle}
          thumb={album.thumb}
          rating={album.rating}
          info={album.info}
          isSelected={index === selectIndex}
          onClick={() => onItemAction(album.id)}
          onSelect={() => setSelectIndex(index)}
          onRatingChange={(rating: number) =>
            onItemEditSubmit({ id: album.id, rating })
          }
        />
      ))}
    </Grid>
  );
};

export default AlbumGallery;
