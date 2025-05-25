import React from "react";
import { View } from "react-native";

const CELL_SIZE = 20;

export default function Food({ position }) {
  return (
    <View
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        position: "absolute",
        left: position.x * CELL_SIZE,
        top: position.y * CELL_SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Red Apple Base */}
      <View
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: "red",
          borderRadius: CELL_SIZE / 2,
          position: "relative",
        }}
      >
        {/* Green Leaf */}
        <View
          style={{
            width: 5,
            height: 5,
            backgroundColor: "limegreen",
            borderRadius: 2.5,
            position: "absolute",
            top: 1,
            right: 1,
            transform: [{ rotate: "-30deg" }],
          }}
        />
      </View>
    </View>
  );
}
