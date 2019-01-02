angular
.module('app')
.controller('EditAgentController', EditAgentController)

function EditAgentController($rootScope,$scope, Agent, Intents, Entities,AgentEntities, Actions, AgentActions,ActionResponses, Response) {
  Agent.get({agent_id: $scope.$routeParams.agent_id}, function(data) {
      $scope.agent = data;
      $scope.storiesList = [];
      parseStories(data.story_details);
  });

  Intents.query({agent_id: $scope.$routeParams.agent_id}, function(data) {
      $scope.intentList = data;
  });

  AgentEntities.query({agent_id: $scope.$routeParams.agent_id},function(data) {
      $scope.entitiesList = data;
  });

  AgentActions.query({agent_id: $scope.$routeParams.agent_id},function(data) {
      $scope.actionsList = data;
  });

  Agent.query(function(data) {
    $scope.agentList = data;
  });

  function parseStories(story_details){
    if(angular.isUndefined(story_details) || story_details === null) return;
    var lines = story_details.split("\n");

    for(var i=0; i<lines.length;i++){
      var currentLine = lines[i];
      if(currentLine.startsWith("##")){
        $scope.storiesList.push(currentLine.substring(2,currentLine.length));
      }
  }
}

  $scope.deleteAgent = function() {
    Agent.remove({agent_id: $scope.$routeParams.agent_id}).$promise.then(function(resp) {
      $scope.go('/agents');
    });
  };

  $scope.combineToAgent = function(id, agent) {
    var current = [];
    if(agent.combined_to != null) {
      var string = '';
      var current = agent.combined_to.split(',');
      for(var i = 0; i < current.length(); i++) {
        string += current[i] + ',';
      }
      string.substr(0, myString.length-1)
      agent.combined_to = string;
    } else {
      agent.combined_to = '2,4';
    }
    Agent.update({ agent_id:$scope.$routeParams.agent_id }, agent).$promise.then(function() {
      $rootScope.$broadcast('setAlertText', "Combined!!");
    });
  };
  $scope.addAction = function(form, agent) {
    form.agent_id = agent.agent_id;
    form.action_name = form.action_name_prefix+form.action_name;
    Actions.save(form).$promise.then(function(resp) {
      $('#modal-add-actions').modal('hide');
      $scope.form={};
      AgentActions.query({agent_id: agent.agent_id},function(data) {
          $scope.actionsList = data;
      });
    });
  }
}
