angular
.module('app')
.controller('SettingsController', SettingsController)

function SettingsController($scope) {
  console.log($scope);
  Account.query(function(data) {
    console.log(data);
      $scope.accountList = data;
  });
}