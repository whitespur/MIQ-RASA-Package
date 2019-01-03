angular
.module('app')
.controller('AccountsController', SettingsController)

function SettingsController($scope) {
  console.log($scope);
  Account.query(function(data) {
    console.log(data);
      $scope.accountList = data;
  });
}