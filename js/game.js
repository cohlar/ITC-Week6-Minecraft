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
            $gameContainer: $('#game-container'),
            $gameContainer:  $('#game-container'),
            $gameGrid:      undefined,
            $tiles:         undefined,
            $toolkit:       $('#toolkit'),
            $tools:         undefined,
        },
        tools: {
            axe:     new Tool('axe', 'tree'),
            pickaxe: new Tool('pickaxe', 'rock'),
            shovel:  new Tool('shovel', 'dirt'),
        },
        tiles: {
            diamond: new Tile('diamond'),
            dirt:    new Tile('dirt'),
            fence:   new Tile('fence'),
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
                'class': 'tool-container',
                'data-type': this.tools[tool].types,
            });
            $toolContainer.append($('<img />').attr('src', this.tools[tool].imgPath));
            $toolContainer.append($('<p />').html(this.tools[tool].name));
            this.html.$toolkit.append($toolContainer);
        }
        this.html.$tools = $('.tool-container');
    };

    // Event handlers
    Minecraft.setActiveElementEventHandler = function() {
        Minecraft.activeElement = Minecraft[$(this).attr('data-type')][this.id];
        $('#game-container').css('cursor', 'url(' + Minecraft.activeElement.cursorImgPath + '), auto');
    };

    class TileGridUI {
        constructor(numOfRows) {
            this.numOfRows = numOfRows ? numOfRows : 14;
            this.tileSize  = Minecraft.html.$gameContainer.height() / this.numOfRows;
            this.numOfCols = Math.floor(Minecraft.html.$gameContainer.height() / this.tileSize);
            this.matrix    = build2dArray(this.numOfRows, this.numOfCols);
            this.$node     = this.initGameGrid();
        }

        initGameGrid() {
            const $node = $( '<div />' );
            $node.attr('id', 'game-grid');
            Minecraft.html.$gameContainer.css('background', 'none');
            Minecraft.html.$gameContainer.html($node);
            return $node
        }

        injectMatrixWithTiles() {
            let row = this.numOfRows;
            while (--row >= 0) {

                let col = this.numOfCols;

                while (--col >= 0) {
                    const pickedTile = Minecraft.tiles.dirt; // randomPickTile()

                    this.appendTileNode(Minecraft.tiles.dirt, row, col);
                    this.matrix[row][col] = pickedTile;
                }
            }

        }

        appendTileNode(tileInstance, row, col) {
            const $tileNode = $( '<div />' )

            $tileNode.attr({
                'data-row': row,
                'data-col': col,
            });
            $tileNode.css({
                backgroundImage: `url(${tileInstance.imgPath})`,
                height: this.tileSize,
                width: this.tileSize,
            });

            this.$node.prepend($tileNode); // Prepend because the matrix is built from bottom right to top left
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

   // let a = new TileGridUI();
   // a.injectMatrixWithTiles();
   //  console.log(a);



    // --------------------------------------------------------------------------------------
    // General functions that may be reused outside this project
    function build2dArray(numOfRows, numOfCols) {
        const matrix  = new Array(numOfRows);

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
