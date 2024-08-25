import { TextField } from "@mui/material";
import React, {
  ChangeEvent,
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface AlbumSearchProps {
  isFocused: boolean;
  onChange: (value: string) => void;
  onFocusChange: (isFocused: boolean) => void;
}

const AlbumSearch = (props: AlbumSearchProps) => {
  const { isFocused, onChange, onFocusChange } = props;
  const [value, setValue] = useState("");
  const [_, setPrevValue] = useState("");
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevValue((prev) => {
        if (value !== prev) {
          onChange(value);
          return value;
        } else {
          return prev;
        }
      });
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, onChange]);

  useEffect(() => {
    isFocused ? inputRef.current?.focus() : inputRef.current?.blur();
  }, [isFocused]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleFocus = useCallback(() => onFocusChange(true), [onFocusChange]);

  const handleBlur = useCallback(() => onFocusChange(false), [onFocusChange]);

  return (
    <TextField
      inputRef={inputRef}
      id="search"
      label="Search (Press `)"
      variant="filled"
      size="small"
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default AlbumSearch;
