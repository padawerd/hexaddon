function hexagonPoints(radius) 
{
    // 30 60 90 triangle
    const x = radius * 0.5;
    const twoX = radius;
    const root3 = x * Math.sqrt(3);

    // clockwise starting in top left
    const topLeftPoint = {x: x, y: 0};
    const topRightPoint = {x: x + twoX, y: 0};
    const farRightPoint = {x: twoX + twoX, y: root3};
    const bottomRightPoint = {x: x + twoX, y: root3 + root3};
    const bottomLeftPoint = {x: x, y: root3 + root3};
    const farLeftPoint = {x: 0, y: root3};

    return [topLeftPoint, topRightPoint, farRightPoint, bottomRightPoint, bottomLeftPoint, farLeftPoint];
}

function coordinatesForPosition(x, y, hexRadius, gridRadius, multiplier = 1)
{
    const adjustedHexRadiusForSpacings = hexRadius * multiplier

    const initialXBuffer = adjustedHexRadiusForSpacings * 1.5;
    const initialYBuffer = adjustedHexRadiusForSpacings * 0.5;
    const betweenXBuffer = adjustedHexRadiusForSpacings * 0.75;
    const betweenYBuffer = adjustedHexRadiusForSpacings;
    const maxColumnSize = (gridRadius * 2 - 1) - Math.abs(gridRadius - x - 1);
    const heightBuffer = initialYBuffer + betweenYBuffer * (gridRadius * 2 - maxColumnSize); 
    
    const xCoord = initialXBuffer + (betweenXBuffer + adjustedHexRadiusForSpacings) * x;
    const yCoord = heightBuffer + (betweenYBuffer + adjustedHexRadiusForSpacings) * y;
    
    return {x: xCoord, y: yCoord};
}

function maxColumnHeight(gridRadius, columnIndex)
{
    return (gridRadius * 2 - 1) - Math.abs(gridRadius - columnIndex - 1);
}

function nextPiecesString(nextPieceValues)
{
    return `NEXT PIECES: ${nextPieceValues[0]} | ${nextPieceValues[1]} | ${nextPieceValues[2]}`
}

function scoreString(scoreValue)
{
    return `SCORE: ${scoreValue}`
}

function colorNumberForValue(value)
{
    const mod16 = (Math.log(value) / Math.log(2)) % 14; // 0, 7, 8, 13 
    if (mod16 < 8) // 0, 7
    {
        return mod16 // 0, 7
    } else { // 8, 13
        return 14 - mod16; // 6, 1
    }
}

