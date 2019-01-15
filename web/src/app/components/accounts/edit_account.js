angular
.module('app')
.controller('EditAccountController', EditAccountController)

function EditAccountController($scope, $rootScope, Account, $sessionStorage) {
  Account.get({account_id: $scope.$routeParams.account_id}, function(data) {
      $scope.account = data;
  });
}