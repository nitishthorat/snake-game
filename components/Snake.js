import { View, Text } from "react-native";
import React from "react";

const CELL_SIZE = 20;

const Snake = ({ body }) => {
  return (
    <>
      {body.map((segment, index) => (
        <View
          key={index}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: "green",
            position: "absolute",
            left: segment.x * CELL_SIZE,
            top: segment.y * CELL_SIZE,
          }}
        />
      ))}
    </>
  );
};

export default Snake;
