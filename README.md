# useRotator

Rotate an element with a handle

```jsx
import React from "react";
import useRotator from "use-rotator";

function App() {
  const [rotatableRef, handleRef, degree, isDragging] = useRotator(0, true);
  return (
    <div>
      isDragging: {isDragging.toString()}
      <div ref={handleRef} style={{ cursor: "grab", userSelect: "none" }}>
        Grab me to rotate
      </div>
      <div
        ref={rotatableRef}
        style={{ display: "inline-block", transform: `rotate(${degree}deg)` }}
      >
        I can be rotated!
      </div>
    </div>
  );
}
```

Live: https://codesandbox.io/s/userotator-demo-0o722
