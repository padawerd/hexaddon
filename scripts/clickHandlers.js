function hexClickHandler(scene, position)
{
    const clickedHex = scene.model.backgroundHexes[position.x][position.y];
    if (clickedHex.currentPiece == null && !scene.model.touchesDisabled)
    {
        populateClickedHex(scene, clickedHex);
        absorb(scene, clickedHex);
        updateNextPieces(scene);
        handleLossIfNeeded(scene);
    }
}

// precondition: if clickedHex.currentPiece == null
function populateClickedHex(scene, clickedHex)
{
    const innerMultiplier = scene.constants.innerMultiplier
    const adjustedHexRadius = scene.constants.hexRadius / innerMultiplier;
    const gridRadius = scene.constants.gridRadius;
    const newValue = scene.model.nextPieces.values[0]

    clickedHex.currentPiece = {};
    clickedHex.currentPiece.value = newValue;
    const coords = coordinatesForPosition(clickedHex.rowColumnPosition.column, 
                                          clickedHex.rowColumnPosition.row, 
                                          adjustedHexRadius, 
                                          gridRadius,
                                          innerMultiplier);
    const points = hexagonPoints(adjustedHexRadius);
    clickedHex.currentPiece.hex = scene.add.polygon(coords.x, coords.y, points, scene.constants.pieceColors[colorNumberForValue(newValue)]);
    // todo: be more intentional
    clickedHex.currentPiece.text = scene.add.text(coords.x - 10, coords.y, newValue);
    incrementScore(scene, newValue);
}

function updateNextPieces(scene)
{
    scene.model.nextPieces.values.shift();
    const newValue = nextPieceValue(scene);
    scene.model.nextPieces.values.push(newValue);
    scene.model.nextPieces.text.text = nextPiecesString(scene.model.nextPieces.values);
}

function nextPieceValue(scene)
{
    const flattenedHexes = scene.model.backgroundHexes.flat();
    const hexesWithPieces = _.filter(flattenedHexes, flattenedHex => flattenedHex.currentPiece != null);
    const values = _.map(hexesWithPieces, piece => piece.currentPiece.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const logMinValue = Math.log(minValue) / Math.log(2);
    const logMaxValue = Math.log(maxValue) / Math.log(2);
    const newValueExponent = Math.floor(Math.random() * (logMaxValue - logMinValue + 1)) + logMinValue;
    const newValue = Math.pow(2, newValueExponent);
    return newValue;
}

function shouldAbsorb(clickedHex, adjacentHex)
{
    return adjacentHex.currentPiece != null && clickedHex.currentPiece.value == adjacentHex.currentPiece.value
}

function absorb(scene, clickedHex) 
{

    const adjacentHexes = clickedHex.adjacentHexes;
    const hexesToBeAbsorbed = _.filter(adjacentHexes, (adjacentHex) => shouldAbsorb(clickedHex, adjacentHex));
    const willAbsorb = hexesToBeAbsorbed.length > 0;
    if (willAbsorb)
    {
        scene.model.touchesDisabled = true;
    }

    for (const adjacentHex of clickedHex.adjacentHexes)
    {
        if (shouldAbsorb(clickedHex, adjacentHex))
        {
            scene.tweens.add(
                {
                    targets: adjacentHex.currentPiece.hex,
                    x: clickedHex.currentPiece.hex.x, // works if alpha: 0
                    y: clickedHex.currentPiece.hex.y,
                    ease: scene.constants.animationEase,
                    duration: scene.constants.animationDuration,
                    repeat: 0,
                    yoyo:false,
                    onComplete: () => removeCurrentPieceFromHex(adjacentHex)
                }
            );
            scene.tweens.add({
                targets: adjacentHex.currentPiece.text,
                x: clickedHex.currentPiece.hex.x,
                y: clickedHex.currentPiece.hex.y,
                ease: scene.constants.animationEase,
                duration: scene.constants.animationDuration + 50,
                repeat: 0,
                yoyo:false
            });
        }
    }
    if (willAbsorb)
    {
        const newHexValue = clickedHex.currentPiece.value * 2;
        scene.tweens.add(
            {
                targets: clickedHex.currentPiece.hex,
                fillColor: scene.constants.pieceColors[colorNumberForValue(newHexValue)],
                ease: scene.constants.animationEase,
                duration: 0,
                delay: scene.constants.animationDuration,
                repeat: 0,
                yoyo:false,
                onComplete: () => {
                                    doubleHex(scene, clickedHex);
                                    scene.model.touchesDisabled = false;
                                  }
            }
        );
    }

}

function removeCurrentPieceFromHex(hex)
{
    hex.currentPiece.hex.destroy();
    hex.currentPiece.text.destroy();
    hex.currentPiece = null;
}

function doubleHex(scene, hex)
{
    const newValue = hex.currentPiece.value * 2;
    hex.currentPiece.value = newValue;
    hex.currentPiece.text.text = newValue;
    hex.currentPiece.hex.fillColor = scene.constants.pieceColors[colorNumberForValue(newValue)];
    incrementScore(scene, newValue);
}

function incrementScore(scene, incrementValue)
{
    scene.model.score.value = scene.model.score.value + incrementValue;
    scene.model.score.text.text = scoreString(scene.model.score.value);
}

function handleLossIfNeeded(scene)
{
    const flattenedHexes = scene.model.backgroundHexes.flat();
    const hexesWithoutPieces = _.filter(flattenedHexes, flattenedHex => flattenedHex.currentPiece == null);
    if (hexesWithoutPieces.length == 0)
    {
        scene.model.touchesDisabled = true;
        const rect = scene.add.rectangle(250, 250, 300, 300, scene.constants.gameOverBackgroundColor);
        scene.add.text(150, 200, `GAME OVER.\n FINAL SCORE: ${scene.model.score.value}.\n CLICK HERE TO RESTART`, {color: '#000000'});    
        rect.setInteractive();
        rect.on('pointerup', () => scene.scene.restart());
    }
}
