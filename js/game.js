'use strict';

// MAKE SURE TO UNCOMMENT ON DEPLOY ####################################################
// window.onload = function () {

// Game class definition
class GameElement {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.types = type + 's';
        this.imgFolderName = this.types;
        this.imgPath = 'img/' + this.imgFolderName + '/' + name + '.png';
        this.cursorImgPath = 'img/cursors/' + name + '.png';
    }
}

class Tool extends GameElement {
    constructor(name, tileType) {
        super(name, 'tool');
        this.tileType = tileType;
    }
}

class Tile extends GameElement {
    constructor(name) {
        super(name, 'tile');
    }
}

const Minecraft = {
    html: {
        $gameContainer: $('#game-container'),
        $gameGrid: undefined,
        $gameGridElements: undefined,
        $toolkit: $('#toolkit'),
        $toolkitToolsContainer: $('#tools-container'),
        $toolkitTilesContainer: $('#tiles-container'),
        $toolkitElements: undefined,
        $startBtn: $('.start-game'),        
    },
    tools: {
        axe: new Tool('axe', 'tree'),
        bucket: new Tool('bucket', 'lava'),
        pickaxe: new Tool('pickaxe', 'rock'),
        shovel: new Tool('shovel', 'dirt'),
    },
    tiles: {
        diamond: new Tile('diamond'),
        dirt: new Tile('dirt'),
        gate: new Tile('gate'),
        grass: new Tile('grass'),
        lava: new Tile('lava'),
        leaf: new Tile('leaf'),
        rock: new Tile('rock'),
        stone: new Tile('stone'),
        tnt: new Tile('tnt'),
        tree: new Tile('tree'),
    },
    numOfRows: undefined,
    numOfCols: 200,
    tileSize: 50,
    tileGrid: undefined,
    tileGridUI: undefined,
    activeElement: undefined,
}

// Initiates the game page
Minecraft.init = function () {
    this.generateHTML();
    this.html.$startBtn.one('click', this.startGame.bind(this));   // C'est la guerre ce one!
};

// Generate HTML elements
Minecraft.generateHTML = function () {
    for (const tool in this.tools) {
        const $toolContainer = $('<div />').attr({
            'id': tool,
            'class': 'toolkit-element',
            'data-type': this.tools[tool].types,
        });
        $toolContainer.append($('<div />').css({
            'background': 'url(' + this.tools[tool].imgPath + ')',
            'background-size': 'contain',
        }));
        $toolContainer.append($('<p />').html(this.tools[tool].name));
        this.html.$toolkitToolsContainer.append($toolContainer);
    }
    for (const tile in this.tiles) {
        const $tileContainer = $('<div />').attr({
            'id': tile,
            'class': 'toolkit-element empty',
            'data-type': this.tiles[tile].types,
        });
        $tileContainer.append($('<div />').css({
            'background': 'url(' + this.tiles[tile].imgPath + ')',
            'background-size': 'contain',
        }).attr('id', 'count-' + tile).html('0'));
        $tileContainer.append($('<p />').html(this.tiles[tile].name));
        this.html.$toolkitTilesContainer.append($tileContainer);
    }
    this.html.$toolkitElements = $('.toolkit-element');

    Minecraft.html.tools = {
        $axe: $('#axe'),
        $bucket: $('bucket'),
        $pickaxe: $('pickaxe'),
        $shovel: $('shovel'),
    };
    Minecraft.html.tiles = {
        $diamond: $('#diamond'),
        $dirt: $('#dirt'),
        $gate: $('#gate'),
        $grass: $('#grass'),
        $lava: $('#lava'),
        $leaf: $('#leaf'),
        $rock: $('#rock'),
        $stone: $('#stone'),
        $tnt: $('#tnt'),
        $tree: $('#tree'),
    };
    Minecraft.html.countTiles = {
        $diamond: $('#count-diamond'),
        $dirt: $('#count-dirt'),
        $gate: $('#count-gate'),
        $grass: $('#count-grass'),
        $lava: $('#count-lava'),
        $leaf: $('#count-leaf'),
        $rock: $('#count-rock'),
        $stone: $('#count-stone'),
        $tnt: $('#count-tnt'),
        $tree: $('#count-tree'),
    };
};

// Event handlers
Minecraft.startGame = function () {

    this.numOfRows = Math.floor(this.html.$gameContainer.height() / this.tileSize)
    const gridMatrix = build2dArray(this.numOfRows, this.numOfCols);
    const callbacksMatrix = build2dArray(this.numOfRows, this.numOfCols);

    this.session = new GameSession();
    this.tileGrid = new TileGrid(gridMatrix, callbacksMatrix);
    this.tileGridUI = new TileGridUI(this.tileGrid, this.session);
    this.tileGridUI.render();

    this.html.$gameGridElements = $('.tile');
    this.html.$toolkitElements.on('click', this.setActiveElementEventHandler);
};

Minecraft.setActiveElementEventHandler = function () {
    Minecraft.activeElement = Minecraft[$(this).attr('data-type')][this.id];
    Minecraft.html.$gameContainer.css('cursor', 'url(' + Minecraft.activeElement.cursorImgPath + '), auto');
    $('.toolkit-element.active').toggleClass('active');
    $(this).toggleClass('active');
};


class TileGrid {
    constructor(matrix, callbacksMat) {
        this.matrix = matrix;
        this.numOfRows = matrix.length
        this.numOfCols = matrix[0].length
        this.callbacks = callbacksMat;
        this.tiles = Minecraft.tiles;
        this.maxFillRow = Math.ceil(this.numOfRows / 2);
        this.injectMatrixWithTiles(); // Maybe remove
    }

    injectMatrixWithTiles() {
        let row = -1;
        while (++row < this.numOfRows) {

            let col = -1;
            while (++col < this.numOfCols) {
                this.matrix[row][col] = this.randomTile(row);
            }
        }
    }

    randomTile(row) {
        switch (true) {
            case row === 0:
                return this.tiles.lava;

            case row < 2:
                return this.tiles.dirt;

            // case 2 <= row < this.maxFillRow:
            //     return this.tiles.leaf;

            default:
                return null;
        }
    }

    injectTree(row, col) {
        this.matrix[row][col];
    }

    getTile(row, col) {
        return this.matrix[row][col];
    }

    setTile(row, col, newTile) { //will update gridui upon change
        this.matrix[row][col] = newTile;
        this.callbacks[row][col] && this.callbacks[row][col](newTile);
    }

    onChange(row, col, func) {
        this.callbacks[row][col] = func;
    }
}

class TileGridUI {
    constructor(tileGridInstance, gameSessionInstance) {
        this.grid = tileGridInstance;
        this.session = gameSessionInstance;
        this.numOfRows = tileGridInstance.matrix.length;
        this.numOfCols = tileGridInstance.matrix[0].length;
        this.width = Minecraft.tileSize * this.numOfCols;
        this.$parentNode = Minecraft.html.$gameContainer;
        this.$node = this.createGridNode();
    }

    createGridNode() {
        const $node = $('<div />');
        $node.attr('id', 'game-grid')
            .css('width', this.width + 'px');

        return ($node);
    }

    createTileNode(url) {
        const $tileNode = $('<div />');
        $tileNode.css('background-image', `url(${url})`);

        return ($tileNode);
    }

    render() {
        this.$parentNode.css('background', 'none')
            .html(this.$node);

        for (let row = 0; row < this.numOfRows; row++) {
            for (let col = 0; col < this.numOfCols; col++) {
                const $tile = this.grid.matrix[row][col] ? this.createTileNode(this.grid.matrix[row][col].imgPath) : this.createTileNode('#');

                this.$node.prepend($tile);

                this.grid.onChange(row, col, (newTile) => {
                    if (!newTile) {
                        $tile.css('background-image', '');
                    }
                    else $tile.css('background-image', `url( ${newTile.imgPath} )`);
                });

                $tile.on('click', function () {
                    if (Minecraft.activeElement instanceof Tool && !!this.grid.matrix[row][col] &&
                        Minecraft.activeElement.tileType === this.grid.matrix[row][col].name) {

                            this.grid.setTile(row, col, '');
                            Minecraft.html.countTiles['$' + Minecraft.activeElement.tileType].html(++this.session.count[Minecraft.activeElement.tileType]);
                            Minecraft.html.tiles['$' + Minecraft.activeElement.tileType].removeClass('empty');
                            return;
                    }

                    if (Minecraft.activeElement instanceof Tile && !this.grid.matrix[row][col] &&
                        this.session.count[Minecraft.activeElement.name] >0) {

                            this.grid.setTile(row, col, Minecraft.activeElement);
                            Minecraft.html.countTiles['$' + Minecraft.activeElement.name].html(--this.session.count[Minecraft.activeElement.name]);
                            if (this.session.count[Minecraft.activeElement.name] === 0) Minecraft.html.tiles['$' + Minecraft.activeElement.name].addClass('empty');
                            return;
                    }
                }.bind(this));

            }
        }
    }
}

class GameSession {
    constructor() {
        this.tools = Minecraft.tools;
        this.tiles = Minecraft.tiles;
        this.count = {};
        for (let tileKey in this.tiles) {
            this.count[tileKey] = 0;
        }
    }
}

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