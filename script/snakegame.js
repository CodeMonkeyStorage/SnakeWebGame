let level = 1;

function runGame() {
    const button = document.getElementById('startButton');
    button.remove();
    
    const canvas = document.getElementById('board');
    if(canvas != null) {
        const ctx = canvas.getContext('2d');
        const scale = 15;
        const boardSize = 20;

        class Obstacle {
            constructor() {
                Obstacle.count === undefined ? Obstacle.count = 0 : Obstacle.count++;
                let isGoodLocation = false;

                while(!isGoodLocation) {
                    this.x = Math.floor(Math.random() * boardSize);
                    this.y = Math.floor(Math.random() * (boardSize - 1)) + 1;

                    isGoodLocation = true;
                    for(let i = 0; i < snake.length; i++) {
                        if(snake[i].x === this.x && snake[i].y === this.y) {
                            isGoodLocation = false;
                            continue;
                        }
                    }
                    
                    if(Obstacle.count > 0) {
                        for(let i = 0; i < obstacles.length; i++) {
                            if(obstacles[i].x === this.x && obstacles[i].y === this.y) {
                                isGoodLocation = false;
                                continue;
                            }   
                        }
                    }
                }
            }
        }

        function updatePositions() {
            for(let i = snake.length - 1; i > 0; i--) {
                snake[i].x = snake[i - 1].x;
                snake[i].y = snake[i - 1].y;
            }

            snake[0].direction === 'right' ? snake[0].x++ : null;
            snake[0].direction === 'down' ? snake[0].y++ : null;
            snake[0].direction === 'left' ? snake[0].x-- : null;
            snake[0].direction === 'up' ? snake[0].y-- : null;

            if(snake[0].x >= boardSize)
                snake[0].x = 0;
            else if(snake[0].x < 0)
                snake[0].x = boardSize;
            else if(snake[0].y >= boardSize)
                snake[0].y = 0;
            else if(snake[0].y < 0)
                snake[0].y = boardSize;
        }

        function didCollide() {
            for(let i = snake.length - 1; i > 0; i--) {
                if(snake[i].x === snake[0].x && snake[i].y === snake[0].y)
                    return true;
            }

            for(let i = 0; i < obstacles.length; i++) {
                if(obstacles[i].x === snake[0].x && obstacles[i].y === snake[0].y)
                    return true;
            }
            return false;
        }

        function didGetFood() {
            if(obstacles[obstacles.length - 1].x === snake[0].x && obstacles[obstacles.length - 1].y === snake[0].y)
                return true;

            return false;
        }

        function addBodyPart() {
            const xDirection = snake[snake.length - 1].x;
            const yDirection = snake[snake.length - 1].y;
                
            updatePositions();
            snake.push({x: xDirection, y: yDirection});
        }

        function changeDirection(event) {
            event.preventDefault();
            if((event.keyCode === 83 || event.keyCode === 40 || event.target.id === 'downButton') && snake[0].direction !== 'up')
                snake[0].direction = 'down';
            else if((event.keyCode === 68 || event.keyCode === 39 || event.target.id === 'rightButton') && snake[0].direction !== 'left')
                snake[0].direction = 'right';
            else if((event.keyCode === 65 || event.keyCode === 37 || event.target.id === 'leftButton') && snake[0].direction !== 'right')
                snake[0].direction = 'left';
            else if((event.keyCode === 87 || event.keyCode === 38  || event.target.id === 'upButton') && snake[0].direction !== 'down')
                snake[0].direction = 'up';
        }

        function readyScreenText() {
            cancelAnimationFrame(req);
            document.getElementById('upButton').removeEventListener('click', changeDirection);
            document.getElementById('downButton').removeEventListener('click', changeDirection);
            document.getElementById('leftButton').removeEventListener('click', changeDirection);
            document.getElementById('rightButton').removeEventListener('click', changeDirection);
            document.removeEventListener('keydown', changeDirection);

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.font = "20px 'Turret Road'";
        }

        function draw() {
            setTimeout(function() {
                req = requestAnimationFrame(draw);
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "rgb(0, 255, 0)";
                for(let i = 0; i < snake.length; i++)
                    ctx.fillRect(snake[i].x * scale, snake[i].y * scale, scale, scale);
                
                ctx.fillStyle = "rgb(255, 255, 0)";
                ctx.fillRect(obstacles[obstacles.length - 1].x * scale, obstacles[obstacles.length - 1].y * scale, scale, scale);

                ctx.fillStyle = "rgb(255, 0, 0)";
                for(let i = 0; i < obstacles.length - 1; i++)
                    ctx.fillRect(obstacles[i].x * scale, obstacles[i].y * scale, scale, scale);

                if(didGetFood()) {
                    addBodyPart();
                    obstacles.pop();
                    foodCount++;
                    obstacles.push(new Obstacle());
                }
                else if(didCollide()) {
                    cancelAnimationFrame(req);
                    readyScreenText();
                    const tryAgain = document.createElement('button');
                    tryAgain.setAttribute('id', 'startButton');
                    tryAgain.setAttribute('onclick', 'runGame()');

                    ctx.fillText("Game Over!", canvas.width / 3, canvas.height / 2);
                    level = 1;
                    tryAgain.textContent = 'Try Again';
                    document.getElementById('startContainer').appendChild(tryAgain);
                }
                else if(foodCount === 15){
                    cancelAnimationFrame(req);
                    readyScreenText();
                    const tryAgain = document.createElement('button');
                    tryAgain.setAttribute('id', 'startButton');
                    tryAgain.setAttribute('onclick', 'runGame()');

                    ctx.fillText("You made it to the next level!", canvas.width / 20, canvas.height / 2);
                    level++;
                    tryAgain.textContent = 'Continue to next level!';
                    document.getElementById('startContainer').appendChild(tryAgain);
                }
                else {
                    updatePositions();
                }
            }, 1000/20);     
        }

        const snake = [{x: 0, y: 0, direction: 'right'}]
        const obstacles = [];
        let foodCount = 0;
        
        document.addEventListener('keydown', changeDirection);
        document.getElementById('upButton').addEventListener('click', changeDirection);
        document.getElementById('downButton').addEventListener('click', changeDirection);
        document.getElementById('leftButton').addEventListener('click', changeDirection);
        document.getElementById('rightButton').addEventListener('click', changeDirection);

        for(let i = 0; i <= level; i++)
            obstacles.push(new Obstacle());

        req = requestAnimationFrame(draw);
    }
}