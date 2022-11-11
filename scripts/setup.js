var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ff00ff',
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
    setupBackgroundGrid(this);
}

function setupBackgroundGrid(scene)
{
    const emptyHexColor = Phaser.Display.Color.HexStringToColor('#ffffff').color;
    const hexRadius = 15;
    const initialXBuffer = 20;
    const initialYBuffer = 5;
    const betweenXBuffer = 10
    const betweenYBuffer = 15;
    const gridRadius = 3;

    const backgroundSquares = []
    for (columnIndex = 0; columnIndex < gridRadius * 2 - 1; ++columnIndex) 
    {
        backgroundSquares.push([]);
        maxColumnSize = (gridRadius * 2 - 1) - Math.abs(gridRadius - columnIndex - 1);
        heightBuffer = initialYBuffer + betweenYBuffer * (gridRadius * 2 - maxColumnSize); 
        for (rowIndex = 0; rowIndex < maxColumnSize; ++rowIndex) 
        {
            const points = hexagonPoints(hexRadius);
            const xCoord = initialXBuffer + (betweenXBuffer + hexRadius) * columnIndex;
            const yCoord = heightBuffer + (betweenYBuffer + hexRadius) * rowIndex;
            backgroundSquares[columnIndex].push(scene.add.polygon(xCoord, yCoord, points, emptyHexColor));
        }
    }
}
