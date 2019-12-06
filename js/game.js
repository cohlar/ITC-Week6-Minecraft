'use strict';

// MAKE SURE TO UNCOMMENT ON DEPLOY ####################################################
// window.onload = function () {

// Namespace and main variables for our instance of the game
const Minecraft = {
    html: {
        $gameContainer: $('#game-container'),
        $toolkitToolsContainer: $('#tools-container'),
        $toolkitTilesContainer: $('#tiles-container'),
        $startBtn: $('.start-game'),        
    },
    tools: {
        axe: createTool('axe', 'tree'),
        bucket: createTool('bucket', 'lava'),
        pickaxe: createTool('pickaxe', 'rock'),
        shovel: createTool('shovel', 'dirt'),
    },
    tiles: {
        diamond: createTile('diamond'),
        dirt: createTile('dirt'),
        gate: createTile('gate'),
        grass: createTile('grass'),
        lava: createTile('lava'),
        leaf: createTile('leaf'),
        rock: createTile('rock'),
        stone: createTile('stone'),
        tnt: createTile('tnt'),
        tree: createTile('tree'),
    },
    numOfRows: undefined,
    numOfCols: 200,
    tileSize: 50,   // in px
    tileGrid: undefined,
    tileGridUI: undefined,
}

// Initiates the game page
Minecraft.init = function () {
    this.html.$startBtn.one('click', this.startGame.bind(this));
};

// Event handler
Minecraft.startGame = function () {

    this.numOfRows = Math.floor(this.html.$gameContainer.height() / this.tileSize)
    const gridMatrix = build2dArray(this.numOfRows, this.numOfCols);
    const callbacksMatrix = build2dArray(this.numOfRows, this.numOfCols);

    this.session = createGameSession(this.tools, this.tiles);
    this.tileGrid = createTileGrid(gridMatrix, callbacksMatrix, this.tiles);
    this.tileGridUI = createTileGridUI(this.tileGrid, this.session, this.tileSize);
    this.tileGridUI.render(this.html.$gameContainer, this.html.$toolkitToolsContainer, this.html.$toolkitTilesContainer);
};

// --------------------------------------------------------------------------------------
// General functions that may be reused outside this project
function build2dArray(numOfRows, numOfCols) {
    const matrix = new Array(numOfRows);

    let i = -1;
    while (++i < numOfRows) {
        matrix[i] = new Array(numOfCols);
    }
    return matrix;
}

// --------------------------------------------------------------------------------------
// And this is where all the magic happens
Minecraft.init();
// ------------------------------------------------------------------------------------------
// } // MAKE SURE TO UNCOMMENT ON DEPLOY ####################################################