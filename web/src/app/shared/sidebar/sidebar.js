angular
.module('app')
.controller('SideBarController', SideBarController)

function SideBarController($scope,Navigation, Account) {
    Account.get({account_id: $scope.$routeParams.account_id}, function(data) {
        $scope.account = data;
        console.log(data);
  console.log('i was here ctrlside');

        Navigation.get({level: data.level}, function(response) {
  console.log('i was here navstart');

            $scope.nav_links = response;
            console.log(response);        
        });
    });
}
