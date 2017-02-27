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