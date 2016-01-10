angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, TopCoderService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
    
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

/** Challenge Detail Controller **/
.controller('settingsCtrl', function($scope, SettingsService) {
  $scope.settings;
  $scope.init = function(){
    $scope.settings = SettingsService.getSettings();
  }
  
  $scope.saveSetting = function(){
    SettingsService.setSettings($scope.settings);
  }
  
  $scope.init();
})

/** Challenge Detail Controller **/
.controller('challengeDetailCtrl', function($scope, $stateParams, $ionicLoading, TopCoderService) {
  $scope.challengeId = $stateParams.challengeId;
  $scope.challenge;
  $scope.challenges = [];
  
  $scope.init = function(){
    $ionicLoading.show();
    if($scope.challenges[$scope.challengeId] == null ){
      TopCoderService.getChallengeDetail($scope.challengeId, function(data){
        $scope.challenge = data;
        $scope.challenges[$scope.challengeId] = data; 
        console.log(data);
        $ionicLoading.hide();
      });
    }else{
      $scope.challenge = $scope.challenges[$scope.challengeId];
      $ionicLoading.hide();
    }
    
  }
  
  $scope.init();
})

/** Challange list Ctrl **/
.controller('challengelistCtrl', function($scope, $ionicLoading, $localstorage, TopCoderService, SettingsService) {
  $scope.chellenges = [];
  $scope.isLoading = false;
  $scope.settings = null
  $scope.init = function(){
    $scope.settings = SettingsService.getSettings();
    var cachedChallenges = $localstorage.getObject('challenges');
    if(cachedChallenges != null  && cachedChallenges != undefined && cachedChallenges.data != undefined){
      $scope.chellenges = cachedChallenges.data.data;
      console.log('loading challenges from localstorage.')
      $scope.isLoading = true;
    }else{
      $ionicLoading.show();
    }  
      TopCoderService.getChallenges(function(data){
        console.log(data);
        $scope.chellenges = data.data.data;
        $localstorage.setObject('challenges', data);
        $ionicLoading.hide();
        $scope.isLoading = false;
      });
    
  }
  
  $scope.init();
})

.filter('challengeType', function() {
  return function(challenges, Settings){
    if(Settings.FilterTypes.length != undefined){
      
        var filtered = [];
        for(var i = 0; i < challenges.length; i++){
          var challenge = challenges[i];
        for(var j =0; j < Settings.FilterTypes.length; j++){
          var  setting = Settings.FilterTypes[j];
          if( challenge.challengeType == setting.type && setting.show == true ){
              filtered.push( challenge );
            }
          }
        }
    }

    return filtered;
  }
});

