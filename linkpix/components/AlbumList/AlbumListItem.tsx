import React, { useCallback, useEffect, useRef } from "react";
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { darkTheme as theme } from "@/theme";

interface AlbumListItemProps {
  name: string;
  thumbnail: string;
  category: string;
  author: string;
  source: string;
  rating: number;
  isSelected: boolean;
  onClick: () => void;
  onSelect: () => void;
  onRatingChange: (rating: number) => void;
}

const AlbumListItem = (props: AlbumListItemProps) => {
  const {
    name,
    thumbnail,
    category,
    author,
    source,
    rating,
    isSelected,
    onClick,
    onSelect,
    onRatingChange,
  } = props;
  const cardRef = useRef<HTMLDivElement>(null);

  // TODO: scrollIntoView
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.focus();
    }
  }, [isSelected]);

  const handleRatingChange = useCallback(
    (_event: React.SyntheticEvent, value: number | null) => {
      onRatingChange(value ?? 0);
    },
    [onRatingChange]
  );

  return (
    <Grid item xs={1} maxHeight={256} sx={{ aspectRatio: 3 / 4 }}>
      <Card
        ref={cardRef}
        elevation={isSelected ? 10 : 4}
        sx={{ height: "100%" }}
        onClick={onClick}
        onMouseEnter={onSelect}
      >
        <CardActionArea className="h-full">
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
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  color={isSelected ? "grey.900" : "grey.100"}
                  fontSize={"0.875rem"}
                  className="line-clamp-2 transition"
                >
                  {name}
                </Typography>
              </Stack>

              <Typography
                color={isSelected ? "common.black" : "grey.100"}
                fontSize={"0.75rem"}
                className="line-clamp-1 transition"
              >
                {author}
              </Typography>
              <Box
                sx={{ top: "-20px" }}
                className="absolute right-0 px-1"
                onClick={(event) => event.stopPropagation()}
              >
                <Rating
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "#eee",
                      filter: "drop-shadow(1px 1px 2px #111)",
                    },
                  }}
                  value={rating}
                  size="small"
                  color="secondary"
                  onChange={handleRatingChange}
                />
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default AlbumListItem;
