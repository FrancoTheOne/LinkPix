import { Box, Stack } from "@mui/material";
import React from "react";

type AlbumDataType = {
  prefix: string;
  data: string[];
};

const AlbumPage = async () => {
  const res = await fetch("http://localhost:3001/album/5");
  let album = await res.json();
  const { prefix: imgPrefix, data: imgList }: AlbumDataType = JSON.parse(
    album.data
  );
  const data = imgList.map((img) => `${imgPrefix}${img}`);
  return (
    <Stack height={"100%"} sx={{ py: 3 }}>
      {imgList.slice(0, 5).map((img, index) => (
        <Box key={index} width={"100%"} height={"100%"}>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://picsum.photos/${
                Math.round(Math.random() * 600) + 400
              }/${Math.round(Math.random() * 600) + 400}`}
              alt="index"
              draggable={false}
            />
            // <img src={`${imgPrefix}${img}`} alt={index}></img>
          }
        </Box>
      ))}
    </Stack>
  );
};

export default AlbumPage;
