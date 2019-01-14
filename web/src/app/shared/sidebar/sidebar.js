angular
.module('app')
.controller('SideBarController', SideBarController)

function SideBarController($scope,Navigation, Account,$sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    Account.get({account_id: $sessionStorage.uid}, function(data) {
        $scope.account = data;
        Navigation.get({level: $scope.account.level}, function(response) {
            $scope.nav_links = response;
        });
    });


}
