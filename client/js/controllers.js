'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.find();
    $scope.orderProp = 'age';
    $scope.$on('$destroy', function() {
      $scope.phones && $scope.phones.$stop();
    });
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.findOne({id: $routeParams.phoneId});

    $scope.$watch('phone', function(phone) {
      $scope.mainImageUrl = phone.images && phone.images[0];
    }, true);

    $scope.$on('$destroy', function() {
      $scope.phone.$stop();
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
