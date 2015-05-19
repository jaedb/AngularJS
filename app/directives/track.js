'use strict';

angular.module('spotmop.directives.track', [
    "spotmop.services.settings",
    "spotmop.services.mopidy",
    "spotmop.services.spotify"
])

.directive('spotmopTrack', function spotmopTrack($routeParams, $rootScope, SettingsService, MopidyService, SpotifyService) {

    return {
        restrict: 'E',
        scope: {
            track: '=',
            type: "=",
            surrounding: "=?",
            currentPlayingTrack: "=currentplayingtrack"
        },
        transclude: true,
        templateUrl: '/app/directives/track.template.html',
        link: function(scope, element, attrs){
			
			function randomString(length) {
				return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
			}
			
			// get the track from the parent scope
			scope.track = scope.$parent.track;
            scope.selected = false;
            scope.visible = true;
			scope.guid = randomString(32);
			
            var uri = $routeParams.uri;
			
			// if we're a nested track.track (as in playlists), un-nest
			if( typeof(scope.track.track) !== 'undefined' )
				scope.track = scope.track.track;
			
            // Copy so we have raw tracks again (otherwise mopidy will crash)
            var track = angular.copy(scope.track);
			
			// if we haven't got a selected tracks container, set one up
			if( typeof($rootScope.selectedTracks) === 'undefined' )
				$rootScope.selectedTracks = [];

				
            /**
             * Select a track
             */
            scope.selectTrack = function( event ){
				
				// ctrl key held
				if(event.ctrlKey === true){
					$rootScope.selectedTracks.push( scope.guid );
					
				// shift key held
				}else if( event.shiftKey === true ){
					$rootScope.selectedTracks.push( scope.guid );
					
					// TODO: figure out how to select between items
					// tried jquery, but we lose the scope.selected binding if we bypass the directive
					
				// no keys held, just a plain click, so let's throw out any previously selected items
				}else{
					$rootScope.selectedTracks = [ scope.guid ];
				}
				
				console.log( $rootScope.selectedTracks );
            };

            /**
             * Watch the rootscope.selectedtracks for changes
             * and check if the current track guid is still selected
             **/
			scope.$watch(
				function() {
					return $rootScope.selectedTracks;
				},
				function() {
					if( $.inArray( scope.guid, $rootScope.selectedTracks) >= 0 )
						scope.selected = true;
					else 
						scope.selected = false;
				},
				true
			);

            /*
             * Play the track            
             */
            scope.play = function( event ){
				console.log('play me!');
              /*  var clickedindex = 0;
                var surroundinguris = [];

                *
                 * Check if this is the only selected track and play it
                 
                if($rootScope.selectedtracks.length === 1){
                    if(track.__model__ == "Track"){
                        MopidyService.playTrack(track, scope.surrounding);    
                    }
                    else{
                        _.each(scope.surrounding, function(iTrack, index){
                            if(track.uri == iTrack.uri){
                                clickedindex = index;
                                return;
                            }
                        });

                        // Play the clicked and surrounding tracks
                        MopidyService.playTrack(scope.surrounding[clickedindex], scope.surrounding);
                    }    
                }
                else{
                    // Check if all the tracks are Mopidy tracks
                    var reject = _.reject($rootScope.selectedtracks, function(track){
                        return track.__model__ == "Track";
                    });

                    // If the reject array is empty we can directly parse the tracks to mopidy
                    // Otherwise we have to convert them to Mopidy tracks and parse them
                    if(reject.length === 0){
                        MopidyService.playTrack(track, $rootScope.selectedtracks);
                    }
                    else{
                        _.each($rootScope.selectedtracks, function(iTrack, index){
                            if(track.uri == iTrack.uri){
                                clickedindex = index;
                                return;
                            }
                        });

                        // Play the clicked and surrounding tracks
                        MopidyService.playTrack($rootScope.selectedtracks[clickedindex], $rootScope.selectedtracks);
                    }
                }                */
            };
            
            scope.startStation = function(){
//                stationservice.startFromSpotifyUri(scope.track.uri);
            };

            /**
             * Add selected tracks in the queue
             */
            scope.addToQueue = function(){
                MopidyService.addToTracklist({ tracks: $rootScope.selectedtracks }).then(function(response){
                    // Broadcast event
                    $rootScope.$broadcast("mopidy:event:tracklistChanged", {});
                });
            };

            /**
             * Remove the track from the tracklist
             * @param  {track} track
             */
            scope.removeFromQueue = function(){
				/*
                var uris = _.map($rootScope.selectedtracks, function(track){
                    return track.uri;
                });

                // Remove from tracklist
                MopidyService.removeFromTracklist({ uri: uris });

                // Hide tracks
                scope.visible = false;

                // Broadcast event
                $rootScope.$broadcast("mopidy:event:tracklistChanged", {});*/
            };

            /*
             * Remove track from the playlist
             */
            scope.removeFromPlaylist = function(){
               /* var playlistid = uri.split(":")[4];
                    
                var uris = _.map($rootScope.selectedtracks, function(track){
                    return track.uri;
                });

                // Remove track
                PlaylistManager.removeTrack(playlistid, uris).then(function(response){
                    scope.visible = false;
                    notifier.notify({type: "custom", template: "Track removed from playlist.", delay: 3000});
                }, function(){
                    notifier.notify({type: "custom", template: "Can't remove track. Are you connected with Spotify and the owner if this playlist?", delay: 5000});
                });*/
            };

            /**
             * Show the select playlist modal
             */
            scope.showPlaylists = function(){
               /* // Open the playlist select modal
                var modalInstance = $modal.open({
                    templateUrl: 'modals/playlistselect.tmpl.html',
                    controller: 'PlaylistSelectModalController',
                    size: 'lg'
                });

                // Add to playlist on result
                modalInstance.result.then(function (selectedplaylist) {
                    // Get playlist id from uri
                    var playlistid = selectedplaylist.split(":")[4];

                    var uris = _.map($rootScope.selectedtracks, function(track){
                        return track.uri;
                    });

                    // add track
                    PlaylistManager.addTrack(playlistid, uris).then(function(response){
                        notifier.notify({type: "custom", template: "Track(s) succesfully added to playlist.", delay: 3000});
                    }, function(){
                        notifier.notify({type: "custom", template: "Can't add track(s). Are you connected with Spotify and the owner if this playlist?", delay: 5000});
                    });
                });*/
            };

            /*
             * Save or remove the track to/from the user's library
             */
            scope.toggleSaveTrack = function(){
               /* if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){

                    if(scope.trackAlreadySaved){
                        // Remove
                        Spotify.removeUserTracks(scope.track.uri).then(function (data) {
                            notifier.notify({type: "custom", template: "Track succesfully removed.", delay: 5000});   
                            scope.visible = false;

                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });
                    }
                    else{
                        // Save
                        Spotify.saveUserTracks(scope.track.uri).then(function (data) {
                            notifier.notify({type: "custom", template: "Track succesfully saved.", delay: 5000});   
                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });   
                    }

                }
                else{
                    notifier.notify({type: "custom", template: "Can't add track. Are you connected with Spotify?", delay: 5000});   
                }*/
            };

            /**
             * On context show callback checks if the user is following the current track
             * @return {[type]} [description]
             */
            scope.onContextShow = function(){
                if($rootScope.selectedtracks.length > 1){
                    $rootScope.showSaveTrack = false;
                    return;
                }

                if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){
                    Spotify.userTracksContains(scope.track.uri).then(function (following) {
                        scope.trackAlreadySaved = following[0];
                    });

                    scope.showSaveTrack = true;
                }
                else{
                    scope.showSaveTrack = false;
                }

                /**
                 * Check if the current scope is already selected, otherwise clear the previous selected tracks
                 */
                if(!scope.selected){
                    $rootScope.selectedtracks = [track];
                }

                if($rootScope.selectedtracks.length > 1)
                    scope.multipleselected = true;
                else
                    scope.multipleselected = false;
            };

            /**
             * Remove selected on context menu close
             */
            scope.onContextClose = function(){
                if($rootScope.selectedtracks.length === 1)
                    scope.selected = false;
            };

        }
    };

});