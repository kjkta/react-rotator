import React, { Component } from 'react';
import { render } from 'react-dom';
import useMouse from "@rooks/use-mouse"
import debounce from "lodash.debounce"

function Rotator({ children, enableDragging = true, initialDegree = 0 }) {
  const ref = React.useRef(null)
  const [degree, setDegree] = React.useState(initialDegree);
  const mousePos = useMouse()
  const handleRef = React.useRef(null)
  const isDragging = useDragging(handleRef.current)

  React.useEffect(function () {
    if (ref.current && enableDragging && isDragging) {
      const rect = ref.current.getBoundingClientRect()
      const centerX = (rect.left + rect.right) / 2
      const centerY = (rect.top + rect.bottom) / 2

      const radians = Math.atan2(mousePos.clientX - centerX, mousePos.clientY - centerY)
      const degree = Math.round((radians * (180 / Math.PI) * -1) + 100) + 80;
      setDegree(degree)
    }
  }, [mousePos, ref.current, isDragging])

  const color = "blue";
  const size = 10
  const height = 30

  return <div
    ref={ref}

    style={{ position: "relative", backgroundColor: "yellow", display: "inline-block", width: 100, height: 200, transform: `rotate(${degree}deg)` }}
  >
    {isDragging.toString()}
    {enableDragging &&
      <div ref={handleRef} style={{ height, width: 2, backgroundColor: color, position: "absolute", left: "50%", top: -height, transform: "translateX(-50%)" }} >
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: -size, backgroundColor: color, width: size, height: size, borderRadius: "50%", cursor: "col-resize" }} />
        </div>
      </div>
    }
    {children}
  </div>
}

function useDragging(el) {
  const [mouseDown, setMouseDown] = React.useState(false)
  const [moving, setMoving] = React.useState(false);

  const MOUSE_DOWN = "MOUSE_DOWN"
  const MOUSE_MOVE = "MOUSE_MOVE"
  const MOUSE_UP = "MOUSE_UP"
  const [{ mouseDown, mouseDragging }, dispatch] = React.useReducer(function (state, action) {
    switch (action.type) {
      case MOUSE_DOWN: return { mouseDown: true, mouseDragging: false };
      case MOUSE_MOVE: return { ...state, mouseDragging: state.mouseDown ? true : false };
      case MOUSE_UP: return { mouseDown: false, mouseDragging: false }
    }
  }, { mouseDown: false, mouseDragging: false })


  function handleMouseDown() {
    dispatch({ type: MOUSE_DOWN })
  }

  function handleMouseMove() {
    dispatch({ type: MOUSE_MOVE })
  }

  function handleMouseUp() {
    dispatch({ type: MOUSE_UP })
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

  return mouseDragging
}

render(<div style={{ margin: 50 }}><Rotator /></div>, document.getElementById('root'));
