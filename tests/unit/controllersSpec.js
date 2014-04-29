'use strict';

/* jasmine specs for controllers go here */
describe('PhoneCat controllers', function() {

  var rerun, result;

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });

    result = [];
    spyOn(Phones, 'find').andCallFake(function() {
      return {fetch: function() { return result; }};
    });
    spyOn(Deps, 'autorun').andCallFake(function(fn) {
      rerun = function() { fn({stop: function() {}}); };
      rerun();
    });
  });

  beforeEach(module('phonecatApp'));
  beforeEach(module('phonecatServices'));

  describe('PhoneListCtrl', function(){
    var scope, ctrl, $timeout;

    beforeEach(inject(function(_$timeout_, $rootScope, $controller) {
      $timeout = _$timeout_;
      scope = $rootScope.$new();
      ctrl = $controller('PhoneListCtrl', {$scope: scope});
    }));


    it('should create "phones" model with 2 phones fetched from xhr', function() {
      expect(scope.phones).toEqualData([]);

      result = [{name: 'Nexus S'}, {name: 'Motorola DROID'}];
      rerun();
      $timeout.flush();

      expect(scope.phones).toEqualData(
          [{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });


    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('age');
    });
  });


  describe('PhoneDetailCtrl', function(){
    var scope, $timeout, ctrl,
        xyzPhoneData = function() {
          return {
            name: 'phone xyz',
                images: ['image/url1.png', 'image/url2.png']
          }
        };


    beforeEach(inject(function(_$timeout_, $rootScope, $routeParams, $controller) {
      $timeout = _$timeout_;
      $routeParams.phoneId = 'xyz';
      scope = $rootScope.$new();
      ctrl = $controller('PhoneDetailCtrl', {$scope: scope});
    }));


    it('should fetch phone detail', function() {
      expect(scope.phone).toEqualData({});

      result = [xyzPhoneData()];
      rerun();
      $timeout.flush();

      expect(scope.phone).toEqualData(xyzPhoneData());
    });
  });
});
