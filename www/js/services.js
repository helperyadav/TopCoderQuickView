angular.module('starter.services', [])
	
	.factory('$localstorage', function($window) {
	return {
		set: function(key, value) {
		$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
		return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
		$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
		return ($window.localStorage[key]!=undefined) ? JSON.parse($window.localStorage[key]) : undefined;
		}
	}
	})

	.service('TopCoderService', function ($http) {
		
		var Data = {
			challenges : [],
			cachedChallenges : [],
			ChallengeIdDetailMap : []
		}
		
        // Service functionality goes here
		console.log('service loaded;');
		return{
			getCachedChallenges : function(){
				return Data.cachedChallenges;
			},
			
			getChallenges : function(callback){
				if(Data.challenges.length == 0 ){
					 
					$http.get("https://api.topcoder.com/v2/challenges").then(function(response){
							Data.challenges = response;
							callback(Data.challenges);
					});
					
				}else{
					callback(Data.challenges);
				}
		
			},
			
			getChallengeDetail: function(ChallengeId, callback){
				$http.get("https://api.topcoder.com/v2/challenges/" + ChallengeId ).then(function(response){
						if( Data.ChallengeIdDetailMap[ChallengeId] == null ){
							Data.ChallengeIdDetailMap[ChallengeId] = response.data;
							callback(Data.ChallengeIdDetailMap[ChallengeId]);
						}else{
							callback(Data.ChallengeIdDetailMap[ChallengeId]);
						}
						
				});
			},
			
			print: function(){
				console.log('service loaded again;');
			}
		}
    })
	
	.service('SettingsService', function ($localstorage) {
		var settings = null;
		return{
			getSettings : function(){
				settings = $localstorage.getObject("Settings");
				if(settings == null || settings == undefined){
					settings = {
						FilterTypes : [
										{'type' : 'Code', 'show': true}, 
										{'type' : 'First2Finish', 'show' : false},
										{'type' : 'Web Design', 'show' : false}
									]
					};
					$localstorage.setObject("Settings", settings);
				}
				return settings;
			},
			
			setSettings : function(Changesettings){
				settings = Changesettings
				$localstorage.setObject("Settings", settings);
			}
		}
	})