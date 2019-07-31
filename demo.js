import React from 'react';
import { render } from 'react-dom';
import useRotator from "./index"

function App({ children, enableDragging = true, initialDegree = 0 }) {

  const [ref, handleRef, degree, isDragging] = useRotator(initialDegree, enableDragging)

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

render(<div style={{ margin: 50 }}><App /></div>, document.getElementById('root'));