    var nbaApp = angular.module('nbaApp', ['ngRoute']);

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
      .otherwise({
        redirectTo: '/players'
      });
    });


    nbaApp.factory('playerFactory', function($http) {

      var positions = ["point guard", "shooting guard", "center", "small forward",
                       "power forward"];
      var factory = {};
      var todaysPlayers = [];

      factory.createPlayer = function(player, callback) {
        $http.post('/createPlayer', player).success(function(players) {
          callback(players);
        });
      };

      factory.getPositions = function(callback) {
        callback(positions);
      };

      factory.getPlayers = function(callback) {
        $http.get('/showPlayers').success(function(players) {
          callback(players);
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
        $http.post('/addSalary/' + id, player).success(function(players) {
          callback(players);
        });
      };

      factory.removePlayer = function(id, callback) {
        $http.post('/removePlayer/' + id).success(function(players) {
          callback(players);
        });
      };

      factory.getTodaysPlayers = function(callback) {
        $http.get('/showPlayers').success(function(data) {
          var dt = new Date();
          dt = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
          for (var player in data) {
            if (data[player].date === dt) {
              todaysPlayers.push(data[player]);
            }
          }
          callback(todaysPlayers);
          todaysPlayers = [];
        });
      };

      return factory;

    });


    nbaApp.controller('playersController', function ($scope, $routeParams, playerFactory) {

      $scope.players = [];
      $scope.today = ""
      $scope.player = {
        name: '',
        position: '',
        salary: ''
      };
      $scope.positions = [];

      playerFactory.getPositions(function (positions) {
        $scope.positions = positions;
      });

      playerFactory.getPlayers(function (players) {
        var dt = new Date();
        $scope.today = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
        console.log($scope.today)
        $scope.players = players;
      });

      $scope.createPlayer = function() {
        playerFactory.createPlayer($scope.player, function() {
          playerFactory.getPlayers(function(players) {
            $scope.players = players;
          });
          $scope.player = {};
        });
      };

      $scope.addSalary = function(player) {
        playerFactory.addSalary(player._id, player, function() {
          playerFactory.getPlayers(function(players) {
            $scope.players = players;
          });
        });
      };

      $scope.removePlayer = function(player) {
        playerFactory.removePlayer(player._id, function() {
          playerFactory.getPlayers(function(players) {
            $scope.players = players;
          });
        });
      };
      // $scope.showPlayer = function(id) {
      //   playerFactory.showPlayer(id, function(player) {
      //     $scope.player = player
      //   })
      // }

    });

    nbaApp.controller('editplayerController', function ($location, $scope, $routeParams, playerFactory) {

      $scope.player = {
        name: '',
        position: '',
        salary: ''
      };
      $scope.playerId = $routeParams._id;

      $scope.positions = [];

      playerFactory.getTodaysPlayers(function (todaysPlayers) {
        $scope.todaysPlayers = todaysPlayers;
        console.log(todaysPlayers)
      });

      playerFactory.showPlayer($scope.playerId, function(player) {
        $scope.player = player;

      });

      $scope.updatePlayer = function() {
        playerFactory.updatePlayer($scope.playerId, $scope.player, function(player) {
          $location.path('/players');
        });
      };

    });


    nbaApp.controller('teamsController', function ($location, $scope, playerFactory) {

      $scope.players = [];
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

      playerFactory.getTodaysPlayers(function (players) {
        $scope.players = players;
        $scope.teams = makeTeams(players, 50000, positions);
      });

    });
