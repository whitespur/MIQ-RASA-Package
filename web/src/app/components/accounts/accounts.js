angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Agent) {
  console.log($scope);
  Account.query(function(data) {
    console.log(data);
      $scope.accountList = data;
  });
}