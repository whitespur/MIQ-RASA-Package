angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account) {
  Account.get({account_id: $scope.$routeParams.account_id}, function(data) {
    console.log(data);
      $scope.account = data;
  });
}