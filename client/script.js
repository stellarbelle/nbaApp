var nbaApp = angular.module('nbaApp', ['ngRoute', 'ngStorage']);

nbaApp.config(function ($routeProvider) {
  $routeProvider
  .when('/players',{
    templateUrl: 'partials/players.html'
  })
  .when('/show/:_id',{
    templateUrl: 'partials/edit.html'
  })
  .when('/teams',{
    templateUrl: 'partials/teams.html'
  })
  .when('/edit/:id', {
    templateUrl: 'partials/edit.html'
  })
  .otherwise({
    redirectTo: '/players'
  });
});

nbaApp.directive('myMultiselectDirective', function() {
  return function(scope, element, attrs) {
    var $option = $(element);
    $option.text(scope.position);
    $option.val(scope.position);

    if (scope.$last) {
      var $parent = $option.parent()
      $parent.multiselect({
        includeSelectAllOption: true,
        selectAllNumber: false
      });
      $parent.multiselect('selectAll', false);
      $parent.multiselect('updateButtonText');
    }
  }
})

// nbaApp.directive('mySelectDirective', function() {
//   return function(scope, element, attrs) {
//     $(element).selectpicker({
//       size: 4
//     });
//   }
// })

nbaApp.factory('playerFactory', function($http, $localStorage) {

  var positions = ["point guard", "shooting guard", "center", "small forward",
                   "power forward"];
  var factory = {};
  var storage = $localStorage.$default({
    todaysPlayers: {}
  });
  var todaysPlayers = storage.todaysPlayers;

  factory.createPlayer = function(player, callback) {
    $http.post('/createPlayer', player).success(function(player) {
      todaysPlayers[player._id] = player.salary;
      callback(player);
    });
  };

  factory.getPositions = function(callback) {
    callback(positions);
  };

  factory.getPlayers = function(callback) {
    $http.get('/showPlayers').success(function(players) {
      callback(players, todaysPlayers);
    });
  };
  factory.showPlayer = function(id, callback) {
    $http.get('/showPlayer/' + id).success(function(player) {
      callback(player);
    });
  };

  factory.updatePlayer = function(id, player, callback) {
    $http.post('/updatePlayer/' + id, player).success(function(player) {
      callback(player);
    });
  };

  factory.addSalary = function(id, player, callback) {
    todaysPlayers[id] = player.salary;
    $http.post('/updateSalary/' + id, player).success(function() {
      callback(id);
    });
  };

  factory.clearPlayers = function(callback) {
    storage.$reset();
    callback();
  };

  factory.removePlayer = function(id, callback) {
    var salary = todaysPlayers[id];
    delete todaysPlayers[id];
    callback(salary, todaysPlayers);
  };

  factory.deletePlayer = function(id, callback) {
    $http.post('/deletePlayer/' + id).success(function(players) {
      callback(id);
    });
  };

  return factory;

});

nbaApp.factory('salaryFactory', function($localStorage) {
  factory = {};

  var salStorage = $localStorage.$default({
    salaryMin: 0
  });

  factory.setSalMin = function(min) {
    salStorage.salaryMin = min;
  }

  factory.getSalMin = function() {
    return salStorage.salaryMin;
  }

  return factory;
});


nbaApp.controller('playersController', function ($scope, $localStorage, $routeParams, $rootScope, $location, playerFactory, salaryFactory) {

  $scope.openPlayers = [];
  $scope.selectedPlayers = [];
  $scope.players = [];
  $scope.opCount = 0;
  $scope.spCount = 0;
  $scope.player = {
    name: '',
    position: '',
    salary: ''
  };
  $scope.positions = [];
  $scope.salaryMin = salaryFactory.getSalMin()

  playerFactory.getPositions(function (positions) {
    $scope.positions = positions;
  });

  playerFactory.getPlayers(function (players, selectedPlayers) {
    //players = combined data (Mongo + local)
    $scope.todaysPlayers = selectedPlayers;
    $scope.openPlayers = [];
    $scope.players = players;

    for (var playerIndex in players) {
      var player = players[playerIndex];
      var secPos;
      if (player.position == "shooting guard") {
        secPos = ["shooting guard", "guard", "utility"];
      } else if (player.position == "point guard") {
        secPos = ["point guard", "guard", "utility"];
      } else if (player.position == "small forward") {
        secPos = ["small forward", "forward", "utility"];
      } else if (player.position == "power forward") {
        secPos = ["power forward", "forward", "utility"];
      } else {
        secPos = ["center", "utility"];
      }
      if ($scope.todaysPlayers.hasOwnProperty(player._id)) {
        $scope.selectedPlayers.push(player);
      } else {
        player.secondaryPositionsOpts = secPos;
        player.secondaryPositions = secPos
        $scope.openPlayers.push(player);
      }
    }
    $scope.opCount = $scope.openPlayers.length;
    $scope.spCount = $scope.selectedPlayers.length;
    $('.multiPos').multiselect();
  });

  $scope.createPlayer = function() {
    if ($scope.player.name !== "" && $scope.player.position !== "" && $scope.player.salary !== "") {
      var secPos;
      if ($scope.player.position == "shooting guard") {
        secPos = ["shooting guard", "guard", "utility"];
      } else if ($scope.player.position == "point guard") {
        secPos = ["point guard", "guard", "utility"];
      } else if ($scope.player.position == "small forward") {
        secPos = ["small forward", "forward", "utility"];
      } else if ($scope.player.position == "power forward") {
        secPos = ["power forward", "forward", "utility"];
      } else {
        secPos = ["center", "utility"];
      }
      var player_repack = {
                            name: $scope.player.name,
                            position: $scope.player.position,
                            salary: $scope.player.salary,
                            secondaryPositionsOpts: secPos,
                            secondaryPositions: secPos
                          };
      playerFactory.createPlayer(player_repack, function(player) {
        $scope.openPlayers.push(player);
        $scope.player = {};
        $scope.opCount = $scope.openPlayers.length;
        $scope.spCount = $scope.selectedPlayers.length;
      });
    }
  };

  $scope.addSalary = function(player) {
    //optimize later
    var player_repack = {
                          salary: player.salary,
                          secondaryPositions: player.secondaryPositions
                        }
    playerFactory.addSalary(player._id, player_repack, function(id) {
      for (var i = 0; i < $scope.openPlayers.length; i++) {
        if ($scope.openPlayers[i]._id === id) {
          var player = $scope.openPlayers.splice(i, 1);
          $scope.selectedPlayers.push(player[0]);
        }
      }
      $scope.opCount = $scope.openPlayers.length;
      $scope.spCount = $scope.selectedPlayers.length;
    });
  };

  $scope.removePlayer = function(removedPlayer) {
    playerFactory.removePlayer(removedPlayer._id, function(salary, todaysPlayers) {
      for (var playerIndex in $scope.selectedPlayers) {
        var selectedPlayer = $scope.selectedPlayers[playerIndex];
        if (selectedPlayer._id == removedPlayer._id) {
          var secPos = selectedPlayer.secondaryPositionsOpts
          selectedPlayer.secondaryPositions = secPos
          $scope.openPlayers.push(selectedPlayer);
          $scope.selectedPlayers.splice(playerIndex, 1);
        }
      }
      $scope.opCount = $scope.openPlayers.length;
      $scope.spCount = $scope.selectedPlayers.length;
    });
  };

  $scope.clearPlayers = function() {
    for (var index in $scope.selectedPlayers) {
      var secPos = $scope.selectedPlayers[index].secondaryPositionsOpts;
      $scope.selectedPlayers[index].secondaryPositions = secPos;
      console.log("secpos:", secPos);
      console.log("player pos: ", $scope.selectedPlayers[index].secondaryPositions);
    }
    playerFactory.clearPlayers(function() {
      playerFactory.getPlayers(function(players) {
        for (var index in players) {
          var secPos = players[index].secondaryPositionsOpts;
          players[index].secondaryPositions = secPos;
        }
        $scope.openPlayers = players;
        $scope.selectedPlayers = [];
        $scope.opCount = $scope.openPlayers.length;
        $scope.spCount = $scope.selectedPlayers.length;
      });
    });
  };

  $scope.deletePlayer = function(player) {
    playerFactory.deletePlayer(player._id, function(id) {
      for (var i = 0; i < $scope.openPlayers.length; i++) {
        if ($scope.openPlayers[i]._id === id) {
          $scope.openPlayers.splice(i, 1);
        }
      }
      $scope.opCount = $scope.openPlayers.length;
      $scope.spCount = $scope.selectedPlayers.length;
    });
  };

  $scope.editPlayer = function(id) {
    $location.path('/edit/' + id);
  };

  $scope.createTeams = function() {
    salaryFactory.setSalMin($scope.salaryMin);
    $location.path('/teams');
  };

});

nbaApp.controller('teamsController', function ($location, $rootScope, $localStorage, $scope, playerFactory, salaryFactory) {

  var selectedPlayers = [];
  var positions = {
      "point guard": ["point guard"],
      "shooting guard": ["shooting guard"],
      "small forward": ["small forward"],
      "power forward": ["power forward"],
      "center": ["center"],
      "guard": ["point guard", "shooting guard"],
      "forward": ["small forward", "power forward"],
      "utility": ["point guard", "shooting guard", "small forward", "power forward", "center"]
  };

  playerFactory.getPlayers(function (players, todaysPlayers) {
    for (var playerIndex in players) {
      var player = players[playerIndex];
      if (todaysPlayers.hasOwnProperty(player._id)) {
        selectedPlayers.push(player);
      }
    }
    var teams = makeTeams(selectedPlayers, 50000, positions);
    var salMin = salaryFactory.getSalMin();

    var maxSalTeams = [];
    for (var team in teams) {
      if (teams[team].totalSalary > salMin) {
        maxSalTeams.push(teams[team]);
      }
    }
    $scope.teams = maxSalTeams;
    console.log($scope.teams);
  });

});

nbaApp.controller('editplayerController', function ($scope, $routeParams, $location, playerFactory) {

  $scope.positions = [];

  playerFactory.getPositions(function (positions) {
    $scope.positions = positions;
  });

  playerFactory.showPlayer($routeParams.id, function(player) {
    $scope.player = player;
  });

  $scope.editPlayer = function() {
    playerFactory.updatePlayer($scope.player._id, $scope.player, function(player) {
      $location.path('/players');
    });
  };

});
