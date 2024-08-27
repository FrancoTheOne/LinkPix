import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { darkTheme as theme } from "@/theme";

interface AlbumListItemProps {
  name: string;
  thumbnail: string;
  category: string;
  author: string;
  source: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AlbumListItem = (props: AlbumListItemProps) => {
  const { name, thumbnail, category, author, source, isSelected, onSelect } =
    props;
  const cardRef = useRef<HTMLAnchorElement>(null);

  // TODO: scrollIntoView
  // useEffect(() => {
  //   if (isSelected && cardRef.current) {
  //     cardRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [isSelected]);

  return (
    <Grid item xs={1} maxHeight={256} sx={{ aspectRatio: 3 / 4 }}>
      <Card elevation={isSelected ? 10 : 4} sx={{ height: "100%" }}>
        <CardActionArea
          ref={cardRef}
          className="h-full"
          href={source}
          target="_blank"
          // href="/album"
          onMouseEnter={onSelect}
        >
          <CardContent
            className="relative h-full flex flex-col justify-end"
            sx={{ p: 0 }}
          >
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/image/thumbnails/${thumbnail}`}
                alt={name}
                draggable={false}
                className={`absolute w-full h-full object-cover transition-all ${
                  isSelected && "scale-110"
                }`}
              />
            }
            <Box
              position={"relative"}
              px={1}
              py={0.5}
              bgcolor={alpha(
                isSelected
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
                0.9
              )}
              className={"transition-all"}
            >
              <Typography
                color={isSelected ? "grey.900" : "grey.100"}
                fontSize={"0.875rem"}
                className="line-clamp-2 transition"
              >
                {name}
              </Typography>

              <Typography
                color={isSelected ? "common.black" : "grey.100"}
                fontSize={"0.75rem"}
                className="line-clamp-1 transition"
              >
                {author}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default AlbumListItem;
