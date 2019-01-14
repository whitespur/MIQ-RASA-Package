angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account) {
  Account.query(function(data) {
  console.log(data);

    $scope.accountList = data;
  });
}