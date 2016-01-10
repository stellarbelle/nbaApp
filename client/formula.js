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
  for (var i = teams.length-1; i >= 0; i--) {
    var team = teams[i];
    var salarySum = 0;
    var allPlayers = []
    var superPositions = Object.keys(team);
    playerLoop:
    for (var j = 0; j < superPositions.length; j++) {
      var player = team[superPositions[j]];
      salarySum += player.salary;
      allPlayers.push(player.name);
      playerCheckLoop:
      for (var k = j+1; k < superPositions.length; k++) {
        if (player.name === team[superPositions[k]].name) {
          teams.splice(i, 1);
          break playerLoop;
        }
      }
    }
    team.totalSalary = salarySum;
    if (team.totalSalary > salaryCap) {
      teams.splice(i, 1);
    } else {
      allPlayers = allPlayers.sort();
      team.allPlayers = allPlayers.toString();
    }
  }
  for (var l = 0; l < teams.length; l++) {
    for (var m = teams.length - 1; m > l; m--) {
      if (teams[l].allPlayers == teams[m].allPlayers) {
        teams.splice(m, 1)
      }
    }
  }
  return teams;
}
