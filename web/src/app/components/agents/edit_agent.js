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

  $scope.setDefaultCallback = function(agent, text) {
    Agent.update({ agent_id:agent.agent_id }, agent).$promise.then(function(response) {
        $rootScope.$broadcast('setAlertText', "Default fallback updated!!");
    });
  }
  $scope.combineToAgent = function(id, agent) {
    var current = [];
    var dl = false;
    if(agent.combined_to !== null && agent.combined_to !== '' && agent.combined_to.indexOf(',') != -1) {
      var string = '';
      var current = agent.combined_to.split(',');
      for(var i = 0; i < current.length; i++) {
        if(current[i] != id) {
          string += current[i] + ',';
        } else if(current[i] == id) {
          dl = true;
        }
      }

      if(dl === true) {
        var string = string.replace(/(^,)|(,$)/g, "");
        agent.combined_to = string;
      } else {
        agent.combined_to = string + id;
      }
    } else if(agent.combined_to !== null && agent.combined_to !== '' && agent.combined_to.indexOf(',') == -1) {
      if(agent.combined_to == id) {
        agent.combined_to = null;
        dl = true;
      } else {
        agent.combined_to += ',' + id;
      }
    } else {
      agent.combined_to = "" + id + "";
    }

    if(dl === false) {
      Agent.update({ agent_id:$scope.$routeParams.agent_id }, agent).$promise.then(function() {
          $('.agent_' + id).addClass('combined');
          $rootScope.$broadcast('setAlertText', "Combined!!");
      });
    } else {
      Agent.update({ agent_id:$scope.$routeParams.agent_id }, agent).$promise.then(function() {
        $('.agent_' + id).removeClass('combined');
        $rootScope.$broadcast('setAlertText', "Agent Combination Removed!!");
    });
    }

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
