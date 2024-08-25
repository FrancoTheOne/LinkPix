import { useMediaQuery, useTheme } from "@mui/material";

const useBreakpoint = () => {
  const theme = useTheme();

  const mq_xs = useMediaQuery(theme.breakpoints.only("xs"));
  const mq_sm = useMediaQuery(theme.breakpoints.only("sm"));
  const mq_md = useMediaQuery(theme.breakpoints.only("md"));
  const mq_lg = useMediaQuery(theme.breakpoints.only("lg"));

  const breakPointName = mq_xs
    ? "xs"
    : mq_sm
    ? "sm"
    : mq_md
    ? "md"
    : mq_lg
    ? "lg"
    : "xl";

  return {
    breakPointName,
  };
};

export default useBreakpoint;
