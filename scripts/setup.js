var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: '#852999',
    scene: {
        //preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    // no need? only for loading assets, i think
}

function create()
{
    this.model = {}
    setupConstants(this);
    setupModel(this);
}

function setupConstants(scene)
{
    scene.constants = {};
    scene.constants.hexRadius = 50;
    scene.constants.gridRadius = 3;
    scene.constants.innerMultiplier = 1.5;
    scene.constants.emptyHexColor = Phaser.Display.Color.HexStringToColor('#ffffff').color;
    scene.constants.gameOverBackgroundColor = Phaser.Display.Color.HexStringToColor('#ffff00').color
    scene.constants.gameOverTextColor = Phaser.Display.Color.HexStringToColor('#000000').color
    scene.constants.animationDuration = 400;
    scene.constants.animationEase = Phaser.Math.Easing.Quadratic.Out;
    // TODO: this can probably just be math?
    // from https://colorhunt.co/palette/f5d5aeef9a53c539b4852999
    scene.constants.pieceColors = { 
                                    0   : Phaser.Display.Color.HexStringToColor('#9A2A35').color,
                                    1   : Phaser.Display.Color.HexStringToColor('#9A2A5E').color,
                                    2   : Phaser.Display.Color.HexStringToColor('#9A2A87').color,
                                    3   : Phaser.Display.Color.HexStringToColor('#852999').color,
                                    4   : Phaser.Display.Color.HexStringToColor('#5A2A9A').color,
                                    5   : Phaser.Display.Color.HexStringToColor('#2A2A9A').color,
                                    6   : Phaser.Display.Color.HexStringToColor('#2A579A').color,
                                    7   : Phaser.Display.Color.HexStringToColor('#2A809A').color
                                  }
}

function setupModel(scene)
{
    const emptyHexColor = scene.constants.emptyHexColor;
    const hexRadius = scene.constants.hexRadius;
    const gridRadius = scene.constants.gridRadius;

    scene.model.touchesDisabled = false;

    scene.model.backgroundHexes = []
    for (let columnIndex = 0; columnIndex < gridRadius * 2 - 1; ++columnIndex) 
    {
        scene.model.backgroundHexes.push([]);
        const maxHeight = maxColumnHeight(gridRadius, columnIndex);
        for (let rowIndex = 0; rowIndex < maxHeight; ++rowIndex) 
        {
            const points = hexagonPoints(hexRadius);
            const coords = coordinatesForPosition(columnIndex, rowIndex, hexRadius, gridRadius);
            const hex = scene.add.polygon(coords.x, coords.y, points, emptyHexColor);
            hex.rowColumnPosition = {row: rowIndex, column: columnIndex}; 
            hex.setInteractive();
            hex.on('pointerup', () => hexClickHandler(scene, {x: columnIndex, y: rowIndex}));
            scene.model.backgroundHexes[columnIndex].push(hex);
        }
    }

    setupAdjacencies(scene);
    setupNextPieces(scene);
    setupScore(scene);
}

function setupAdjacencies(scene)
{
    const gridRadius = scene.constants.gridRadius;

    for (let columnIndex = 0; columnIndex < gridRadius * 2 - 1; ++columnIndex)
    {
        const maxHeight = maxColumnHeight(gridRadius, columnIndex);
        for (let rowIndex = 0; rowIndex < maxHeight; ++rowIndex) 
        {
            const currentHex = scene.model.backgroundHexes[columnIndex][rowIndex];
            currentHex.adjacentHexes = [];
            const canLookUp = rowIndex > 0;
            const canLookDown = rowIndex < maxColumnHeight(gridRadius, columnIndex) - 1;
            const canLookLeft = columnIndex > 0 && scene.model.backgroundHexes[columnIndex - 1].length > rowIndex;
            const canLookRight = columnIndex < gridRadius * 2 - 2 && scene.model.backgroundHexes[columnIndex + 1].length > rowIndex;

            
            if (canLookUp)
            {
                currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex][rowIndex - 1]);
            }

            if (canLookDown)
            {
                currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex][rowIndex + 1]);
            }
            
            if (canLookLeft)
            {
                currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex - 1][rowIndex]);
            }

            if (canLookRight)
            {
                currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex + 1][rowIndex]);
            }


            if (columnIndex < gridRadius - 1)
            {
                currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex + 1][rowIndex + 1])
                if (rowIndex > 0 && columnIndex > 0)
                {
                    currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex - 1][rowIndex - 1]);
                }
            }

            if (columnIndex >= gridRadius)
            {
                currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex - 1][rowIndex + 1])
                if (rowIndex > 0 && columnIndex < gridRadius * 2 - 2)
                {
                    currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex + 1][rowIndex - 1])
                }
            }

            if (columnIndex == gridRadius - 1)
            {
                if (rowIndex > 0)
                {
                    currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex - 1][rowIndex - 1]);
                    currentHex.adjacentHexes.push(scene.model.backgroundHexes[columnIndex + 1][rowIndex - 1]);
                }
            }

        }
    }

}

function setupNextPieces(scene)
{
    scene.model.nextPieces = {};
    scene.model.nextPieces.values  = [1, 1, 1];
    scene.model.nextPieces.text = scene.add.text(25, 550, nextPiecesString(scene.model.nextPieces.values));
}

function setupScore(scene)
{
    scene.model.score = {};
    scene.model.score.value = 0;
    scene.model.score.text = scene.add.text(25, 25, scoreString(scene.model.score.value));
}


