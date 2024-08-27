type PaginationParams = {
  page: number;
  limit: number;
};

type SortingParams = {
  field: string;
  sort: "asc" | "desc";
};

export type { PaginationParams, SortingParams };
