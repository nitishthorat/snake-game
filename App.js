import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Vibration,
} from "react-native";
import React, { useState, useRef } from "react";
import Snake from "./components/Snake";
import { GameEngine } from "react-native-game-engine";
import Food from "./components/Food";
import Obstacle from "./components/Obstacle";

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
  const [moveInterval, setMoveInterval] = useState(250); // starting speed
  const MIN_INTERVAL = 50;
  const timeSinceLastMove = useRef(0);
  const directionRef = useRef("right");
  const gameEngineRef = useRef(null);
  let foodPos = generateRandomFoodPosition(initialSnake);
  let obstaclePositions = useRef(generateObstacles(initialSnake, foodPos));

  const resetGame = () => {
    directionRef.current = "right";
    timeSinceLastMove.current = 0;
    setMoveInterval(250);
    foodPos = generateRandomFoodPosition(initialSnake);
    obstaclePositions.current = generateObstacles(initialSnake, foodPos);

    gameEngineRef.current.swap({
      snake: {
        body: initialSnake,
        direction: "right",
        renderer: <Snake />,
      },
      food: {
        position: foodPos,
        renderer: <Food />,
      },
      obstacles: {
        positions: obstaclePositions.current,
        renderer: <Obstacle />,
      },
    });

    setRunning(true);
  };

  function generateRandomFoodPosition(snakeBody) {
    let position;

    do {
      position = {
        x: Math.floor(Math.random() * MAX_X),
        y: Math.floor(Math.random() * MAX_Y),
      };
    } while (
      snakeBody.some(
        (segment) => segment.x === position.x && segment.y === position.y
      )
    );

    return position;
  }

  function generateObstacles(snakeBody, foodPos, count = 5) {
    const allPositions = [];

    for (let x = 0; x < MAX_X; x++) {
      for (let y = 0; y < MAX_Y; y++) {
        allPositions.push({ x, y });
      }
    }

    const isOccupied = (pos) =>
      snakeBody.some((seg) => seg.x === pos.x && seg.y === pos.y) ||
      (foodPos.x === pos.x && foodPos.y === pos.y);

    const available = allPositions.filter((pos) => !isOccupied(pos));

    // Shuffle and pick `count` positions
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }

    return available.slice(0, count);
  }

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
    let food = entities.food;
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

    if (newHead.x === food.position.x && newHead.y === food.position.y) {
      snake.body = [newHead, ...snake.body];

      Vibration.vibrate(20);

      if (moveInterval > MIN_INTERVAL && moveInterval - 10 > MIN_INTERVAL) {
        setMoveInterval(moveInterval - 10);
      }
      food.position = generateRandomFoodPosition(snake.body);
    } else {
      snake.body = [newHead, ...snake.body.slice(0, -1)];
    }

    const hasSelfCollision = snake.body.some((segment, index) => {
      // ignore the current head (index === 0)
      return index !== 0 && segment.x === newHead.x && segment.y === newHead.y;
    });

    const hasObstacleCollision = obstaclePositions.current.some((segment) => {
      return segment.x === newHead.x && segment.y === newHead.y;
    });

    if (hasSelfCollision || hasObstacleCollision) {
      Vibration.vibrate(50);
      setRunning(false); // stop the game
      return entities;
    }

    return entities;
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.gameBoard}>
        <GameEngine
          ref={gameEngineRef}
          style={styles.gameBoard}
          systems={[SnakeSystem]}
          running={running}
          entities={{
            snake: {
              body: initialSnake,
              direction: "right",
              renderer: <Snake />,
            },
            food: {
              position: foodPos,
              renderer: <Food />,
            },
            obstacles: {
              positions: obstaclePositions.current,
              renderer: <Obstacle />,
            },
          }}
        />
        {!running && (
          <View style={styles.gameOverOverlay}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
              <Text style={styles.restartButtonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
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
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  gameOverText: {
    fontSize: 32,
    color: "white",
    marginBottom: 20,
  },
  restartButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#00cc99",
    borderRadius: 8,
  },
  restartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
