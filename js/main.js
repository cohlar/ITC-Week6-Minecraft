"use strict";

window.onload = function () {

    let Minecraft = {};

    // General functions that may be reused outside this projects
    function build2dArray(numOfRows, numOfCols) {
        const matrix = new Array(numOfRows);

        let i = -1;
        while (++i < numOfRows) {
            matrix[i] = new Array(numOfCols);
        }
        return matrix;
    }
};