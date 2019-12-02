"use strict";

window.onload = function () {

    class Tool {
        constructor(name, tileType) {
            this.name      = name;
            this.tileType  = tileType;
            this.imgPath   = "img/tools/" + name + ".png";
        }
    }

    class Tile {
        constructor(tileType, tileLevel) {
            this.tileType  = tileType;
            this.name      = this.tileType;
            this.imgPath   = "img/tiles/" + name + ".png";
            this.tileLevel = tileLevel ? tileLevel : 1;
        }
    }

    const Minecraft = {
        html:  {
            gameContainer: $('#game-container'),
            toolkit:       $('#toolkit'),
        },
        tools: {
            axe:     new Tool("axe", "tree"),
            pickaxe: new Tool("pickaxe", "rock"),
            shovel:  new Tool("shovel", "dirt"),
        },
        tiles: {
            diamond: new Tile("diamond"),
            dirt:    new Tile("dirt", 0),
            fence:   new Tile("fence"),
            gate:    new Tile("gate"),
            grass:   new Tile("grass", 0),
            lava:    new Tile("lava", 0),
            leaf:    new Tile("leaf"),
            rock:    new Tile("rock"),
            stone:   new Tile("stone"),
            tnt:     new Tile("tnt"),
            tree:    new Tile("tree"),
        },
    }

    // Initiates the game page
    Minecraft.init = function () {
        this.generateHTML();
    };

    // Generate HTML elements
    Minecraft.generateHTML = function () {
        for (const tool in this.tools) {
            const toolContainer = $("<div />").attr("class", "tool-container");
            toolContainer.append($("<img />").attr("src", this.tools[tool].imgPath));
            toolContainer.append($("<p />").html(this.tools[tool].name));
            this.html.toolkit.append(toolContainer);
        }
    };



    // --------------------------------------------------------------------------------------
    // General functions that may be reused outside this projects
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
}