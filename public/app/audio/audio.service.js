angular.module('storyface')
		.service('audioService', [
		  '$http',
          function audioService($http){
            this.mainPlayer = null; // player for the current musical track
            this.secondaryPlayer = null; // player for background noises
            const audioPath = "audio/";
						const fadeDuration = 1.0;

            this.play = async function(track, playbackType, loop=false, transition=false, forceRestart=false){
							// Play the selected audio track from the soundtrack
							// @forceRestart : if the track passed as parameter is the same as a track currently playing, restart if true
							// @playbackType : main/secondary/standalone, according to the player that should play the sound
							// @transition : enable fade in transition when starting playback on a paused player. Transitions are always enabled when starting playback on an already playing player
							let t = audioPath + track;
							let player = null;
							if(playbackType == "main"){
								if(this.mainPlayer === null)
								{
									this.mainPlayer = new Audio();
								}
								player = this.mainPlayer;

								if(player.paused){
									// If the player isn't already playing
									player.src = t;
									player.load();
									this.fadeAudio("+", "main");
								}
								else{
									// If the player is already playing a theme ( since it's the main player ) : set up a transition
									// First check if the same track is playing
									if( player.src.split(audioPath)[1] ===  t.split(audioPath)[1] && !forceRestart )
									{
										// Do nothing : the same track is already playing
									}
									else{
										await this.fadeAudio("-", playbackType);
										player.src = t;
										player.load();
										await this.fadeAudio("+", playbackType);
									}
								}
								player.loop = loop;
							}
							else if(playbackType == "secondary"){
								if(this.secondaryPlayer == null)
								{
									this.secondaryPlayer = new Audio();
								}
								player = this.secondaryPlayer;
								player.src = t;
								player.load();
								player.loop = loop;
								player.play();
							}
							else if(playbackType == "standalone"){
								player = new Audio();
								player.load();
								player.src = t;
								player.play();this.mainPlayer.loop = loop;
							}
            }

			this.pause = async function(playbackType){
				// Pause the selected player
				// @playbackType : "main" for this.mainPlayer, "secondary" for this.secondaryPlayer
				if(playbackType == "main" && this.mainPlayer != null && !this.mainPlayer.paused){
					// face out audio
					this.fadeAudio("-", "main");
				}
				else if(playbackType == "secondary" && this.mainPlayer != null){
					// fade out audio
					this.fadeAudio("-", "secondary");
				}
			}

			this.fadeAudio = async function(direction, playbackType){
				// Start an audio transition
				// @direction : "+" to fade in, "-" to fade out
				// @playbackType : "main" or "secondary"
				let player = ( playbackType == "main" ) ? this.mainPlayer : this.secondaryPlayer;

				if(player !== null){
					if(player.paused && direction === "+"){
						player.volume = 0;
						player.play();
					}

					return new Promise((resolve) => {
						let fade = setInterval(function () {
						// If the volume is to be increased and hasn't reached the maximum, or is to be decreased and hasn't reached the minimum
							if ( (direction === "+" ? (player.volume !== 1.0) : (player.volume != 0.0)) ) {
								if( direction === "+" ? (player.volume >= 0.9) : (player.volume <= 0.1) ){
									direction === "+" ? (player.volume = 1 ) : (player.volume = 0)
								}
								else{
									direction === "+" ? (player.volume += 0.1) : (player.volume -= 0.1)
									player.volume = Math.round(player.volume * 10)/10
								}
							}
							// When volume at zero stop all the intervalling
							if ( direction === "+" ? (player.volume === 1.0) : (player.volume === 0.0) ) {
								if( direction === "-"){
									player.pause();
								}
								clearInterval(fade);
								resolve();
							}
					}, fadeDuration * 100);
				});
			 }
			}

			this.playProfileMusic = async function(profile) {
				let music = (await $http({
					url : '/storyface/api/profiles' + '/getProfileMusic',
					method : "GET",
					params : {"id" : profile._id}
				})).data

				if (music) {
					this.play("soundtrack/profiles/" + profile._id + ".mp3", "main", true, true, false);

				} else {
					this.play("soundtrack/main_theme.mp3", "main", true, true, false);
				}
			}
	  }],
);
