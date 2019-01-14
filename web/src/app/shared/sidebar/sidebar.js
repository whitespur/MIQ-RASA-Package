angular
.module('app')
.controller('SideBarController', SideBarController)

function SideBarController($scope,Navigation, Account,$sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    Account.get({account_id: $sessionStorage.uid}, function(data) {
        $scope.account = data;
        console.log(data);
            console.log('i was here LinksLevel');

        Navigation.get({level: data.level}, function(response) {
            $scope.nav_links = response;
            console.log(response);        
        });
    });
}
