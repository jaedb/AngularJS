'use strict';

angular.module('spotmop.browse.album', [
    'ngRoute'
])

.config(function($routeProvider) {
    $routeProvider.when("/browse/album/:uri", {
        templateUrl: "app/browse/album/template.html",
        controller: "AlbumController"
    });
})

.controller('AlbumController', function AlbumController( $scope, SpotifyService, $routeParams ){
	
	$scope.album = {};
	$scope.tracks = {};
	$scope.totalTime = 0;
	
	// get the artist
	SpotifyService.getAlbum( $routeParams.uri )
		.success(function( response ) {
			$scope.album = response;
			$scope.tracks = response.tracks;
			
			// figure out the total time for all tracks
			var totalTime = 0;
			$.each( $scope.tracks.items, function( key, track ){
				totalTime += track.duration_ms;
			});	
			$scope.totalTime = Math.round(totalTime / 10000);
		})
		.error(function( error ){
			$scope.status = 'Unable to load new releases';
		});
});