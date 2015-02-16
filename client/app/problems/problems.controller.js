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
  }).controller('ProblemCtrl', function($scope, $stateParams, $http, Auth) {
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
      $scope.averageSolveTime = moment.duration(problem.average_solve_time).format("hh:mm:ss", {trim: false});
    });

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

        $scope.userRatingChange = result.userRatingChange;
        $scope.problemRatingChange = result.problemRatingChange;
        $scope.problem.rating = $scope.problem.rating + result.problemRatingChange;
        $scope.user.rating = $scope.user.rating + result.userRatingChange;
        $scope.correct = result.correct;
        $scope.answered = true;
        $scope.yourAnswer = answer;

      }).error(function(err) {
        alert("There was a problem");
      });
    };

  });
