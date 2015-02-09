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

    var baseUrl = '/api/problems/' + $stateParams.id;

    $scope.problem = {};
    $http.get(baseUrl).success(function(problem){
      $scope.problem = problem;
    });

    $scope.addComment = function(content){
      $http.post(baseUrl + "/comment", {content: content}).success(function(problem){
        $scope.problem = problem;

      }).error(function(err){
        alert("Error adding comment");
      });
    };

    $scope.submitAnswer = function(answer){
      $http.post(baseUrl + "/answer", {answer: answer}).success(function(result){

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
