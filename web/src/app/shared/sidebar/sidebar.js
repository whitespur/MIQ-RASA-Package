angular
.module('app')
.controller('SideBarController', SideBarController)

function SideBarController(Navigation, Account) {
    Account.get({account_id: $scope.$routeParams.account_id}, function(data) {
        $scope.account = data;
        Navigation.get({level: data.level}, function(response) {
            $scope.nav_links = response;
        });
    });
}
