'use strict';

describe('Directive: changeLabel', function () {

  // load the directive's module
  beforeEach(module('mathtempoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<change-label></change-label>');
    element = $compile(element)(scope);
  }));
});
