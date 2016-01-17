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


nbaApp.controller('playersController', function ($scope, $routeParams, $location, playerFactory) {

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
      if ($scope.todaysPlayers.hasOwnProperty(player._id)) {
        $scope.selectedPlayers.push(player);
      } else {
        $scope.openPlayers.push(player);
      }
    }
    $scope.opCount = $scope.openPlayers.length;
    $scope.spCount = $scope.selectedPlayers.length;
  });

  $scope.createPlayer = function() {
    if ($scope.player.name !== "" && $scope.player.position !== "" && $scope.player.salary !== "") {
      playerFactory.createPlayer($scope.player, function(player) {
        $scope.selectedPlayers.push(player);
        $scope.player = {};
        $scope.opCount = $scope.openPlayers.length;
        $scope.spCount = $scope.selectedPlayers.length;
      });
    }
  };

  $scope.addSalary = function(player) {
    //optimize later
    playerFactory.addSalary(player._id, player, function(id) {
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
          $scope.openPlayers.push(selectedPlayer);
          $scope.selectedPlayers.splice(playerIndex, 1);
        }
      }
      $scope.opCount = $scope.openPlayers.length;
      $scope.spCount = $scope.selectedPlayers.length;
    });
  };

  $scope.clearPlayers = function() {
    playerFactory.clearPlayers(function() {
      playerFactory.getPlayers(function(players) {
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

});

nbaApp.controller('teamsController', function ($location, $scope, playerFactory) {

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
    $scope.teams = makeTeams(selectedPlayers, 50000, positions);
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
