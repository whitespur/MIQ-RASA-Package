angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account) {
  Account.query(function(data) {
    if(data.username !== undefined) {
      data = data;
    }

    $scope.accountList = data;
  });
}