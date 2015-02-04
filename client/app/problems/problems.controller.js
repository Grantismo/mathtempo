'use strict';

angular.module('mathtempoApp')
  .controller('ProblemsCtrl', function ($scope, $http) {
    $scope.problems = []; 
    $http.get('/api/problems').success(function(problems){
      $scope.problems = problems;
    });
  }).controller('ProblemCtrl', function($scope, $stateParams, $http, Auth) {
    $scope.user = Auth.getCurrentUser();
    $scope.answered = false;

    $scope.problem = {};
    $http.get('/api/problems/' + $stateParams.id).success(function(problem){
      $scope.problem = problem;
    });

    $scope.submitAnswer = function(answer){
      $http.post('/api/problems/' + $stateParams.id + "/answer", {answer: answer}).success(function(result){

        $scope.userRatingChange = result.userRatingChange;
        $scope.user.rating = $scope.user.rating + result.userRatingChange;
        $scope.correct = result.correct;
        $scope.answered = true;
        $scope.yourAnswer = answer;

      }).error(function(err){
        alert("There was a problem");
      });
    };

  });
