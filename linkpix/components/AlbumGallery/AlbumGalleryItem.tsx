import React, { useCallback, useRef } from "react";
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
import { AlbumItem } from "@/types/album";

interface AlbumListItemProps {
  title: string;
  subtitle: string;
  thumb: string;
  rating: number;
  info: AlbumItem["info"];
  isSelected: boolean;
  onClick: () => void;
  onSelect: () => void;
  onRatingChange: (rating: number) => void;
}

const AlbumGalleryItem = (props: AlbumListItemProps) => {
  const {
    title,
    subtitle,
    thumb,
    rating,
    info,
    isSelected,
    onClick,
    onSelect,
    onRatingChange,
  } = props;
  const cardRef = useRef<HTMLButtonElement>(null);

  const size = info.size as string;

  // TODO: scrollIntoView
  // useEffect(() => {
  //   if (isSelected && cardRef.current) {
  //     cardRef.current.focus();
  //   }
  // }, [isSelected]);

  const handleRatingChange = useCallback(
    (_event: React.SyntheticEvent, value: number | null) => {
      onRatingChange(value ?? 0);
    },
    [onRatingChange]
  );

  return (
    <Grid item xs={1} maxHeight={256} sx={{ aspectRatio: 3 / 4 }}>
      <Card
        elevation={isSelected ? 10 : 4}
        sx={{ height: "100%" }}
        onClick={onClick}
        onMouseEnter={onSelect}
      >
        <CardActionArea ref={cardRef} className="h-full">
          <CardContent
            className="relative h-full flex flex-col justify-end"
            sx={{ p: 0 }}
          >
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/image/thumbs/${thumb}`}
                alt={title}
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
                  {title}
                </Typography>
              </Stack>

              <Stack direction="row" gap={1}>
                <Typography
                  color={isSelected ? "common.black" : "grey.100"}
                  fontSize={"0.75rem"}
                  className="flex-1 line-clamp-1 transition"
                >
                  {subtitle}
                </Typography>
                <Typography
                  color={isSelected ? "common.black" : "grey.100"}
                  fontSize={"0.75rem"}
                  className="line-clamp-1 transition"
                >
                  {size}
                </Typography>
              </Stack>
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

export default AlbumGalleryItem;
