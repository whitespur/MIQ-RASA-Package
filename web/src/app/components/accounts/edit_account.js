angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account) {
  Account.get({agent_id: $scope.$routeParams.account_id}, function(data) {
      $scope.account = data;
  });
}