import React from "react";

export default function useRotator(initialDegree, enableDragging = true) {
  const ref = React.useRef(null);
  const [degree, setDegree] = React.useState(initialDegree);
  const handleRef = React.useRef(null);
  const [isDragging, mousePos] = useDragging(handleRef.current);

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
  const [{ mouseDragging, mousePosition }, dispatch] = React.useReducer(
    function(state, action) {
      switch (action.type) {
        case MOUSE_DOWN:
          return {
            mouseDown: true,
            mouseDragging: false,
            mousePosition: action.payload
          };
        case MOUSE_MOVE:
          return {
            ...state,
            mouseDragging: state.mouseDown ? true : false,
            mousePosition: action.payload
          };
        case MOUSE_UP:
          return {
            mouseDown: false,
            mouseDragging: false,
            mousePosition: action.payload
          };
        default:
          return state;
      }
    },
    {
      mouseDown: false,
      mouseDragging: false,
      mousePosition: { clientX: null, clientY: null }
    }
  );

  function handleMouseDown({ clientX, clientY }) {
    dispatch({ type: MOUSE_DOWN, payload: { clientX, clientY } });
  }

  function handleMouseMove({ clientX, clientY }) {
    dispatch({ type: MOUSE_MOVE, payload: { clientX, clientY } });
  }

  function handleMouseUp({ clientX, clientY }) {
    dispatch({ type: MOUSE_UP, payload: { clientX, clientY } });
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

  return [mouseDragging, mousePosition];
}
