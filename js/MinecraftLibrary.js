// Library of classes to build a Minecraft game from scratch

(function (global) {

    global.createTool = function (name, tileType) {
        return new Tool(name, tileType);
    }

    global.createTile = function (name) {
        return new Tile(name);
    }

    global.createGameSession = function (tools, tiles) {
        return new GameSession(tools, tiles);
    }

    global.createTileGrid = function (matrix, callbacksMat, tiles) {
        return new TileGrid(matrix, callbacksMat, tiles);
    }

    global.createTileGridUI = function (tileGridInstance, gameSessionInstance, tileSize) {
        return new TileGridUI(tileGridInstance, gameSessionInstance, tileSize);
    }

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

    class GameSession {
        constructor(tools, tiles) {
            this.tools = tools;
            this.tiles = tiles;
            this.count = {};
            for (let tileKey in this.tiles) {
                this.count[tileKey] = 0;
            }
            this.activeElement = undefined;
        }
    }

    class TileGrid {
        constructor(matrix, callbacksMat, tiles) {
            this.matrix = matrix;
            this.callbacks = callbacksMat;
            this.tiles = tiles;
            this.numOfRows = matrix.length
            this.numOfCols = matrix[0].length
            this.maxFillRow = Math.ceil(this.numOfRows / 2);
            this.baseRow = 4;
            this.rowOffset = 2;
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
                for (let col = 0; col < this.numOfCols; col++) {

                    const tile = this.randomTile(row, col);
                    this.matrix[row][col] = !!tile ? tile : null;
                }
            }
            this.polishItUp();
        }
        // add trees and grass
        polishItUp() {
            for (let row = 0; row < this.numOfRows; row++) {
                if (!!this.matrix[row + 1]) {
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
                this.matrix[row + 3 + i][col] = this.tiles.leaf;
                this.matrix[row + 3 + i][col + 1] = this.tiles.leaf;
            }
        }

        withProbaOf(n) {
            return !!n && Math.random() <= n;
        }

        randomTile(row, col) {
            switch (true) {
                case row === 0:
                    return this.tiles.lava;

                case row < this.baseRow:
                    return this.tiles.dirt;

                case (this.baseRow <= row && row <= (this.maxFillRow - this.rowOffset)):
                    if (this.hasTileBeneath(row, col) &&
                        this.matrix[row - 1][col].name === 'dirt')

                        if (this.withProbaOf(0.7)) {
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

                default:
                    return null;
            }
        }
    }

    class TileGridUI {
        constructor(tileGridInstance, gameSessionInstance, tileSize) {
            this.grid = tileGridInstance;
            this.session = gameSessionInstance;
            this.numOfRows = tileGridInstance.matrix.length;
            this.numOfCols = tileGridInstance.matrix[0].length;
            this.width = tileSize * this.numOfCols;
            this.$node = this.createGridNode();
            this.$tileContainer = {};
            this.$countTiles = {};
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

        render($parentNodeGrid, $parentNodeTools, $parentNodeTiles) {
            this.renderGrid($parentNodeGrid);
            this.renderToolkit($parentNodeTools, $parentNodeTiles, $parentNodeGrid);
        }

        renderGrid($parentNode) {
            $parentNode.css('background', 'none')
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
                        if (this.session.activeElement instanceof Tool && !!this.grid.matrix[row][col] &&
                            this.session.activeElement.tileType === this.grid.matrix[row][col].name) {

                            this.grid.setTile(row, col, '');
                            this.updateCounter(
                                this.$countTiles[this.session.activeElement.tileType],
                                this.$tileContainer[this.session.activeElement.tileType],
                                ++this.session.count[this.session.activeElement.tileType]
                            );
                            return;
                        }

                        if (this.session.activeElement instanceof Tile && !this.grid.matrix[row][col] &&
                            this.session.count[this.session.activeElement.name] > 0) {

                            this.grid.setTile(row, col, this.session.activeElement);
                            this.updateCounter(
                                this.$countTiles[this.session.activeElement.name],
                                this.$tileContainer[this.session.activeElement.name],
                                --this.session.count[this.session.activeElement.name]
                            );
                            return;
                        }
                    }.bind(this));

                }
            }
        }

        renderToolkit($parentNodeTools, $parentNodeTiles, $parentNodeGrid) {
            for (const tool in this.session.tools) {
                const $toolContainer = $('<div />').attr({
                    'id': tool,
                    'class': 'toolkit-element',
                    'data-type': this.session.tools[tool].types,
                });
                $toolContainer.append($('<div />').css({
                    'background': 'url(' + this.session.tools[tool].imgPath + ')',
                    'background-size': 'contain',
                }));
                $toolContainer.append($('<p />').html(this.session.tools[tool].name));
                $parentNodeTools.append($toolContainer);

                $toolContainer.on('click', function () {
                    this.session.activeElement = this.session.tools[tool];
                    $parentNodeGrid.css('cursor', 'url(' + this.session.activeElement.cursorImgPath + '), auto');
                    $('.toolkit-element.active').toggleClass('active');
                    $toolContainer.toggleClass('active');
                }.bind(this));
            }
            for (const tile in this.session.tiles) {
                this.$tileContainer[tile] = $('<div />').attr({
                    'id': tile,
                    'class': 'toolkit-element empty',
                    'data-type': this.session.tiles[tile].types,
                });
                this.$countTiles[tile] = $('<div />').css({
                    'background': 'url(' + this.session.tiles[tile].imgPath + ')',
                    'background-size': 'contain',
                }).attr('id', 'count-' + tile)
                    .html(this.session.count[tile])
                    .appendTo(this.$tileContainer[tile]);
                this.$tileContainer[tile].append($('<p />').html(this.session.tiles[tile].name));
                $parentNodeTiles.append(this.$tileContainer[tile]);

                this.$tileContainer[tile].on('click', function () {
                    this.session.activeElement = this.session.tiles[tile];
                    $parentNodeGrid.css('cursor', 'url(' + this.session.activeElement.cursorImgPath + '), auto');
                    $('.toolkit-element.active').toggleClass('active');
                    this.$tileContainer[tile].toggleClass('active');
                }.bind(this));
            }
        }

        updateCounter($countTileser, $countTileserParent, count) {
            $countTileser.html(count);
            if (count === 0) $countTileserParent.addClass('empty');
            if (count === 1) $countTileserParent.removeClass('empty');
        }
    }

})(window);