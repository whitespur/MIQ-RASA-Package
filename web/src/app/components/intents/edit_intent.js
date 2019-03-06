angular
.module('app')
.controller('EditIntentController', EditIntentController)

function EditIntentController($rootScope, $scope, Agent, AgentEntities, Intent, Expressions, Expression, Parameter, Parameters, Entities, UniqueIntentEntities,Responses, Response, IntentTags, Bind, $sce, $compile ) {
  Agent.get({agent_id: $scope.$routeParams.agent_id}, function(data) {
      $scope.agent = data;
  });

  $scope.updating = false;

  $scope.active_tag = '0';
  $scope.last_tag = '';
  $scope.tagsInNames = '';
  $scope.new_tag = '';
  $scope.default_textarea_text = 'Insert your text block data here';
  $scope.is_response_focus = false;
  $scope.text_selected = null;

  AgentEntities.query({agent_id: $scope.$routeParams.agent_id},function(data) {
      $scope.entityList = data;
  });

  IntentTags.query(function(data) {
      $scope.tagList = data;
      $scope.tagList.unshift({
        tag_id: 'create',
        category_name: 'Create New',
      });
  });

  Bind.query({intent_id: $scope.$routeParams.intent_id},function(data) {
      angular.forEach(data, function(value) {
          $scope.tagsInNames = $scope.tagsInNames + '<span>' + value.category_name + '<div ng-click="removeTag($event)" data-name="' + value.category_name + '" class="close removeTag">x</div></span>';
        });
  });

  Intent.get({intent_id: $scope.$routeParams.intent_id}, function(data) {
      $scope.intent = data;
  });

  $scope.removeTag = function(ev) {
    console.log(ev);
    console.log('<span>' + ev.currentTarget.attributes.nodeValue + '<div ng-click="removeTag($event)" class="close removeTag">x</div></span>');
    console.log($scope.tagsInNames);
      $scope.tagsInNames = $scope.tagsInNames.replace('<span>' + ev.currentTarget.attributes.nodeValue + '<div ng-click="removeTag($event)" class="close removeTag">x</div></span>', '');
  }


  loadExpressions();
  loadResponses();
  loadUniqueIntentEntities();

  function loadExpressions() {
    Expressions.query({intent_id: $scope.$routeParams.intent_id}, function(data) {
        $scope.expressionList = data;
        loadParameters();
      });
  }
  function loadResponses(){
    Responses.query({intent_id: $scope.$routeParams.intent_id}, function(data) {
        $scope.responses = data;
    });
  }
  $scope.saveNewResponse = function(event){
    this.formData.intent_id = $scope.$routeParams.intent_id;
    this.formData.response_type = 1;//DEFAULT type
    this.formData.response_text = this.formData.response_text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    Response.save(this.formData).$promise.then(function(resp) {
      //update list
      loadResponses();
      //empty formData
      $scope.formData = {};
    });
  }

  $scope.deleteResponse = function(response_id) {
    Response.remove({response_id: response_id}).$promise.then(function(resp) {
      loadResponses();
    });
  }

  $scope.onTagChange = function(event) {
    console.log($scope.active_tag);
    if($scope.active_tag === 'create' && $scope.active_tag !== $scope.last_tag) {
      $scope.last_tag = $scope.active_tag;
    } else if($scope.tagList[$scope.active_tag] !== undefined && $scope.active_tag !== 'create'  && $scope.active_tag !== $scope.last_tag && $scope.active_tag !== '0') {
      if($scope.tagsInNames.indexOf($scope.tagList[$scope.active_tag].category_name) !== -1) {
        $scope.tagsInNames = $scope.tagsInNames.replace('<span>' + $scope.tagList[$scope.active_tag].category_name + '</span>', '');
      } else {
        Bind.save({intent_id:$scope.$routeParams.intent_id, tag_id:$scope.active_tag}).$promise.then(function(resp) {
          $scope.tagsInNames = $scope.tagsInNames + '<span>' + $scope.tagList[$scope.active_tag].category_name + '</span>';
        });
      }
      $scope.last_tag = $scope.active_tag;
    } else {
      $scope.last_tag = $scope.active_tag;
    }
  }

  $scope.closeNewTag = function() {
    $scope.last_tag = '0';
    $scope.active_tag = '0';
  }

  $scope.acceptNewTag = function() {
    if($scope.new_tag.length > 0) {
      IntentTags.save({cat_name: $scope.new_tag}).$promise.then(function(resp) {
        $scope.tagsInNames = $scope.tagsInNames + '<span>' + $scope.new_tag + '</span>';
        IntentTags.query(function(data) {
            $scope.tagList = data;
            $scope.tagList.unshift({
              tag_id: 'create',
              category_name: 'Create New',
            });
        });

        $scope.last_tag = '0';
        $scope.active_tag = '0';
        $scope.new_tag = '';
      });
    } else {
      alert('A tag need a name..');
    }
  }

  $scope.showTextTaskbar = function(ev) {
    var el = $(ev.currentTarget);

    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if(text !== '') {
      $scope.text_selected = text;
      $scope.link_target = el;
    }
  }

  function showTextTaskbar(e) {
    $scope.showTextTaskbar(e);
  }

  $scope.hideTextTaskbar = function(ev) {
    if(text !== '') {
      $scope.text_selected = null;
    }
  }

  $scope.addLink = function(ev) {
    if($scope.text_selected !== null) {
      var el = $scope.link_target;
      var url = prompt('Insert the page you wish to link to in the field below.').replace('http://', '').replace('https://', '');
      var html = '<a target="_blank" href="//' + url.trim() + '">' + $scope.text_selected.trim() + '</a>';
      el.html(escapeHtml(el.html().replace($scope.text_selected, html)));
      $scope.text_selected = null;
    } else {
      //TODO: Error Handling
      return false;
    }
  }

var saveIntentBtn = $('.ui-intent-save');
var IntentTextBlockContainer = '';
$('#response_text').on('focus', function() {
  var el = $(this);
  startBlockView(el);
});

function startBlockView(el, data) {
  var value = el.val();
  var parent = el.parent();
  $scope.is_response_focus = true;
  el.attr('disabled', true);
  el.fadeOut(150);
  saveIntentBtn.fadeOut(150);
  $('<p class="small-notify-text">All blocks symbolises a text section in the chatbot.</p>').insertBefore(el);
  $('[ng-show="is_response_focus"]').removeClass('ng-hide');
  if(IntentTextBlockContainer == '') {
    $('<div class="text-block-container"></div>').insertBefore(el);
    IntentTextBlockContainer = parent.find('.text-block-container');
  } else {
    IntentTextBlockContainer.find('div').remove();
  }
  
  if(data != undefined) {
    var blocks = data.match(/<block>(.*?)<\/block>/g);
  } else {
    var blocks = value.match(/<block>(.*?)<\/block>/g);
  }

  $.each(blocks, function(i,v) {
    if(v == '' && i == 0) {
      v = $scope.default_textarea_text;
    } else if(v == '') {
      return false;
    }
    parent.find('.text-block-container').append($compile("<div class='single-block'><div class='innerTaskbar'><a onclick='$(this).parent().parent().remove()'>X</a></div><div class='textblock' ng-mouseup='showTextTaskbar($event)' contentEditable='true'>" + escapeHtml(v) + "</div></div>")($scope));
  })
}

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

function unescapeHtml(safe) {
  return safe
       .replace("&amp;", /&/g)
       .replace("&lt;", /</g)
       .replace( "&gt;", />/g)
       .replace("&quot;", /"/g)
       .replace("&#039;", /'/g);
}


$scope.addTextSection = function(e) {
  IntentTextBlockContainer.append('<div class="single-block"><div class="innerTaskbar"><a onclick="$(this).parent().parent().remove()">X</a></div><div class="textblock" contentEditable="true" ng-click="showTextTaskbar($event)" >' + $scope.default_textarea_text + '</div></div>')
  IntentTextBlockContainer.find('.single-block:last-child').trigger('click');
}

$scope.saveIntentResponseBlocks = function(e) {
  var el = $('.text-block-container');
  var blocks = el.find('.single-block');
  var html = '';
  var notifyText = $('.small-notify-text');
  var textbar = $('#response_text');
  blocks.each(function(i,v) {
    if($(this).find('div.textblock').html() !== $scope.default_textarea_text) {
      html += '<block>' + $(this).find('div.textblock').text() + '</block>';
    }
  })

  IntentTextBlockContainer.fadeOut(150);
  $('[ng-show="is_response_focus"]').addClass('ng-hide');
  textbar.attr('disabled', false);
  textbar.fadeIn(150);
  saveIntentBtn.fadeIn(150);
  notifyText.remove();
  el.remove();
  $scope.is_response_focus = false;
  IntentTextBlockContainer = '';
  if($scope.updating !== false) {
    $($scope.updating[0]).html(html);
    $scope.updating = false;
    Response.update({response_id: $scope.response_id}, {response_id: $scope.response_id, response_text: html}).$promise.then(function() {
      loadResponses();
    });
  } else {
    this.formData.response_text = html;
  }
}

$scope.closeIntentResponseBlocks = function(e) {
  var el = $('.text-block-container');
  var blocks = el.find('.single-block');
  var html = '';
  var notifyText = $('.small-notify-text');
  var textbar = $('#response_text');

  IntentTextBlockContainer.fadeOut(150);
  $('[ng-show="is_response_focus"]').addClass('ng-hide');
  textbar.attr('disabled', false);
  textbar.fadeIn(150);
  saveIntentBtn.fadeIn(150);
  notifyText.remove();
  el.remove();
  $scope.is_response_focus = false;
  IntentTextBlockContainer = '';
  if($scope.updating !== false) {
    $scope.updating = false;
  }
}

  $scope.updateIntentNameAndWebhook = function(intent) {
    Intent.update({ intent_id:intent.intent_id }, intent).$promise.then(function() {
      $rootScope.$broadcast('setAlertText', "Intent information updated Sucessfully!!");
    });
  }

  $scope.runExpression = function(expression_text) {
    $rootScope.$broadcast('executeTestRequest', expression_text);
  }

  $scope.deleteIntent = function() {
    Intent.remove({intent_id: $scope.$routeParams.intent_id}).$promise.then(function(resp) {
      $scope.go('/agent/' + $scope.$routeParams.agent_id);
    });
  };

  function highlight (str, word) {
    str = str.replace(word, '<span style="padding: 3px; background-color: ' + pastelColors() + '">' + word + '</span>');
    return str;
  }

  $scope.toggleArrow = function(expression_id) {
    if ($('#table_expression_' + expression_id).hasClass('show')) {
      $('#icon_expression_' + expression_id).removeClass('icon-arrow-up').addClass('icon-arrow-down')
    } else {
      $('#icon_expression_' + expression_id).removeClass('icon-arrow-down').addClass('icon-arrow-up')
    }
  }

  function loadUniqueIntentEntities() {
    UniqueIntentEntities.query({intent_id: $scope.$routeParams.intent_id},function(data) {
      $scope.intentEntityList = data;
    });
  }

  $scope.editExpression = function(expression_id) {
    var span = $('#expression_' + expression_id);
    var body = $('body');
    span.parent().parent().addClass('active');
    body.addClass('editing');
    span.attr('contentEditable', 'true').focus();
  }

  function turnToInput(el) {
    el.hide();
    var text = el.html();
    $('<textarea class="editing_textarea" style="width:100%;"></textarea>').insertAfter(el);
    $('.editing_textarea').innerHTML(text);
  }

  function turnToSpan(el) {
    var text = $('#response_text').val();
    el.html($.parseHTML(text)).show();
    return text;
  }

  $scope.doUpdateExpression = function(expression_id) {
    var span = $('#expression_' + expression_id);
    var body = $('body');
    span.parent().parent().removeClass('active');
    body.removeClass('editing');
    span.attr('contentEditable', 'false');
    Expression.update({expression_id: expression_id}, {expression_id: expression_id, expression_highlighted_text: span.text().trim()}).$promise.then(function() {
      loadExpressions();
    });
  }

  $scope.editResponse = function(expression_id) {
    var span = $('#response_' + expression_id);
    $scope.updating = span;
    $scope.response_id = expression_id;
    startBlockView($('#response_text'), span[0].innerHTML);
  }

  $scope.doUpdateResponse = function(response_id) {
    var span = $('#response_' + response_id);
    var body = $('body');
    span.parent().removeClass('active');
    body.removeClass('editing');
    span.attr('contentEditable', 'false');
    var text = turnToSpan(span);
    Response.update({response_id: response_id}, {response_id: response_id, response_text: text.trim()}).$promise.then(function() {
      loadResponses();
    });
  }


  function loadParameters() {
    Parameters.query({intent_id: $scope.$routeParams.intent_id},function(data) {
        $scope.parameterList = data;
        $scope.parameterFilterList = data;
        //Loop through each parameter and highlight the words it is for
        for (var z = 0; z <= $scope.expressionList.length; z++) {
          if ($scope.expressionList[z] !== undefined) {
            var text = $scope.expressionList[z].expression_text;
            for (var i = 0; i <= data.length - 1; i++) {
              if ($scope.expressionList[z].expression_id === data[i].expression_id) {
                text = highlight(text, data[i].parameter_value);
              }
            }
            $scope.expressionList[z].expression_highlighted_text = text;
          }
        }
      });
  }
  $scope.addParameter = function(expression_id) {
    var selectedText = window.getSelection().toString();
    if (selectedText !== "") {
      var expressionText = $('#expression_' + expression_id).text();
      var newObj = {};
      newObj.expression_id = expression_id;
      newObj.parameter_start = expressionText.indexOf(selectedText);
      newObj.parameter_end = newObj.parameter_start + selectedText.length;
      newObj.parameter_value = selectedText;
      Parameter.save(newObj).$promise.then(function() {
        loadExpressions();
      });

      //Make sure parameter table is open
      $('#table_expression_' + expression_id).addClass("show");
    }
  }

  $scope.deleteParameter = function(parameter_id) {
    Parameter.remove({parameter_id: parameter_id}).$promise.then(function() {
      loadExpressions();
    });
  }

  $scope.addExpression = function() {
    var newObj = {};
    newObj.intent_id = $scope.$routeParams.intent_id;
    newObj.expression_text = this.expression_text;

    Expression.save(newObj).$promise.then(function() {
      $scope.expression_text = '';
      loadExpressions();
    });
  }

  $scope.updateParameterEntity = function(param_id, entity_id) {
    Parameter.update({parameter_id: param_id}, {parameter_id: param_id, entity_id: entity_id}).$promise.then(function() {
      loadUniqueIntentEntities();
    });
  }

  $scope.deleteExpression = function(expression_id) {
    Expression.remove({expression_id: expression_id}).$promise.then(function() {
      loadExpressions();
    });
  }


}
