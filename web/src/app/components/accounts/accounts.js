angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account, $sessionStorage) {
  Account.query(function(data) {
    $scope.accountList = data;
  });


}