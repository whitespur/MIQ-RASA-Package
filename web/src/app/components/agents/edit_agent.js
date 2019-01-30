angular
.module('app')
.controller('EditAgentController', EditAgentController)

function EditAgentController($rootScope,$scope, Agent, Intents, Entities,AgentEntities, Actions, AgentActions,ActionResponses, Response) {
  Agent.get({agent_id: $scope.$routeParams.agent_id}, function(data) {
      $scope.agent = data;
      $scope.storiesList = [];
      parseStories(data.story_details);
  });
  $scope.submenu = false;
  $scope.quickView_text = 'Quick View';
  Intents.query({agent_id: $scope.$routeParams.agent_id}, function(data) {
    var obj = {};
    var idToName = {}
      for(var i in data[0]) {
        var name = data[0][i].intent_name;
        var id = data[0][i].intent_id;

        data[0][i]['response_count'] = 0;
        data[0][i]['expression_count'] = 0;

        if(name && name !== undefined) {
          obj[name] = data[0][i];
          idToName[id] = name;
        }
      }

      for(var i in data[1]) {
        var id = data[1][i].intent_id;
        var name = idToName[id];
        if(obj[name] !== undefined) {
          var res_id = data[1][i].response_id;
          if(obj[name]['responses'] === undefined) {
            obj[name]['responses'] = {};
          }
          obj[name]['responses'][res_id] = data[1][i];
          obj[name]['response_count']++;
        }
      }

      for(var i in data[2]) {
        var id = data[2][i].intent_id;
        var name = idToName[id];
        if(name !== undefined && obj[name] !== undefined) {
          var ex_id = data[2][i].expression_id;
          if(obj[name]['expressions'] === undefined) {
            obj[name]['expressions'] = {};
          }
          obj[name]['expressions'][ex_id] = data[2][i];
          obj[name]['expression_count']++;
        }
      }
      console.log(obj);
      $scope.intentList = obj;
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
    form.agent_id = agent.sagent_id;
    form.action_name = form.action_name_prefix+form.action_name;
    Actions.save(form).$promise.then(function(resp) {
      $('#modal-add-actions').modal('hide');
      $scope.form={};
      AgentActions.query({agent_id: agent.agent_id},function(data) {
          $scope.actionsList = data;
      });
    });
  }
  
  $scope.searchField = function() {
    Intents.query({agent_id:$scope.$routeParams.agent_id , search: $scope.formData.searchText}, function(data) {
      $scope.intentList = data[0];
      console.log(data);
    });
  }

  $scope.showMenu = function(id, $event) {
    console.log($event);
    if($scope.SubmenuVar == id) {
      $scope.SubmenuVar = id;
      $event.currentTarget.innerText = 'Quickview';
    } else {
      $scope.SubmenuVar = id;
      $event.currentTarget.innerText = 'Close Quickview';
    }
    
  }
}
