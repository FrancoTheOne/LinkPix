type AlbumItem = {
  id: number;
  title: string;
  subtitle: string;
  action: string;
  thumb: string;
  tags: string;
  rating: number;
  info: Record<string, unknown>;
  content: Record<string, unknown>;
  lastViewAt: string;
};

export type { AlbumItem };
