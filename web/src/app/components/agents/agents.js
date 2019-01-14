angular
.module('app')
.controller('AgentsController', AgentsController)

function AgentsController($scope, Account, $rootScope, Agent,$sessionStorage) {
  Agent.query(function(data) {
      $scope.agentList = data;
  });

  Account.get({account_id: $sessionStorage.uid}, function(data) {
    $scope.account = data;
    $scope.user = (data.level < 3 ? 'hide' : 'show');

  });

  $scope.editAgentInfo = function(agent) {
    Agent.update({ agent_id:agent.agent_id }, agent).$promise.then(function() {
      $('#'+agent.agent_id).collapse('hide');
      $rootScope.$broadcast('setAlertText', "Agent information updated Sucessfully!!");
    });
  };
}
