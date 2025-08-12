import { Slide, SlideProps } from "@mui/material";
import React from "react";

export const SlideTransition = React.forwardRef<HTMLDivElement, SlideProps>(
  function Transition({ children, ...otherProps }, ref) {
    return (
      <Slide direction="down" ref={ref} {...otherProps}>
        {children}
      </Slide>
    );
  }
);
