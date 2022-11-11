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

}

