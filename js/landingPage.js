const $tutorial = $('#tutorial');

const tiles = {
    diamond: createTile('diamond'),
    grass:   createTile('grass'),
    stone:   createTile('stone'),
    dirt:    createTile('dirt'),
    gate:    createTile('gate'),
    lava:    createTile('lava'),
    leaf:    createTile('leaf'),
    rock:    createTile('rock'),
    tree:    createTile('tree'),
    tnt:     createTile('tnt'),
    cloud:   createTile('cloud'),
};

const tools = {
    pickaxe: createTool('pickaxe', [tiles.rock, tiles.stone, tiles.gate, tiles.diamond]),
    shovel:  createTool('shovel',  [tiles.dirt, tiles.grass]),
    axe:     createTool('axe',     [tiles.tree, tiles.leaf]),
    bucket:  createTool('bucket',  [tiles.lava]),
};

for (let i in tools) {
    $(`
        <div class="tool">
            <div class="tool-name">
                <img src="${tools[i].imgPath}" />
                ${tools[i].name}
            </div>
            <div class="tool-description">
                ${firstLetterUpperCase(tools[i].name)} allows you to collect the following types of tiles:
            </div>
            <div class="tile-list">
                ${tools[i].tileTypes.map( tile =>
                    '<div class="tile">' +
                        '<img src="' + tile.imgPath +'" />' +
                        tile.name +
                    '</div>'
                )}
            </div>
        </div>
        `).appendTo($tutorial);
}

function firstLetterUpperCase (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}