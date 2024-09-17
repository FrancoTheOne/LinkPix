import {
  activateKeyShortcut,
  deactivateKeyShortcut,
} from "@/lib/setting/settingSlice";
import { TextField } from "@mui/material";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";

interface AlbumSearchProps {
  onChange: (value: string) => void;
}

const AlbumSearch = (props: AlbumSearchProps) => {
  const { onChange } = props;
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const prevValue = useRef("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== prevValue.current) {
        onChange(value);
        prevValue.current = value;
      }
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

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    dispatch(deactivateKeyShortcut());
  }, [dispatch]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    dispatch(activateKeyShortcut());
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Backquote") {
        event.preventDefault();
        setIsFocused((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
