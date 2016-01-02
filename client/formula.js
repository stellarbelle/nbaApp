function makeTeams(players, salaryCap, positions){
  if (players.length === 0 || positions.length === 0) {
    return [];
  }
  return playerPositions(players, positions, salaryCap);
}


function playerPositions (players, positions, salaryCap) {
  console.log("positions: ", positions);
  console.log("players: ", players);
  var positionsGroups = {};
  var playerPositionsList = Object.keys(positions); //"first", "second"
  for (var i=0; i < playerPositionsList.length; i++) {
    var posName = playerPositionsList[i];
    var posArr = positions[posName];
    for (var j=0; j < posArr.length; j++) {
      var position = [];
      for (var player in players) {
        if (players[player].position === positions[playerPositionsList[i]][j]) {
          position.push(players[player]);
        }
      }
      positionsGroups[posName] = position;
    }
  }
  return createTeams(positionsGroups, salaryCap);
}

function createTeams(positionsGroups, salaryCap) {
  var teams = [], groups = positionsGroups, keys = Object.keys(groups);
  var max = keys.length-1;
  // console.log("groups: ", groups);
  // console.log("groups length", keys.length);

  function helper(dict, i) {
  var superPosition = keys[i];
  console.log(groups[superPosition]) ;
  console.log(groups[superPosition].length);

  for (var j=0, l=groups[superPosition].length; j<l; j++) {
      var a = {};
      Object.keys(dict).forEach(function(key) {
           a[ key ] = dict[ key ];
      });
      a[superPosition] = (groups[superPosition][j]);
      if (i==max) {
          teams.push(a);
      } else {
          helper(a, i+1);
      }
    }
  }

  helper({}, 0);
  return checkSalaryAndDupes(teams, salaryCap);
}

function checkSalaryAndDupes(teams, salaryCap) {
  var indices = [];
  teamLoop:
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var salarySum = 0;
    superPositions = Object.keys(team);
    playerLoop:
    for (var j = 0; j < superPositions.length; j++) {
      player = team[superPositions[j]];
      salarySum += player.salary;
      playerCheckLoop:
      for (var k = j+1; k < superPositions.length; k++) {
        if (player.name === team[superPositions[k]].name) {
          indices.push(i);
          break playerLoop;
        }
      }
    }
    team.totalSalary = salarySum;
    if (team.totalSalary > salaryCap) {
      indices.push(i);
    }
  }
  for (var s = indices.length - 1; s >= 0; s--) {
    teams.splice(indices[s], 1);
  }
  return teams;
}

/* (players, salaryCap, positions) */
/* postions = [["point guard"], ["shooting guard"], ["small forward"], ["power forward"], ["center"],
    ["point guard", "shooting guard"], ["small forward", "power forward"],
    ["point guard", "shooting guard", "small forward", "power forward", "center"]]

    cycle through each position array of players, cycle through each required postiton,
    match each player position with required position, check each team for duplicate teams,
    check the sum of each teams salary with salaryCap, return acceptable teams*/
