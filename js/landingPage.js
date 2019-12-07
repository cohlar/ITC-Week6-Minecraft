const $tutorial = $('#tutorial');

const tiles = {
    diamond: createTile('diamond'),
    grass:   createTile('grass'),
    stone:   createTile('stone'),
    dirt:    createTile('dirt'),
    lava:    createTile('lava'),
    leaf:    createTile('leaf'),
    rock:    createTile('rock'),
    tree:    createTile('tree'),
    cloud:   createTile('cloud'),
};

const tools = {
    pickaxe: createTool('pickaxe', [tiles.rock, tiles.stone, tiles.diamond]),
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
                The ${tools[i].name} tool allows you to collect the following types of tiles:
            </div>
            <div class="tile-list">
                ${tools[i].tileTypes.map( tile =>
                    '<div class="tile">' +
                        '<img src="' + tile.imgPath +'" />' +
                        tile.name +
                    '</div>'
                ).join('')}
            </div>
        </div>
        `).appendTo($tutorial);
}