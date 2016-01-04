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
      var players = [];
      var factory = {};

      factory.createPlayer = function(player, callback) {
        $http.post('/createPlayer', player).success(function(players) {
          callback(players);
        });
      };

      factory.getPositions = function(callback) {
        callback(positions);
      };

      factory.getPlayers = function(callback) {
        $http.get('/showPlayers').success(function(data) {
          var dt = new Date();
          dt = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
          for (var player in data) {
            if (data[player].date === dt) {
              players.push(data[player]);
            }
          }
          callback(players);
          players = [];
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

      return factory;

    });


    nbaApp.controller('playersController', function ($scope, $routeParams, playerFactory) {

      $scope.players = [];
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

      playerFactory.getPositions(function (positions) {
        $scope.positions = positions;
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

      playerFactory.getPlayers(function (players) {
        $scope.players = players;
        $scope.teams = makeTeams(players, 50000, positions);
      });

    });
