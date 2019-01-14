angular
.module('app')
.controller('SideBarController', SideBarController)

function SideBarController($scope,$http, Account) {
    Account.get({account_id: $scope.$routeParams.account_id}, function(data) {
        $scope.account = data;
        console.log(data);
  console.log('i was here ctrlside');
        $http({method: 'GET', url: api_endpoint_v2 + '/navigation/' + data.level}).then(
            function(response){
  console.log('i was here navstart');
  $scope.nav_links = response;

            },
            function(errorResponse){
            console.log("Error Message while Getting Messages." + errorResponse);
            });

      
    });
}
