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

        // Game states
        let gameState = "menu"; // "menu", "playing", "scoreboard"
        let highscores: number[] = [];
        let currentHighscore = 0;
        let gameInProgress = false;

        // Game variables
        let ballX = width / 2;
        let ballY = height / 2;
        let ballSpeedX = 2;
        let ballSpeedY = 2;
        const paddleWidth = 80;
        const paddleHeight = 10;
        let paddleX = width / 2 - paddleWidth / 2;
        let prevPaddleX = paddleX;
        let paddleSpeed = 0;

        let rightPressed = false;
        let leftPressed = false;
        let isPaused = false;
        let score = 0;
        let lastPaddleHitTime = 0;

        const generateRandomBallDirection = () => {
            // Random angle between -45 and 45 degrees (avoiding too steep angles)
            const angle = ((Math.random() - 0.5) * Math.PI) / 2;
            const speed = Math.max(2, Math.random() * 3 + 2); // Speed between 2 and 5

            ballSpeedX = Math.sin(angle) * speed;
            ballSpeedY = Math.cos(angle) * speed;

            // Randomly choose if ball goes up or down initially
            if (Math.random() < 0.5) {
                ballSpeedY *= -1;
            }
        };

        const startGame = () => {
            gameState = "playing";
            gameInProgress = true;
            score = 0;
            ballX = width / 2;
            ballY = height / 2;
            generateRandomBallDirection();
            paddleX = width / 2 - paddleWidth / 2;
            isPaused = false;
        };

        const continueGame = () => {
            gameState = "playing";
        };

        const gameOver = () => {
            if (score > 0) {
                highscores.push(score);
                highscores.sort((a, b) => b - a);
                highscores = highscores.slice(0, 10); // Keep only top 10
                currentHighscore = highscores[0]; // Update current highscore
            }
            // Reset score and restart ball
            score = 0;
            ballX = width / 2;
            ballY = height / 2;
            generateRandomBallDirection();
            paddleX = width / 2 - paddleWidth / 2;
        };

        const drawMenu = () => {
            ctx.clearRect(0, 0, width, height);

            // Title
            ctx.fillStyle = "#000000";
            ctx.font = "48px Arial";
            ctx.textAlign = "center";
            ctx.fillText("PING PONG", width / 2, height / 3);

            // Play/Continue Button
            const playButtonY = height / 2;
            ctx.fillStyle = "#0095DD";
            ctx.fillRect(width / 2 - 100, playButtonY - 25, 200, 50);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "24px Arial";
            ctx.fillText(
                gameInProgress ? "CONTINUE" : "PLAY",
                width / 2,
                playButtonY + 8
            );

            // Scoreboard Button
            const scoreButtonY = height / 2 + 80;
            ctx.fillStyle = "#0095DD";
            ctx.fillRect(width / 2 - 100, scoreButtonY - 25, 200, 50);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("SCOREBOARD", width / 2, scoreButtonY + 8);

            // Instructions
            ctx.fillStyle = "#666666";
            ctx.font = "16px Arial";
            ctx.fillText(
                "Use Arrow Keys to move, SPACE to pause, Escape to return to menu",
                width / 2,
                height - 30
            );
        };

        const drawScoreboard = () => {
            ctx.clearRect(0, 0, width, height);

            // Title
            ctx.fillStyle = "#000000";
            ctx.font = "36px Arial";
            ctx.textAlign = "center";
            ctx.fillText("HIGHSCORES", width / 2, 60);

            // Scores
            ctx.font = "24px Arial";
            if (highscores.length === 0) {
                ctx.fillStyle = "#666666";
                ctx.fillText("No scores yet", width / 2, height / 2);
            } else {
                for (let i = 0; i < Math.min(highscores.length, 10); i++) {
                    ctx.fillStyle = i === 0 ? "#FFD700" : "#000000";
                    ctx.fillText(
                        `${i + 1}. ${highscores[i]}`,
                        width / 2,
                        120 + i * 35
                    );
                }
            }

            // Back Button
            const backButtonY = height - 80;
            ctx.fillStyle = "#0095DD";
            ctx.fillRect(width / 2 - 80, backButtonY - 25, 160, 50);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "20px Arial";
            ctx.fillText("BACK", width / 2, backButtonY + 6);
        };

        const draw = () => {
            if (gameState === "menu") {
                drawMenu();
            } else if (gameState === "scoreboard") {
                drawScoreboard();
            } else if (gameState === "playing") {
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

                // Display Score
                ctx.fillStyle = "#000000";
                ctx.font = "20px Arial";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score}`, 20, 30);
                // Display Highscore
                ctx.fillText(`Highscore: ${currentHighscore}`, 20, 60);

                // Only update game logic if not paused
                if (!isPaused) {
                    // Bewegung
                    ballX += ballSpeedX;
                    ballY += ballSpeedY;

                    // Kollision mit Wänden
                    if (ballX + 10 > width || ballX - 10 < 0) ballSpeedX *= -1;
                    if (ballY - 10 < 0) ballSpeedY *= -1;

                    // Kollision mit Paddle
                    const now = performance.now();
                    if (
                        ballY + 10 > height - paddleHeight - 10 &&
                        ballY + 10 < height - 10 &&
                        ballX > paddleX &&
                        ballX < paddleX + paddleWidth &&
                        ballSpeedY > 0 &&
                        now - lastPaddleHitTime > 500
                    ) {
                        ballSpeedY *= -1;
                        // Ball bei jeder Berührung schneller machen
                        ballSpeedX *= 1.1;
                        ballSpeedY *= 1.1;
                        // Add paddle speed to ball (20% of paddle speed)
                        ballSpeedX += paddleSpeed * 0.2;
                        lastPaddleHitTime = now;
                        // Increment score
                        score++;
                    }

                    // Ball aus dem Spiel?
                    if (ballY + 10 > height) {
                        gameOver();
                    }

                    // Paddle bewegen
                    prevPaddleX = paddleX;
                    if (rightPressed && paddleX < width - paddleWidth) {
                        paddleX += 5;
                    }
                    if (leftPressed && paddleX > 0) {
                        paddleX -= 5;
                    }
                    // Calculate paddle speed
                    paddleSpeed = paddleX - prevPaddleX;
                }

                // Show pause indicator
                if (isPaused) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.fillRect(0, 0, width, height);
                    ctx.fillStyle = "#FFFFFF";
                    ctx.font = "48px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("PAUSED", width / 2, height / 2);
                    ctx.fillStyle = "#CCCCCC";
                    ctx.font = "24px Arial";
                    ctx.fillText(
                        "Press SPACE to continue",
                        width / 2,
                        height / 2 + 50
                    );
                }
            }

            requestAnimationFrame(draw);
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            if (gameState === "menu") {
                // Play/Continue button
                if (
                    x >= width / 2 - 100 &&
                    x <= width / 2 + 100 &&
                    y >= height / 2 - 25 &&
                    y <= height / 2 + 25
                ) {
                    if (gameInProgress) {
                        continueGame();
                    } else {
                        startGame();
                    }
                }
                // Scoreboard button
                if (
                    x >= width / 2 - 100 &&
                    x <= width / 2 + 100 &&
                    y >= height / 2 + 55 &&
                    y <= height / 2 + 105
                ) {
                    gameState = "scoreboard";
                }
            } else if (gameState === "scoreboard") {
                // Back button
                if (
                    x >= width / 2 - 80 &&
                    x <= width / 2 + 80 &&
                    y >= height - 105 &&
                    y <= height - 55
                ) {
                    gameState = "menu";
                }
            }
        };

        const keyDownHandler = (e: KeyboardEvent) => {
            if (gameState === "playing") {
                if (e.key === "Right" || e.key === "ArrowRight")
                    rightPressed = true;
                if (e.key === "Left" || e.key === "ArrowLeft")
                    leftPressed = true;
                if (e.key === " " || e.key === "Spacebar") {
                    isPaused = !isPaused;
                    e.preventDefault();
                }
            }
            if (e.key === "Escape") {
                if (gameState === "playing") {
                    isPaused = true;
                }
                gameState = "menu"; // <- This line sets the menu mode
            }
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (gameState === "playing") {
                if (e.key === "Right" || e.key === "ArrowRight")
                    rightPressed = false;
                if (e.key === "Left" || e.key === "ArrowLeft")
                    leftPressed = false;
            }
        };

        canvas.addEventListener("click", handleClick);
        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        draw();

        return () => {
            canvas.removeEventListener("click", handleClick);
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        };
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                aspectRatio: "3 / 2",
                maxWidth: "800px",
                margin: "0 auto",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid #000",
                    display: "block",
                }}
                width={window.innerWidth > 800 ? 800 : window.innerWidth * 0.95}
                height={
                    (window.innerWidth > 800 ? 800 : window.innerWidth * 0.95) *
                    (2 / 3)
                }
            />
        </div>
    );
};

export default PingPongGame;
