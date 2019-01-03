angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account) {
  Account.get(function(data) {
      $scope.accountList = data;
  });
}