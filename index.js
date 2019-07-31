import React from "react";
import useMouse from "@rooks/use-mouse";

export default function useRotator(initialDegree, enableDragging) {
  const ref = React.useRef(null);
  const [degree, setDegree] = React.useState(initialDegree);
  const mousePos = useMouse();
  const handleRef = React.useRef(null);
  const isDragging = useDragging(handleRef.current);

  React.useEffect(
    function() {
      if (ref.current && enableDragging && isDragging) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = (rect.left + rect.right) / 2;
        const centerY = (rect.top + rect.bottom) / 2;

        const radians = Math.atan2(
          mousePos.clientX - centerX,
          mousePos.clientY - centerY
        );
        const degree = Math.round(radians * (180 / Math.PI) * -1 + 100) + 80;
        setDegree(degree);
      }
    },
    [mousePos, ref.current, isDragging]
  );

  return [ref, handleRef, degree, isDragging];
}

const MOUSE_DOWN = "MOUSE_DOWN";
const MOUSE_MOVE = "MOUSE_MOVE";
const MOUSE_UP = "MOUSE_UP";
function useDragging(el) {
  const [{ mouseDown, mouseDragging }, dispatch] = React.useReducer(
    function(state, action) {
      switch (action.type) {
        case MOUSE_DOWN:
          return { mouseDown: true, mouseDragging: false };
        case MOUSE_MOVE:
          return { ...state, mouseDragging: state.mouseDown ? true : false };
        case MOUSE_UP:
          return { mouseDown: false, mouseDragging: false };
      }
    },
    { mouseDown: false, mouseDragging: false }
  );

  function handleMouseDown() {
    dispatch({ type: MOUSE_DOWN });
  }

  function handleMouseMove() {
    dispatch({ type: MOUSE_MOVE });
  }

  function handleMouseUp() {
    dispatch({ type: MOUSE_UP });
  }

  React.useEffect(() => {
    if (el) {
      el.addEventListener("mousedown", handleMouseDown);
      // Listen to any mouse move & mouse up in the document
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      if (el) {
        el.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [el]);

  return mouseDragging;
}
