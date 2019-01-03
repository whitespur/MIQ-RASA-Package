angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope) {
  console.log($rootScope);
  console.log($scope.$routeParams);

  Account.query(function(data) {
      $scope.accountList = data;
  });
}