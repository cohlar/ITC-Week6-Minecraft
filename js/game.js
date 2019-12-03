'use strict';

window.onload = function () {

    // Game class definition
    class GameElement {
        constructor(name, type) {
            this.name = name;
            this.type = type;
            this.types = type + "s";
            this.imgFolderName = this.types;
            this.imgPath = 'img/' + this.imgFolderName + '/' + name + '.png';
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
            gameContainer: $('#game-container'),
            toolkit: $('#toolkit'),
            tools: undefined,
        },
        tools: {
            axe: new Tool('axe', 'tree'),
            pickaxe: new Tool('pickaxe', 'rock'),
            shovel: new Tool('shovel', 'dirt'),
        },
        tiles: {
            diamond: new Tile('diamond'),
            dirt: new Tile('dirt'),
            fence: new Tile('fence'),
            gate: new Tile('gate'),
            grass: new Tile('grass'),
            lava: new Tile('lava'),
            leaf: new Tile('leaf'),
            rock: new Tile('rock'),
            stone: new Tile('stone'),
            tnt: new Tile('tnt'),
            tree: new Tile('tree'),
        },
        activeElement: undefined,
    }

    // Initiates the game page
    Minecraft.init = function () {
        this.generateHTML();
        this.html.tools.on('click', this.setActiveElementEventHandler);
    };

    // Generate HTML elements
    Minecraft.generateHTML = function () {
        for (const tool in this.tools) {
            const toolContainer = $('<div />').attr({
                'id': tool,
                'class': 'tool-container',
                'data-type': this.tools[tool].types,
            });
            toolContainer.append($('<img />').attr('src', this.tools[tool].imgPath));
            toolContainer.append($('<p />').html(this.tools[tool].name));
            this.html.toolkit.append(toolContainer);
        }
        this.html.tools = $('.tool-container');
    };

    // Event handlers
    Minecraft.setActiveElementEventHandler = function() {
        Minecraft.activeElement = Minecraft[$(this).attr("data-type")][this.id];
    };

    // General functions that may be reused outside this projects
    function build2dArray(numOfRows, numOfCols) {
        const matrix = new Array(numOfRows);

        let i = -1;
        while (++i < numOfRows) {
            matrix[i] = new Array(numOfCols);
        }
        return matrix;
    }

    // And this is where all the magic happens
    Minecraft.init();
};