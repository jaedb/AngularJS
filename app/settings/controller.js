'use strict';

angular.module('spotmop.settings', [
    'ngRoute'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/settings", {
        templateUrl: "app/settings/template.html",
        controller: "SettingsController"
    });
})
	
.controller('SettingsController', function SettingsController( $scope, $rootScope, MopidyService, SpotifyService, SettingsService ){
	
	// load our current settings into the template
	$scope.version;
	$scope.settings = SettingsService.getSettings();
	/*
	$scope.mopidyOnline = MopidyService.isConnected;
	$scope.spotifyOnline = true;	// TODO: Figure out how to handle online/offline state
	
	*/
	
	SettingsService.getVersion()
		.success( function(response){
			$scope.version = response;
		});
	
	// save the fields to the localStorage
	// this is fired when an input field is blurred
	$scope.saveField = function( event ){
		SettingsService.setSetting( $(event.target).attr('name'), $(event.target).val() );
	};
	
});