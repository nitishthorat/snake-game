import React from "react";
import { View } from "react-native";

const CELL_SIZE = 20;

export default function Obstacle({ positions }) {
  return (
    <>
      {positions.map((pos, index) => (
        <View
          key={index}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: "#6c5ce7", // deep purple for visibility
            position: "absolute",
            left: pos.x * CELL_SIZE,
            top: pos.y * CELL_SIZE,
            borderRadius: 4, // slightly rounded edges
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
