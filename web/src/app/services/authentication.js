app.factory('Authentication', function() {
    var permissions = {
        0: 'Not Allowed',
        1: 'Read',
        2: 'ReadExpanded',
        3: 'Write',
        4: 'WriteExpanded',
        5: 'Full'
    };

    var pages = {
        0:'dashboard',
        1:'agents',
        2:'regex',
        3:'training',
        4:'settings',
        5:'insights',
        6:'conversations',
        7:'logs',
        8:'configuration',
        9:'account_center',
        10:'permission_center'
    };

    return {
        onAuthenticate: function(user) {
            // Your authenication logic
            $http.post(api_endpoint_v2 + "/auth/init", JSON.stringify(user))
                .then(
                    function(response){
                    // success callback
                    $sessionStorage.jwt = response.data.token;
                    $cookies.put('loggedinjwt', $sessionStorage.jwt);
                    $rootScope.$broadcast("USER_AUTHENTICATED");
            }, function(errorResponse){
                // failure callback
                $('#alertTextDiv').addClass('show');
                $scope.alert_text = "Invalid Username and Password. Please try again.";
                $timeout(function(){$('#alertTextDiv').removeClass('show')}, 2000);
            }
            );
        },

        onIsAuthenticated: function() {
           if($sessionStorage.jwt !== undefined && $cookies.get('loggedinjwt') !== undefined) {
               return true;
           } else {
                $('#alertTextDiv').addClass('show');
                $scope.alert_text = "User is not logged in..";
                $timeout(function(){$('#alertTextDiv').removeClass('show')}, 2000);
                return false;
           }
        },

        onCanView: function(page_id, user_id, level) {
            //Get permissions from both parts
            var usrPems     = Authentication.requestUserPermission(user_id, this.pages[page_id]),
                pagePems    = this.pagePems;
            
            if(usrPems.level >= level) {
                return pagePems[usrPems.level];
            } else {
                return false;
            }
            
        },

        onDeAuthenticate: function(user_id) {
            return $resource(api_endpoint_v2 + '/auth/logout', {user_id:user_id});
        },

        //Internal Functionalities
        requestUserPermission: function(user_id, page_name) {
            return $resource(api_endpoint_v2 + '/auth/permissions?user_id=:user_id&pagename=:pagename', {user_id:user_id, pagename: page_name});
        },
      }
});