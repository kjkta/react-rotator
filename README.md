# useRotator

Rotate an element with a handle

```jsx
function App() {
  const [rotatableRef, handleRef, degree, isDragging] = useRotator(
    initialDegree,
    enableDragging
  );
  return (
    <div>
      <div ref={handleRef} style={{ cursor: "grab" }}>
        Grab me to rotate
      </div>
      <div ref={rotatableRef} style={{ transform: `translate(${degree}deg)` }}>
        I can be rotated!
      </div>
    </div>
  );
}
```
