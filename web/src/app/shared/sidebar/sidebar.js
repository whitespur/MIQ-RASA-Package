angular
.module('app')
.controller('SideBarController', SideBarController)

function SideBarController($scope,Navigation, $http,Account,$sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $http({method: 'GET', url: api_endpoint_v2 + '/accounts/'+$sessionStorage.uid}).then(
        function(data){
        $scope.account = data;
            $http({method: 'GET', url: api_endpoint_v2 + '/navigation/'+response.level}).then(
                function(response){
                    console.log(response);
                    $scope.nav_links = response;
                },
                function(errorResponse){
                }
              );
        },
        function(errorResponse){
        }
      );
}
