RoomVisual.prototype.drawCross = function(x, y, style) {
    this.line(x-0.5, y, x+0.5, y, style);
    this.line(x, y-0.5, x, y+0.5, style);
};

/** @param {Creep} creep **/
//sc89functions.generate_body = function(bodyIteration, spawn) {
//    //Always start with a MOVE
//    var body = [MOVE];
//    var max_spend = spawn.room.energyAvailable;
//
//    while (sc89functions.calcBodyCost(body) + sc89functions.calcBodyCost(bodyIteration) <= max_spend && body.length + bodyIteration.length <= MAX_CREEP_SIZE) {
//        body = body.concat(bodyIteration);
//    }
//    return body;
//};

sc89functions.calcBodyCost = function(body) {
    return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
};

sc89functions.body_size_check = function(body, spawn){
    var max_spend = spawn.room.energyAvailable;
    var cost = sc89functions.calcBodyCost(body);
    if(cost <= max_spend && body.length <= MAX_CREEP_SIZE){
        return true;
    }
    return false;
};


sc89functions.generate_body = function(pattern, spawn){
    var body = [];
    var do_loop = true;
    var count = 0;
    var parts_list = JSON.parse(JSON.stringify(pattern));

    while(do_loop){
        //for each part in the pattern
        for (var key in parts_list) {
            var count = body.filter(function(x){return x === key}).length;
            if(count == parts_list[key]) {
                delete parts_list[key];
                if(Object.keys(parts_list).length === 0){
                    do_loop = false;
                }
                break;
            }
            var temp_body = body.slice(0);
            temp_body.push(key);
            if(Object.keys(parts_list).length === 0 || sc89functions.body_size_check(temp_body, spawn) === false){
                do_loop = false;
                break;
            } else {
                body = temp_body;
            }
        }
    }
    return body;
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

    //For example to plan walls we can take the start point for each side.
    //so for the top
    //building a postion array to loop through later
    //take the first x open postion along the x axis.
    //for the top we need to step to build range back on the x axis to account for slopes, take 2 steps to the -x
    //take one step down + 1y
    //check if this is a plain tile
    //if its plain add it to the build postion array.
    //take one step down + 1y
    //do same check
    //now start going to the right for +2 on x to get back to the start pos
    //take the next + x postion in the exit array and then to a -2 y step and check if plain.
    //do same moving x + 1 and remainging at y + 2  from the original y and checking for a plain.
    //also check that there is another x+ postion to move to in the original array if not
    //you need to a check first to see if there are x tiles within the next +2 x
    //if there is skip the next checks
    //
    //-1 on y and check plain, and add to pos array if true
    //-1 y again and same check

    //visualise the pos array to see how it looks

    //happy? then loop the array building roads, checking the number of construction sites

    //TODO account for paths through walls to exits and plan these out.





    //{"1":"W1N2","5":"W1N0"}
    //console.log(JSON.stringify(Game.map.describeExits(room.name)));

};

sc89functions.planRoads = function(room){
    console.log('Retrieving Road Positions For Room.');
    var road_positions = [];

    //range = 1 because it means were not pathing on top of a source etc rather to it.
    let room_sources = _.map(room.find(FIND_SOURCES), function(source) {
        return { pos: source.pos, range: 1 };
    });

    for(var source in room_sources){
        let path = PathFinder.search(room.controller.pos, room_sources[source]);

        for (var n = 0; n < path.path.length; n++) {
            road_positions.push({
                x: path.path[n].x,
                y: path.path[n].y
            });
        }
    }

    let room_minerals = _.map(room.find(FIND_MINERALS), function(mineral) {
        return { pos: mineral.pos, range: 1 };
    });

    for(var mineral in room_minerals){
        let path = PathFinder.search(room.controller.pos, room_minerals[mineral], {
            // We need to set the defaults costs higher so that we
            // can set the road cost lower in `roomCallback`
            plainCost: 1,
            swampCost: 1,

            roomCallback: function() {},
        });
        for (var n = 0; n < path.path.length; n++) {
            road_positions.push({
                x: path.path[n].x,
                y: path.path[n].y
            });
        }
    }

    //TODO should check the road_positions array to see if it already contains this postion?

    for (var n = 0; n < road_positions.length; n++) {
        room.visual.drawCross(road_positions[n].x,road_positions[n].y, {color: '#6FB9E1'});
    }

    return road_positions;
    //OK so too begin, were going to take an empty position next to the rooms controller as the start position for the roads
    //save this as the rooms road source point.
    //path to any sources from this point
    //path to minierals from this point
    //path to the each exit from this point, doing so by taking the exit position array, and getting a position in the middle of an exit
    //do 1 path per room side out do not do multiple paths out so mark an exit as having a route out

};

sc89functions.buildRoads = function(room){
    //Building ROads.
    if(room.memory.roads){
        var road_pos = room.memory.roads;
        for (var n = 0; n < road_pos.length; n++) {
            var x = road_pos[n].x;
            var y = road_pos[n].y;
            var pos = room.lookAt(x, y);
            if(pos[0].type !== 'structure'){
                room.createConstructionSite(x,y, STRUCTURE_ROAD);
            }
        }
    }
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
};

sc89functions.setExitPos = function(room) {

};

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