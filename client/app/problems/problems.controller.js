'use strict';

angular.module('mathtempoApp')
  .controller('ProblemsCtrl', function($scope, $http) {
    $scope.problems = [];
    $http.get('/api/problems').success(function(problems) {
      $scope.problems = problems;
    });
  }).controller('NextProblemCtrl', function($scope, $http, $location) {
    $http.get('/api/problems/next').success(function(problem) {
      $location.path('/problems/' + problem._id);
    });
  }).controller('ProblemCtrl', function($scope, $stateParams, $http, Auth, $state, $document) {
    $scope.user = Auth.getCurrentUser();
    $scope.answered = false;

    var elaspedTime = 0;

    $scope.$on('timer-tick', function(event, args) {
      elaspedTime = args.millis;
    });

    var baseUrl = '/api/problems/' + $stateParams.id;

    $scope.problem = {};
    $http.get(baseUrl).success(function(problem) {
      $scope.problem = problem;
      $scope.averageSolveTime = moment.duration(problem.average_solve_time).format("hh:mm:ss", {
        trim: false
      });
      $scope.sdSolveTime = moment.duration(problem.sd_solve_time).format("hh:mm:ss", {
        trim: false
      });
    });

    var onKeypress = function(event) {

      if (event.keyCode == 13) { //enter button
        $state.go("problems-next");
        console.log("unbind");
        $document.off("keypress");
      }
    }


    $scope.addComment = function(content) {
      $http.post(baseUrl + "/comment", {
        content: content
      }).success(function(problem) {
        $scope.problem = problem;

      }).error(function(err) {
        alert("Error adding comment");
      });
    };

    $scope.submitAnswer = function(answer) {
      $scope.$broadcast('timer-stop');
      $http.post(baseUrl + "/answer", {
        answer: answer,
        solve_time: elaspedTime
      }).success(function(result) {

        $scope.correct = result.correct;
        $scope.answered = true;
        $scope.yourAnswer = answer;

        $scope.problem = result.problem;
        $scope.user = result.user;
        Auth.setCurrentUser($scope.user);
        $scope.ratingProgressConfig.series[0].data = _.map($scope.user.ratings, ratingToHighcharts);

        $document.on("keypress", onKeypress);

      }).error(function(err) {
        alert("There was a problem");
      });
    };

    function ratingToHighcharts(r) {
      return [Date.parse(r.date), r.rating];
    }

    $scope.ratingProgressConfig = {
      options: {
        chart: {
          type: 'spline',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          spline: {
            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 3
              }
            },
          }
        },
      },
      title: {
        text: 'Rating Progress'
      },
      xAxis: {
        type: 'datetime',
        title: {
          enabled: false
        },
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      series: [{
        name: 'Rating',
        data: _.map($scope.user.ratings, ratingToHighcharts)
      }],
      size: {
        height: 300,
      }
    };

  });
