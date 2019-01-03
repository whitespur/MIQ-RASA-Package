angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Agent) {
  Account.query(function(data) {
      $scope.accountList = data;
  });


}