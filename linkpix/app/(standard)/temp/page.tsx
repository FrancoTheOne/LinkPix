"use client";
import { increment, decrement } from "@/lib/counter/counterSlice";
import { RootState } from "@/lib/store";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

const Temp = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Temp;
