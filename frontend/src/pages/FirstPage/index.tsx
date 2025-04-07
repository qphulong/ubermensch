import React, { useRef, useEffect } from "react";

const BALL_RADIUS = 20;
const GRAVITY = 98; // m/s²

interface Ball {
  centerX: number;
  centerY: number;
  vx: number;
  vy: number;
  radius: number;
  isDragging: boolean;
}

const FirstPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ball1Ref = useRef<HTMLDivElement>(null);
  const ball2Ref = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<Ball[]>([
    {
      centerX: 100,
      centerY: 100,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      isDragging: false,
    },
    {
      centerX: 300,
      centerY: 300,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      isDragging: false,
    },
  ]);
  const lastTimeRef = useRef<number>(0);
  const animationFrameId = useRef<number>(0);

  const handleBallCollision = (ball1: Ball, ball2: Ball) => {
    const dx = ball2.centerX - ball1.centerX;
    const dy = ball2.centerY - ball1.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const sumRadii = ball1.radius + ball2.radius;

    if (distance >= sumRadii) return;

    // Normal vector components
    const nx = dx / distance;
    const ny = dy / distance;

    // Tangent vector components
    const tx = -ny;
    const ty = nx;

    // Dot product tangent
    const v1t = ball1.vx * tx + ball1.vy * ty;
    const v2t = ball2.vx * tx + ball2.vy * ty;

    // Dot product normal
    const v1n = ball1.vx * nx + ball1.vy * ny;
    const v2n = ball2.vx * nx + ball2.vy * ny;

    // Swap normal velocities (perfect elastic collision)
    [ball1.vx, ball1.vy] = [
      v2n * nx + v1t * tx,
      v2n * ny + v1t * ty,
    ];
    [ball2.vx, ball2.vy] = [
      v1n * nx + v2t * tx,
      v1n * ny + v2t * ty,
    ];

    // Separate balls to prevent overlap
    const overlap = (sumRadii - distance) / 2;
    ball1.centerX -= overlap * nx;
    ball1.centerY -= overlap * ny;
    ball2.centerX += overlap * nx;
    ball2.centerY += overlap * ny;
  };

  const handleMouseDown = (e: React.MouseEvent, ballIndex: number) => {
    e.preventDefault();
    const container = containerRef.current;
    const ball = ballsRef.current[ballIndex];
    if (!container || !ball) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const offsetX = mouseX - ball.centerX;
    const offsetY = mouseY - ball.centerY;

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let newCenterX = mouseX - offsetX;
      let newCenterY = mouseY - offsetY;

      const maxX = rect.width - ball.radius;
      const maxY = rect.height - ball.radius;

      newCenterX = Math.max(ball.radius, Math.min(newCenterX, maxX));
      newCenterY = Math.max(ball.radius, Math.min(newCenterY, maxY));

      ball.centerX = newCenterX;
      ball.centerY = newCenterY;

      const ballElement = ballIndex === 0 ? ball1Ref.current : ball2Ref.current;
      if (ballElement) {
        ballElement.style.left = `${newCenterX - ball.radius}px`;
        ballElement.style.top = `${newCenterY - ball.radius}px`;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      ball.isDragging = false;
      ball.vx = 0;
      ball.vy = 0;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    ball.isDragging = true;
  };

  useEffect(() => {
    const animate = (timestamp: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      const deltaTime = lastTimeRef.current
        ? (timestamp - lastTimeRef.current) / 1000
        : 0;
      lastTimeRef.current = timestamp;

      ballsRef.current.forEach((ball) => {
        if (ball.isDragging) return;

        // Apply gravity
        ball.vy += GRAVITY * deltaTime;

        // Update position
        ball.centerX += ball.vx * deltaTime;
        ball.centerY += ball.vy * deltaTime;

        // Container collisions
        if (ball.centerX - ball.radius < 0) {
          ball.centerX = ball.radius;
          ball.vx *= -1;
        } else if (ball.centerX + ball.radius > containerWidth) {
          ball.centerX = containerWidth - ball.radius;
          ball.vx *= -1;
        }

        if (ball.centerY - ball.radius < 0) {
          ball.centerY = ball.radius;
          ball.vy *= -1;
        } else if (ball.centerY + ball.radius > containerHeight) {
          ball.centerY = containerHeight - ball.radius;
          ball.vy *= -1;
        }
      });

      // Ball collisions
      handleBallCollision(ballsRef.current[0], ballsRef.current[1]);

      // Update DOM
      if (ball1Ref.current) {
        ball1Ref.current.style.left = `${ballsRef.current[0].centerX - BALL_RADIUS}px`;
        ball1Ref.current.style.top = `${ballsRef.current[0].centerY - BALL_RADIUS}px`;
      }
      if (ball2Ref.current) {
        ball2Ref.current.style.left = `${ballsRef.current[1].centerX - BALL_RADIUS}px`;
        ball2Ref.current.style.top = `${ballsRef.current[1].centerY - BALL_RADIUS}px`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "400px",
          height: "400px",
          border: "2px solid black",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={ball1Ref}
          style={{
            position: "absolute",
            width: `${BALL_RADIUS * 2}px`,
            height: `${BALL_RADIUS * 2}px`,
            borderRadius: "50%",
            backgroundColor: "red",
            cursor: "pointer",
          }}
          onMouseDown={(e) => handleMouseDown(e, 0)}
        />
        <div
          ref={ball2Ref}
          style={{
            position: "absolute",
            width: `${BALL_RADIUS * 2}px`,
            height: `${BALL_RADIUS * 2}px`,
            borderRadius: "50%",
            backgroundColor: "blue",
            cursor: "pointer",
          }}
          onMouseDown={(e) => handleMouseDown(e, 1)}
        />
      </div>
    </div>
  );
};

export default FirstPage;