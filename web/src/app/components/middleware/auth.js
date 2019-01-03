angular
.module('app')
.controller('AuthController', AuthController)

function AuthController($scope, Account) {
  console.log($scope);
  console.log(Account);
}
