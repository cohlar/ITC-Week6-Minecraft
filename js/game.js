'use strict';

// const

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
            $gameGridElements:      undefined,
            $toolkit:               $('#toolkit'),
            $toolkitToolsContainer: $('#tools-container'),
            $toolkitTilesContainer: $('#tiles-container'),
            $toolkitElements:       undefined,
            $startBtn:              $('.start-game'),
        },
        tools: {
            axe:        new Tool('axe', 'tree'),
            pickaxe:    new Tool('pickaxe', 'rock'),
            shovel:     new Tool('shovel', 'dirt'),
            // tbd:        new Tool('eraser', 'tbd'),
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
        numOfRows:      undefined,
        numOfCols:      500,
        tileSize:       50,
        tileGrid:       undefined,
        tileGridUI:     undefined,
        activeElement:  undefined,
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
            $toolContainer.append($('<img />').attr('src', this.tools[tool].imgPath));
            $toolContainer.append($('<p />').html(this.tools[tool].name));
            this.html.$toolkitToolsContainer.append($toolContainer);
        }
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
        this.html.$toolkitElements = $('.toolkit-element');
    };

    // Event handlers
    Minecraft.startGame = function () {

        this.numOfRows = Math.floor(this.html.$gameContainer.height() / this.tileSize)
        const gridMatrix = build2dArray(this.numOfRows, this.numOfCols);
        const callbacksMatrix = build2dArray(this.numOfRows, this.numOfCols);

        this.tileGrid   = new TileGrid(gridMatrix, callbacksMatrix);
        this.tileGridUI = new TileGridUI(this.tileGrid);
        this.tileGridUI.render();

        // this.tileGridUI = new TileGridUI(100);
        // this.tileGridUI.injectMatrixWithTiles();
        this.html.$gameGridElements = $('.tile');
        this.html.$gameGridElements.on('click', this.actionTile);  // J'ai pas trouve mieux comme nom de fonction
        this.html.$toolkitElements.on('click', this.setActiveElementEventHandler);
    };

    Minecraft.actionTile = function () {
        const [row, col] = [ $( this ).attr('data-row') , $( this ).attr('data-col') ];
        if ( Minecraft.activeElement instanceof Tool &&         // Ce if doit pouvoir etre simplifie... mais deja il marche :)
             Minecraft.tileGridUI.matrix[row][col] !== null &&
             Minecraft.activeElement.tileType === Minecraft.tileGridUI.matrix[row][col].name) {

            Minecraft.tileGridUI.matrix[row][col] = null;
            $( this ).css('background', 'none');
        }
    };

    Minecraft.setActiveElementEventHandler = function() {
        Minecraft.activeElement = Minecraft[$(this).attr('data-type')][this.id];
        Minecraft.html.$gameContainer.css('cursor', 'url(' + Minecraft.activeElement.cursorImgPath + '), auto');
        $( '.toolkit-element.active' ).toggleClass('active');
        $( this ).toggleClass('active');
    };


    class TileGrid {
        constructor(matrix, callbacksMat) {
            this.matrix     = matrix;
            this.numOfRows  = matrix.length
            this.numOfCols  = matrix[0].length
            this.callbacks  = callbacksMat;
            this.tiles      = Minecraft.tiles;
            this.maxFillRow = Math.floor(this.numOfRows / 2);
            this.baseRow    = 4;
            this.rowOffset  = 2;
            this.injectMatrixWithTiles(); // Maybe remove

        }

        getTile(row, col) {
            return this.matrix[row][col];
        }

        setTile(row, col, newTile) { // will update gridui upon change
            this.matrix[row][col] = newTile;
            this.callbacks[row][col] && this.callbacks[row][col](newTile);
        }

        onChange(row, col, func) {
            this.callbacks[row][col] = func;
        }

        injectMatrixWithTiles() {
            for (let row = 0; row < this.numOfRows; row++) {
                for (let col = 0; col < this.numOfCols; col++){

                    const tile = this.randomTile(row, col);
                    this.matrix[row][col] = !!tile ? tile : null;
                }
            }
            this.polishItUp();
        }

        randomTile(row, col) {
            switch ( true ) {
                case row === 0:
                    return this.tiles.lava;

                case row < this.baseRow:
                    return this.tiles.dirt;

                case ( this.baseRow <= row && row <= (this.maxFillRow - this.rowOffset) ):
                    if (this.hasTileBeneath(row, col) &&
                        this.matrix[row - 1][col].name === 'dirt')
                        if ( this.withProbaOf(0.7) ) {
                            return this.tiles.dirt;

                        } else if (this.withProbaOf(0.3) &&
                            this.matrix[row - 1][col].name === 'dirt') {
                            return this.tiles.rock;

                        } else if (this.withProbaOf(0.1) && 
                                 !!this.matrix[row - 1] &&
                                 !!this.matrix[row - 1][col] &&
                                   this.matrix[row - 1][col].name === 'dirt') {

                            return this.tiles.tree;
                        }
                    break;

                // case ( (this.baseRow) <= row && row < (this.maxFillRow) ):
                //     if (this.hasTileBeneath(row, col))

                //         if (this.withProbaOf(0.4) &&
                //             this.matrix[row - 1][col].name === 'dirt') {
                //             return this.tiles.rock;
                //         } else if (this.withProbaOf(0.2) && 
                //                  !!this.matrix[row - 1] &&
                //                  !!this.matrix[row - 1][col] &&
                //                    this.matrix[row - 1][col].name === 'dirt') {

                //             return this.tiles.tree;
                //         }
                    // break;

                default:
                    return null;
            }
        }

        // add trees and grass
        polishItUp() {
            for (let row = 0; row < this.numOfRows; row++){
                if ( !!this.matrix[row + 1] ) {
                    for (let col = 0; col < this.numOfCols; col++) {

                        if (!!this.matrix[row][col] &&
                            !this.hasTileAbove(row, col) &&
                             this.matrix[row][col].name === 'dirt') {

                            this.matrix[row][col] = this.tiles.grass;
                        } else if (!!this.matrix[row][col] &&
                                    !this.hasTileAbove(row, col) &&
                                     this.matrix[row][col].name === 'tree') {
                            this.injectTree(row, col);
                        }
                    }
                }
            }   
        }

        hasTileAbove(row, col) {
            return !!this.matrix[row + 1][col];
        }

        hasTileBeneath(row, col) {
            return !!this.matrix[row - 1][col];
        }

        injectTree(row, col) {
            for (let i = 0; i < 3; i++) {
                // Trunk
                this.matrix[row + i][col] = this.tiles.tree;
                // Leaves
                this.matrix[row + 3 + i][col - 1] = this.tiles.leaf;
                this.matrix[row + 3 + i][col]     = this.tiles.leaf;
                this.matrix[row + 3 + i][col + 1] = this.tiles.leaf;
            }   
        }

        withProbaOf(n) {
            return !!n && Math.random() <= n;
        }

    }

    class TileGridUI {
        constructor(tileGridInstance) {
            this.grid        = tileGridInstance;
            this.numOfRows   = tileGridInstance.matrix.length;
            this.numOfCols   = tileGridInstance.matrix[0].length;
            this.width       = Minecraft.tileSize * this.numOfCols;
            this.$parentNode = Minecraft.html.$gameContainer;
            this.$node       = this.createGridNode();
        }

        createGridNode() {
            const $node = $( '<div />' );
                  $node.attr('id', 'game-grid')
                       .css('width', this.width + 'px');

            return ( $node );
        }

        createTileNode(url) {
            const $tileNode = $( '<div />' );
                  $tileNode.css('background-image', `url(${ url })`)

            return ( $tileNode );
        }

        render() {
            this.$parentNode.css('background', 'none')
                            .html(this.$node);

            let row = -1;
            while (++row < this.numOfRows) {

                let col = -1;
                while (++col < this.numOfCols) {
                    const $tile = this.grid.matrix[row][col] ? this.createTileNode(this.grid.matrix[row][col].imgPath) : this.createTileNode('');

                    this.$node.prepend($tile);

                    this.grid.onChange(row, col, (newTile) => { 
                        $tile.css('background-image', `url( ${newTile.imgPath} )`);
                    });
                }
            }
        }
    }

    // --------------------------------------------------------------------------------------
    // General functions that may be reused outside this project
    function build2dArray(numOfRows, numOfCols) {
        const matrix  = new Array(numOfRows).fill(null);

        let i = -1;
        while (++i < numOfRows) {
            matrix[i] = new Array(numOfCols).fill(null);
        }
        return matrix;
    }

    function withProbaOf(n) {
        return !!n && Math.random() <= n;
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
