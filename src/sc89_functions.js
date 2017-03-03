RoomVisual.prototype.drawCross = function(x, y, style) {
    this.line(x-0.5, y, x+0.5, y, style);
    this.line(x, y-0.5, x, y+0.5, style);
};

/** @param {Creep} creep **/
sc89functions.generate_body = function(bodyIteration, spawn) {
    //Always start with a MOVE
    var body = [MOVE];
    while (sc89functions.calcBodyCost(body) + sc89functions.calcBodyCost(bodyIteration) <= spawn.room.energyAvailable && body.length + bodyIteration.length <= MAX_CREEP_SIZE) {
        body = body.concat(bodyIteration);
    }
    return body;
};


sc89functions.calcBodyCost = function(body) {
    return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
};

sc89functions.getRandomFreePos = function (startPos, distance) {
    var x,y;
    do {
        x = startPos.x + Math.floor(Math.random()*(distance*2+1)) - distance;
        y = startPos.y + Math.floor(Math.random()*(distance*2+1)) - distance;
    }
    while((x+y)%2 != (startPos.x+startPos.y)%2 || Game.map.getTerrainAt(x,y,startPos.roomName) == 'wall');
    return new RoomPosition(x,y,startPos.roomName);
};

sc89functions.getExits = function (room, direction){
    //find exits

    var exit_tiles = [];
    switch(direction) {
        case('top'):
            //top 0:0 - 49:0
            for (var n = 0; n < 49; n++) {
                if(Game.map.getTerrainAt(n , 0 , room.name) === 'plain') {
                    exit_tiles.push({
                        x: n,
                        y: 0
                    });
                }
            }
            break;
        case('right'):
            //right  49:0 - 49:49
            for (var n = 0; n < 49; n++) {
                if(Game.map.getTerrainAt(49 , n , room.name) === 'plain') {
                    exit_tiles.push({
                        x: 49,
                        y: n
                    });
                }
            }
            break;
        case('bottom'):
            //bottom 0:49 - 49:49
            for (var n = 0; n < 49; n++) {
                if(Game.map.getTerrainAt(n , 49 , room.name) === 'plain') {
                    exit_tiles.push({
                        x: n,
                        y: 49
                    });
                }
            }

            break;
        case('left'):
            //left  0:0 - 0:49
            for (var n = 0; n < 49; n++) {
                if(Game.map.getTerrainAt(0 , n , room.name) === 'plain') {
                    exit_tiles.push({
                        x: 0,
                        y: n
                    });
                }
            }
            break;
    }
    return exit_tiles;
};

sc89functions.planWalls = function (room) {
    //console.log(JSON.stringify(exit_tiles));
    //["wall","wall","wall","wall","wall","wall","wall","wall","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","plain","wall","wall","wall","wall","wall","wall","wall","wall","wall","wall","wall","wall","wall","wall","wall","wall"]

    var sides = ['top', 'bottom', 'left', 'right'];
    for (var j = 0; j < sides.length; j++) {
        var exit_tiles = sc89functions.getExits(room, sides[j]);
        for (var n = 0; n < exit_tiles.length; n++) {
            Game.rooms[room.name].visual.drawCross(exit_tiles[n].x,exit_tiles[n].y, {color: '#ff0000'});
        }
    }


    //{"1":"W1N2","5":"W1N0"}
    //console.log(JSON.stringify(Game.map.describeExits(room.name)));

};

sc89functions.checkStore = function(room){
    //if a storage pos is defined
    if(room.controller.memory != undefined){
        var x = room.controller.memory.store.x;
        var y = room.controller.memory.store.y;
        var pos = room.lookAt(x, y);
        if(pos[0].type !== 'structure' && Game.map.getTerrainAt(x, y, room.name) === 'plain'){
            room.createConstructionSite(x,y, STRUCTURE_STORAGE);
        } else {
            //TODO: should check if there is a storage here or add something to memory to confirm?
        }
    }
}

sc89functions.posNear = function (x, y, room) {
    //console.log(JSON.stringify(exit_tiles));
    var pos_free = [];
    //get controller x/y
    //start x-1 y-1 (1 left l up)
    //do 3 to the right
    //do above 3 times
    var x_pos = parseInt(x) - 1;
    var y_pos = parseInt(y) - 1;
    for(var p = 0; p < 3; p++){
        for(var n = 0; n < 3; n++){
            var new_x = (parseInt(x_pos) + parseInt(n));
            var new_y = (parseInt(y_pos) + parseInt(p));
            if(Game.map.getTerrainAt(new_x, new_y, room.name) === 'plain') {
                pos_free.push({
                    x: new_x,
                    y: new_y
                })
            }
        }
    }
    return pos_free[Math.floor(Math.random()*pos_free.length)];
};