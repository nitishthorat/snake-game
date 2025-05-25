import React from "react";
import { View } from "react-native";

const CELL_SIZE = 20;

export default function Snake({ body, direction }) {
  return (
    <>
      {body.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === body.length - 1;

        let borderRadiusStyle = {};

        if (isHead) {
          borderRadiusStyle = {
            borderTopLeftRadius:
              direction === "left" || direction === "up" ? CELL_SIZE / 2 : 0,
            borderTopRightRadius:
              direction === "right" || direction === "up" ? CELL_SIZE / 2 : 0,
            borderBottomLeftRadius:
              direction === "left" || direction === "down" ? CELL_SIZE / 2 : 0,
            borderBottomRightRadius:
              direction === "right" || direction === "down" ? CELL_SIZE / 2 : 0,
          };
        } else if (isTail) {
          const prev = body[index - 1];
          const dx = segment.x - prev.x;
          const dy = segment.y - prev.y;

          borderRadiusStyle = {
            borderTopLeftRadius: dx === -1 || dy === -1 ? CELL_SIZE / 2 : 0,
            borderTopRightRadius: dx === 1 || dy === -1 ? CELL_SIZE / 2 : 0,
            borderBottomLeftRadius: dx === -1 || dy === 1 ? CELL_SIZE / 2 : 0,
            borderBottomRightRadius: dx === 1 || dy === 1 ? CELL_SIZE / 2 : 0,
          };
        } else {
          const prev = body[index - 1];
          const next = body[index + 1];

          const dxPrev = segment.x - prev.x;
          const dyPrev = segment.y - prev.y;
          const dxNext = next.x - segment.x;
          const dyNext = next.y - segment.y;

          const isTurning = dxPrev !== dxNext || dyPrev !== dyNext;

          if (isTurning) {
            // Identify the curve type by checking the turn direction
            const turn = `${dxPrev},${dyPrev}->${dxNext},${dyNext}`;

            // Define which corner to round
            const radius = CELL_SIZE / 2;
            switch (turn) {
              case "1,0->0,1":
              case "0,-1->-1,0":
                borderRadiusStyle.borderTopRightRadius = radius;
                break;
              case "-1,0->0,1":
              case "0,-1->1,0":
                borderRadiusStyle.borderTopLeftRadius = radius;
                break;
              case "0,1->1,0":
              case "-1,0->0,-1":
                borderRadiusStyle.borderBottomLeftRadius = radius;
                break;
              case "0,1->-1,0":
              case "1,0->0,-1":
                borderRadiusStyle.borderBottomRightRadius = radius;
                break;
            }
          }
        }

        return (
          <View
            key={index}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: "green",
              position: "absolute",
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              ...borderRadiusStyle,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isHead && (
              <>
                <View
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 3,
                    width: 6,
                    height: 6,
                    backgroundColor: "white",
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 2.5,
                      height: 2.5,
                      backgroundColor: "black",
                      borderRadius: 1.25,
                    }}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    width: 6,
                    height: 6,
                    backgroundColor: "white",
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 2.5,
                      height: 2.5,
                      backgroundColor: "black",
                      borderRadius: 1.25,
                    }}
                  />
                </View>
              </>
            )}
          </View>
        );
      })}
    </>
  );
}
