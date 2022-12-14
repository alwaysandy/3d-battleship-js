//TODO change colour of hit square on playerBoard

function createBoardDivs() {
    const container = document.querySelector('.flex-container');
    let boardRow, boardNode;
    for (let i = 0; i < 2; i++) {
        for (let z = 0; z < BOARD_SIZE; z++) {
            if (i === 0) {
                boardRow = document.createElement('div');
                if (z !== 0) {
                    boardRow.classList.add('hidden');
                }
                boardRow.classList.add('board-row');
                boardRowNodes.push(boardRow);
                playerBoardNodes.push([]);
            } else {
                opBoardNodes.push([]);
            }
            boardNode = document.createElement('div');
            boardNode.classList.add('board-container');
            for (let y = 0; y < BOARD_SIZE; y++) {
                const line = document.createElement('div');
                line.classList.add('line');
                if (i === 0) {
                    playerBoardNodes[z].push([]);
                } else {
                    opBoardNodes[z].push([]);
                }
                for (let x = 0; x < BOARD_SIZE; x++) {
                    const tile = document.createElement('div');
                    tile.classList.add('tile');
                    if (i === 1) {
                        tile.classList.add('op-tile');
                    }
                    tile.dataset.x = x;
                    tile.dataset.y = y;
                    tile.dataset.z = z;
                    if (y === 0) {
                        tile.classList.add('top-edge');
                    } else if (y === BOARD_SIZE - 1) {
                        tile.classList.add('bottom-edge')
                    }

                    if (x === 0) {
                        tile.classList.add('left-edge');
                    } else if (x === BOARD_SIZE - 1) {
                        tile.classList.add('right-edge');
                    }

                    line.appendChild(tile);
                    if (i === 0) {
                        playerBoardNodes[z][y].push(tile);
                    } else {
                        opBoardNodes[z][y].push(tile);
                    }
                }
                boardNode.appendChild(line);
            }
            if (i === 0) {
                const zP = document.createElement('p');
                zP.classList.add('zInfo');
                zP.textContent = "z: " + z;
                boardNode.appendChild(zP);
            }
            boardRowNodes[z].appendChild(boardNode);
        }
    }

    boardRowNodes.forEach(br => container.appendChild(br));
}

function createShotsDataArray() {
    let shots = [];
    for (let z = 0; z < BOARD_SIZE; z++) {
        shots.push([]);
        for (let y = 0; y < BOARD_SIZE; y++) {
            shots[z].push([]);
            for (let x = 0; x < BOARD_SIZE; x++) {
                shots[z][y].push(0);
            }
        }
    }
    return shots;
}

function updateShips(shipCoords) {
    for (let i = 0; i < shipCoords.length; i++) {
        let s = shipCoords[i];
        s.coords = [];
        if (s.dir === 0) {
            for (let d = 0; d < s.size; d++) {
                playerBoardNodes[s.z][s.y][s.x + d].classList.add('ship');
                s.coords.push([s.z, s.y, s.x + d]);
            }
        } else if (s.dir === 1){
            for (let d = 0; d < s.size; d++) {
                playerBoardNodes[s.z][s.y + d][s.x].classList.add('ship');
                s.coords.push([s.z, s.y + d, s.x]);
            }
        } else if (s.dir === 2) {
            for (let d = 0; d < s.size; d++) {
                playerBoardNodes[s.z + d][s.y][s.x].classList.add('ship');
                s.coords.push([s.z + d, s.y, s.x]);
            }
        }

        ships.push(s);
    }
}

function sink(s, opponent) {
    for (let i = 0; i < s.size; i++) {
        if (s.dir === 0) {
            if (opponent) {
                opBoardNodes[s.z][s.y][s.x + i].classList.add('sunk');
                opBoardNodes[s.z][s.y][s.x + i].textContent = "";
            } else {
                playerBoardNodes[s.z][s.y][s.x + i].classList.add('sunk');
                playerBoardNodes[s.z][s.y][s.x + i].textContent = "";
            }
        } else if (s.dir === 1){
            if (opponent) {
                opBoardNodes[s.z][s.y + i][s.x].classList.add('sunk');
                opBoardNodes[s.z][s.y + i][s.x].textContent = "";
            } else {
                playerBoardNodes[s.z][s.y + i][s.x].classList.add('sunk');
                playerBoardNodes[s.z][s.y + i][s.x].textContent = "";
            }
        } else if (s.dir === 2) {
            if (opponent) {
                opBoardNodes[s.z + i][s.y][s.x].classList.add('sunk');
                opBoardNodes[s.z + i][s.y][s.x].textContent = "";
            } else {
                playerBoardNodes[s.z + i][s.y][s.x].classList.add('sunk');
                playerBoardNodes[s.z + i][s.y][s.x].textContent = "";
            }
        }
    }
}

function handleClick(t) {
    if (turn === 0) {
        let x = parseInt(t.target.dataset.x);
        let y = parseInt(t.target.dataset.y);
        let z = parseInt(t.target.dataset.z);

        if (!shots[z][y][x]) {
            socket.emit('sendShot', {'x': x, 'y': y, 'z': z});
        }
    }
}

function displayNextSlice() {
    if (slice === 4) {
        return;
    }

    boardRowNodes[slice].classList.add('hidden');
    slice++;
    boardRowNodes[slice].classList.remove('hidden');
}

function displayPrevSlice() {
    if (slice === 0) {
        return;
    }
    boardRowNodes[slice].classList.add('hidden');
    slice--;
    boardRowNodes[slice].classList.remove('hidden');
}

function displayExplodedView() {
    const sliceViewButton = document.querySelector('#slice-view');
    const explodedViewButton = document.querySelector('#exploded-view');
    const nextSliceButton = document.querySelector('#next-slice');
    const prevSliceButton = document.querySelector('#prev-slice');
    
    for (let n of boardRowNodes) {
        n.classList.remove('hidden');
    }
    sliceViewButton.classList.remove('hidden');
    explodedViewButton.classList.add('hidden');
    nextSliceButton.classList.add('hidden');
    prevSliceButton.classList.add('hidden');
}

function displaySliceView() {
    const explodedViewButton = document.querySelector('#exploded-view');
    const sliceViewButton = document.querySelector('#slice-view');
    const nextSliceButton = document.querySelector('#next-slice');
    const prevSliceButton = document.querySelector('#prev-slice');
    
    for (let i = 0; i < boardRowNodes.length; i++) {
        if (i !== slice) {
            boardRowNodes[i].classList.add('hidden');
        }
    }
    explodedViewButton.classList.remove('hidden');
    sliceViewButton.classList.add('hidden');
    nextSliceButton.classList.remove('hidden')
    prevSliceButton.classList.remove('hidden')
}

function addEventListeners() {
    const opTiles = document.querySelectorAll('.op-tile');
    opTiles.forEach(tile => tile.addEventListener('click', handleClick));
    const restartGame = document.querySelector('#restart-game-button');
    restartGame.addEventListener('click', () => socket.emit("restart_game")); 

    const nextSlice = document.querySelector('#next-slice');
    nextSlice.addEventListener('click', displayNextSlice);

    const prevSlice = document.querySelector('#prev-slice');
    prevSlice.addEventListener('click', displayPrevSlice);

    const explodedViewButton = document.querySelector('#exploded-view');
    explodedViewButton.addEventListener('click', displayExplodedView);

    const sliceViewButton = document.querySelector('#slice-view');
    sliceViewButton.addEventListener('click', displaySliceView);
}

function clearEventListeners() {
    const opTiles = document.querySelectorAll('.op-tile');
    opTiles.forEach(tile => {
        tile.removeEventListener('click', handleClick);
        tile.classList.remove('op-tile');
    });
}

const BOARD_SIZE = 5;
const playerBoardNodes = [];
const opBoardNodes = [];
const boardRowNodes = [];
createBoardDivs();
const shots = createShotsDataArray();
let ships = [];
let turn;
let slice = 0;
let lastShot = [-1, -1, -1];
const messageNode = document.querySelector('.message');

let socket = io();

socket.emit('updateID', sessionStorage.getItem('id'));
socket.on('start_game', (data) => {
    data = JSON.parse(data);
    if (data.turn === data.id) {
        turn = 0;
        messageNode.textContent = "Your shot";
    } else {
        turn = 1;
        messageNode.textContent = "Waiting for shot..";
    }
    updateShips(data.ships);
    addEventListeners();
});

socket.on('receiveShot', (c) => {
    let response = {};
    response.x = c.x;
    response.y = c.y;
    response.z = c.z;
    if (lastShot[0] !== -1) {
        playerBoardNodes[lastShot[0]][lastShot[1]][lastShot[2]].classList.remove('last-shot');
    }
    lastShot[0] = c.z;
    lastShot[1] = c.y;
    lastShot[2] = c.x;
    playerBoardNodes[c.z][c.y][c.x].textContent = "X";
    playerBoardNodes[c.z][c.y][c.x].classList.add('last-shot');
    for (let i = 0; i < ships.length; i++) {
        let s = ships[i];
        if (s.coords.length > 0) {
            for (let j = 0; j < s.coords.length; j++) {
                let sc = s.coords[j];
                if (sc[0] === c.z && sc[1] === c.y && sc[2] === c.x) {
                    playerBoardNodes[c.z][c.y][c.x].classList.add('hit');
                    if (s.coords.length === 1) {
                        response.sunk = 1;
                        response.ship = s;
                        sink(ships[i], false);
                        ships.splice(i, 1);
                    } else {
                        response.sunk = 0;
                        ships[i].coords.splice(j, 1);
                    }
                    response.hit = 1;
                    socket.emit('shotResponse', response);
                    if (ships.length == 0) {
                        socket.emit("game_over");
                        clearEventListeners();
                        messageNode.textContent = "You lose!";
                    }
                    return;
                }
            }
        }
    }

    turn = 0;
    messageNode.textContent = "Your shot";
    response.hit = 0;
    socket.emit('shotResponse', response);
});

socket.on('shotResponse', (r) => {
    if (r.hit === 1) {
        shots[r.z][r.y][r.x] = 1;
        opBoardNodes[r.z][r.y][r.x].textContent = "X";
        opBoardNodes[r.z][r.y][r.x].classList.add('hit');
        opBoardNodes[r.z][r.y][r.x].classList.remove('op-tile');
        if (r.sunk === 1) {
            sink(r.ship, true);
        }
        turn = 0;
        messageNode.textContent = "Your shot";
    } else {
        shots[r.z][r.y][r.x] = 1;
        opBoardNodes[r.z][r.y][r.x].textContent = "X";
        opBoardNodes[r.z][r.y][r.x].classList.add('miss');
        turn = 1;
        messageNode.textContent = "Waiting for shot..";
    }
});

socket.on("game_over", () => {
    messageNode.textContent = "You win!";
    clearEventListeners();
    socket.emit("sendMissedShips", ships);
});

socket.on("receiveMissedShips", (ships) => {
    for (let s of ships) {
        if (s.dir === 0) {
            for (let i = 0; i < s.size; i++) {
                opBoardNodes[s.z][s.y][s.x + i].classList.add('missed');
            }
        } else if (s.dir === 1) {
            for (let i = 0; i < s.size; i++) {
                opBoardNodes[s.z][s.y + i][s.x].classList.add('missed');
            }
        } else if (s.dir === 2) {
            for (let i = 0; i < s.size; i++) {
                opBoardNodes[s.z + i][s.y][s.x].classList.add('missed');
            }
        }
    }
});

socket.on("restart_game", () => {
    alert("Game restarting..");
    window.location.replace("/");
});
