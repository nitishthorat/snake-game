import { View, Text } from "react-native";
import React from "react";

const CELL_SIZE = 20;

const Food = ({ position }) => {
  return (
    <View
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: "red",
        position: "absolute",
        left: position.x * CELL_SIZE,
        top: position.y * CELL_SIZE,
      }}
    ></View>
  );
};

export default Food;
