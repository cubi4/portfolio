import { useRef, useEffect } from "react";

const PingPongGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        let ballX = width / 2;
        let ballY = height / 2;
        let ballSpeedX = 2;
        let ballSpeedY = 2;
        const paddleWidth = 80;
        const paddleHeight = 10;
        let paddleX = width / 2 - paddleWidth / 2;

        let rightPressed = false;
        let leftPressed = false;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Ball
            ctx.beginPath();
            ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();

            // Paddle
            ctx.beginPath();
            ctx.rect(
                paddleX,
                height - paddleHeight - 10,
                paddleWidth,
                paddleHeight
            );
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();

            // Bewegung
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Kollision mit Wänden
            if (ballX + 10 > width || ballX - 10 < 0) ballSpeedX *= -1;
            if (ballY - 10 < 0) ballSpeedY *= -1;

            // Kollision mit Paddle
            if (
                ballY + 10 > height - paddleHeight - 10 &&
                ballX > paddleX &&
                ballX < paddleX + paddleWidth
            ) {
                ballSpeedY *= -1;
            }

            // Ball aus dem Spiel?
            if (ballY + 10 > height) {
                ballX = width / 2;
                ballY = height / 2;
                ballSpeedY = -2;
            }

            // Paddle bewegen
            if (rightPressed && paddleX < width - paddleWidth) {
                paddleX += 5;
            }
            if (leftPressed && paddleX > 0) {
                paddleX -= 5;
            }

            requestAnimationFrame(draw);
        };

        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight")
                rightPressed = true;
            if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.key === "Right" || e.key === "ArrowRight")
                rightPressed = false;
            if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
        };

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        draw();

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={480}
            height={320}
            style={{ border: "1px solid #000" }}
        />
    );
};

export default PingPongGame;
