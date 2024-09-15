"use client";
import { Button, Container } from "@mui/material";
import { useCallback } from "react";
import {
  useCreateAlbumMutation,
  useGetRepositoryQuery,
} from "@/services/repository";
import { Repository } from "@/types/repository";

const Home = () => {
  const { data: repository } = useGetRepositoryQuery({});
  const [createRepository] = useCreateAlbumMutation();

  const handleAlbumCreate = useCallback(
    async (repository: Omit<Repository, "id">) => {
      try {
        await createRepository(repository);
      } catch (err) {
        console.log(err);
      }
    },
    [createRepository]
  );

  const handleAlbumCreateRequest = useCallback(() => {
    const name = prompt("Table name");
    if (name) {
      handleAlbumCreate({ name });
    }
  }, [handleAlbumCreate]);

  return (
    <>
      {repository !== undefined ? (
        <Container sx={{ py: 3 }} maxWidth="xl">
          <Button onClick={handleAlbumCreateRequest} variant="outlined">
            Create
          </Button>
          {repository.data.map((album) => (
            <Button
              href={`/album/${album.id}`}
              key={album.id}
              variant="contained"
            >{`${album.id} ${album.name}`}</Button>
          ))}
        </Container>
      ) : (
        <Container sx={{ py: 3 }} maxWidth="xl"></Container>
      )}
    </>
  );
};

export default Home;
