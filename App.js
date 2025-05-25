import { View, Text, Dimensions, StyleSheet, PanResponder } from "react-native";
import React, { useState, useRef } from "react";
import Snake from "./components/Snake";
import { GameEngine } from "react-native-game-engine";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const CELL_SIZE = 20;
const MAX_X = Math.floor(SCREEN_WIDTH / CELL_SIZE);
const MAX_Y = Math.floor(SCREEN_HEIGHT / CELL_SIZE);

const getNextHead = (head, direction) => {
  switch (direction) {
    case "up":
      return { x: head.x, y: head.y - 1 };
    case "down":
      return { x: head.x, y: head.y + 1 };
    case "left":
      return { x: head.x - 1, y: head.y };
    case "right":
      return { x: head.x + 1, y: head.y };
  }
};

const App = () => {
  const initialSnake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];
  const [running, setRunning] = useState(true);
  const moveInterval = 250;
  const timeSinceLastMove = useRef(0);
  const directionRef = useRef("right");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;

        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > 10 && directionRef.current !== "left") {
            directionRef.current = "right";
          } else if (dx < -10 && directionRef.current !== "right") {
            directionRef.current = "left";
          }
        } else {
          // Vertical swipe
          if (dy > 10 && directionRef.current !== "up") {
            directionRef.current = "down";
          } else if (dy < -10 && directionRef.current !== "down") {
            directionRef.current = "up";
          }
        }
      },
    })
  ).current;

  const SnakeSystem = (entities, { time }) => {
    let snake = entities.snake;
    let head = snake.body[0];

    timeSinceLastMove.current += time.delta;

    if (timeSinceLastMove.current < moveInterval) {
      return entities;
    }

    timeSinceLastMove.current = 0;

    snake.direction = directionRef.current;

    let newHead = getNextHead(head, snake.direction);

    // Screen wrapping logic
    newHead.x = (newHead.x + MAX_X) % MAX_X;
    newHead.y = (newHead.y + MAX_Y) % MAX_Y;

    snake.body = [newHead, ...snake.body.slice(0, -1)];

    return entities;
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.gameBoard}>
        <GameEngine
          style={styles.gameBoard}
          systems={[SnakeSystem]}
          running={running}
          entities={{
            snake: {
              body: initialSnake,
              direction: "right",
              renderer: <Snake />,
            },
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  gameBoard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#111",
    position: "relative",
  },
});

export default App;
