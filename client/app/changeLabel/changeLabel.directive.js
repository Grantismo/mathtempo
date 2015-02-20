'use strict';

angular.module('mathtempoApp')
  .directive('changeLabel', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var val = attrs.changeLabel;
        var text = val > 0 ? '+' + val : val;
        element.text(text);
        element.addClass('label');
        element.addClass(val > 0 ? 'label-success' : 'label-default');
      }
    };
  });
