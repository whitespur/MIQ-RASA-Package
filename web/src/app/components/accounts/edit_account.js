angular
.module('app')
.controller('AccountsController', AccountsController)

function AccountsController($scope, $rootScope, Account) {
  console.log($scope.$routeParams.account_id);
  Account.get({account_id: $scope.$routeParams.account_id}, function(data) {
    console.log(data);
      $scope.account = data;
  });
}