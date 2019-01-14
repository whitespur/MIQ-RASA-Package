angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account) {
  console.log(Account);
  Account.query(function(data) {
    $scope.accountList = data;
  });
}