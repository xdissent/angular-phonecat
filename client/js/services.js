'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['meteorResource']);

phonecatServices.factory('Phone', ['meteorResource',
  function(meteorResource){
    return meteorResource(Phones);
  }]);
