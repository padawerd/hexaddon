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

