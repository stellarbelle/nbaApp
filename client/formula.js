function makeTeams(players, salaryCap, positions){
  if (players.length === 0 || positions.length === 0) {
    return [];
  }
  return playerPositions(players, positions, salaryCap);
}


function playerPositions (players, positions, salaryCap) {
  var positionsGroups = {};
  var playerPositionsList = Object.keys(positions); //"first", "second"
  for (var i=0; i < playerPositionsList.length; i++) {
    var posName = playerPositionsList[i];
    var posArr = positions[posName];
    var position = [];
    for (var j=0; j < posArr.length; j++) {
      for (var player in players) {
        if (players[player].position == positions[playerPositionsList[i]][j]) {
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

  function helper(dict, i) {
  var superPosition = keys[i];

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
    var superPositions = Object.keys(team);
    playerLoop:
    for (var j = 0; j < superPositions.length; j++) {
      var player = team[superPositions[j]];
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
