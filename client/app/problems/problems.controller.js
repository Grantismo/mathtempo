'use strict';

angular.module('mathtempoApp')
  .controller('ProblemsCtrl', function($scope, $http) {
    $scope.problems = [];
    $http.get('/api/problems').success(function(problems) {
      $scope.problems = problems;
    });
  }).controller('ProblemCtrl', function($scope, $stateParams, $http, Auth, $state, $document, $location, $interval) {
    $scope.user = Auth.getCurrentUser();
    $scope.answered = false;
    $scope.progress = 0;

    var elaspedTime = 0;
    $scope.$on('timer-tick', function(event, args) {
      elaspedTime = args.millis;
    });

    function problemUrl(problemId) {
      return '/api/problems/' + problemId;
    }

    $scope.problem = {};

    $http.get('/api/problems/next').success(function(problem) {
      $scope.problem = problem;
    });

    var onKeypress = function(event) {
      if (event.keyCode === 13) { //enter button
        $scope.nextProblem();
        $document.off('keypress');
      }
    };

    $scope.nextProblem = function() {
      $http.get('/api/problems/next').success(function(problem) {
        $scope.answered = false;
        $scope.problem = problem;
        elaspedTime = 0;
        $scope.$broadcast('timer-start');
      });
    };


    $scope.addComment = function(content) {
      $http.post(problemUrl($scope.problem._id) + '/comment', {
        content: content
      }).success(function(problem) {
        $scope.problem = problem;

      }).error(function(err) {
        window.alert('Error adding comment');
      });
    };

    function postAnswer(answer){
      $http.post(problemUrl($scope.problem._id) + '/answer', {
        answer: answer,
        solve_time: elaspedTime
      }).success(function(result) {

        $scope.correct = result.correct;
        $scope.answered = true;
        $scope.yourAnswer = answer;

        $scope.problem = result.problem;
        result.user.rank_change = result.user.rank - $scope.user.rank;
        $scope.user = result.user;

        $scope.ratingProgressConfig.series[0].data = _.map($scope.user.ratings, ratingToHighcharts);

        $document.on('keypress', onKeypress);

      }).error(function(err) {
        console.log(err);
      });
    }

    $scope.submitAnswer = function(answer) {
      $scope.$broadcast('timer-stop');
      postAnswer(answer);
    };

    function ratingToHighcharts(r) {
      return [Date.parse(r.date), r.rating];
    }

    $scope.ratingProgressConfig = {
      options: {
        chart: {
          type: 'spline',
          fontFamily: '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
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
