angular
.module('app')
.controller('AgentsController', AgentsController)

function AgentsController($scope, $rootScope, Agent) {
  Agent.query(function(data) {
      $scope.agentList = data;
  });

  console.log($scope);
  Account.get({account_id: $sessionStorage.uid}, function(data) {
    $scope.account = data;
  });

  $scope.editAgentInfo = function(agent) {
    Agent.update({ agent_id:agent.agent_id }, agent).$promise.then(function() {
      $('#'+agent.agent_id).collapse('hide');
      $rootScope.$broadcast('setAlertText', "Agent information updated Sucessfully!!");
    });
  };
}
