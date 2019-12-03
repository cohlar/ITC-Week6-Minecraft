'use strict';

// MAKE SURE TO UNCOMMENT ON DEPLOY ####################################################
// window.onload = function () {

    // Game class definition
    class GameElement {
        constructor(name, type) {
            this.name          = name;
            this.type          = type;
            this.types         = type + 's';
            this.imgFolderName = this.types;
            this.imgPath       = 'img/' + this.imgFolderName + '/' + name + '.png';
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
            $gameContainer:         $('#game-container'),
            $gameGrid:              undefined,
            $tiles:                 undefined,
            $toolkit:               $('#toolkit'),
            $toolkitToolsContainer: $('#tools-container'),
            $toolkitTilesContainer: $('#tiles-container'),
            $tools:                 undefined,
            $tiles:                 undefined,
        },
        tools: {
            axe:        new Tool('axe', 'tree'),
            pickaxe:    new Tool('pickaxe', 'rock'),
            shovel:     new Tool('shovel', 'dirt'),
            tbd:        new Tool('eraser', 'tbd'),
        },
        tiles: {
            diamond: new Tile('diamond'),
            dirt:    new Tile('dirt'),
            // fence:   new Tile('fence'),
            gate:    new Tile('gate'),
            grass:   new Tile('grass'),
            lava:    new Tile('lava'),
            leaf:    new Tile('leaf'),
            rock:    new Tile('rock'),
            stone:   new Tile('stone'),
            tnt:     new Tile('tnt'),
            tree:    new Tile('tree'),
        },
        activeElement: undefined,
    }

    // Initiates the game page
    Minecraft.init = function () {
        this.generateHTML();
        this.html.$tools.on('click', this.setActiveElementEventHandler);
    };

    // Generate HTML elements
    Minecraft.generateHTML = function () {
        for (const tool in this.tools) {
            const $toolContainer = $('<div />').attr({
                'id': tool,
                'class': 'toolkit-element',
                'data-type': this.tools[tool].types,
            });
            $toolContainer.append($('<img />').attr('src', this.tools[tool].imgPath));
            $toolContainer.append($('<p />').html(this.tools[tool].name));
            this.html.$toolkitToolsContainer.append($toolContainer);
        }
        this.html.$tools = $('.tool-container');

        for (const tile in this.tiles) {
            const $tileContainer = $('<div />').attr({
                'id': tile,
                'class': 'toolkit-element',
                'data-type': this.tiles[tile].types,
            });
            $tileContainer.append($('<img />').attr('src', this.tiles[tile].imgPath));
            $tileContainer.append($('<p />').html(this.tiles[tile].name));
            this.html.$toolkitTilesContainer.append($tileContainer);
        }
        this.html.$tiles = $('.tile-container');
    };

    // Event handlers
    Minecraft.setActiveElementEventHandler = function() {
        Minecraft.activeElement = Minecraft[$(this).attr('data-type')][this.id];
        $('#game-container').css('cursor', 'url(' + Minecraft.activeElement.cursorImgPath + '), auto');
    };

    class TileGridUI {
        constructor(numOfRows, numOfCols) {
            this.numOfRows = numOfRows;
            this.numOfCols = numOfCols;
            this.matrix    = build2dArray(numOfRows, numOfCols);
            this.node      = Minecraft.html.$gameContainer;
        }

        injectMatrixWithTiles(rowNumber) {
            let row = (rowNumber || rowNumber === 0) ? rowNumber : this.numOfRows;

            if (--row >= 0) {
                let col = this.numOfCols;

                while (--col >= 0) {
                    // randomizeTileFunction
                    this.matrix[row][col] = Minecraft.tiles.dirt;
                    this.injectMatrixWithTiles(row);
                }
            }
        }

        appendTileNode(tileInstance) {
            const $tileNode = $( '<div />' ).attr('data-col', tileInstance.col);

            $tileNode.append($( '<img />' ).attr('src', tileInstance.imgPath));
            tileInstance.node = $tileNode;
        }

        tileExistsBelow(tileRow, tileCol) {
            if (tileRow !== this.numOfRows)
                return typeof this.matrix[++tileRow][tileCol] !== 'undefined';
        }

        randomPickTile() {
        }

        generateGridHTML() {
            
        }
    }

    let a = new TileGridUI(3, 5);
    a.injectMatrixWithTiles();
    console.log(a);
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



    // // TEMPORARY, REMOVE
    // let gameGrid = build2dArray(4,4);
    // for (let j = 0 ; j < 4 ; j++) {
    //     gameGrid[0][j] = ;
    //     gameGrid[1][j] = ;
    //     gameGrid[2][j] = ;
    //     gameGrid[3][j] = ;
    // }
    // // REMOVE UNTIL HERE