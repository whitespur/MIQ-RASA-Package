angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope) {
  console.log($rootScope);

  Account.query(function(data) {
      $scope.accountList = data;
  });
}