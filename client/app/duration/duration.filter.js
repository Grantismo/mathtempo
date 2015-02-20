'use strict';

angular.module('mathtempoApp')
  .filter('duration', function () {
    return function (input) {
      return moment.duration(input).format("hh:mm:ss", {
        trim: false
      });
    };
  });
