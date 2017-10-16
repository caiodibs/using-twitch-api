(function(){
	const app = angular.module('appStreaming', []);
	// Allowed URLs
	app.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			'https://wind-bow.gomix.me/twitch-api/**'
		]);
	});
	// Controller functions
	app.controller('ctrlStreaming', function($scope, $http) {
		$scope.results = [];
		const streamerList = ["ESL_SC2", "OgamingSC2", "freecodecamp", "copaamerica_pt1", "respeedruns", "protech",];
		const httpRequest = "https://wind-bow.gomix.me/twitch-api/";
		// Call twitch's API to see channel information
		streamerList.map(function(channel){
			$http.jsonp(httpRequest + "channels/" + channel, {callback:"callback"})
				.then(function(dataChannel) {
				if (dataChannel.data._id){
					// Channel exists
					// Call stream information from twitch's API
					$http.jsonp(httpRequest + "streams/" + channel, {callback:"callback2"})
						.then(function(dataStream) {
						$scope.results.push({
							streamLogo: dataChannel.data.logo,
							streamChannel: dataChannel.data.display_name,
							url: dataChannel.data.url,
							channelDescription: dataStream.data.stream ? dataStream.data.stream.channel.status : "offline",
							classStream: dataStream.data.stream ? "stream-on" : "stream-off"
						});
					});
				}else{
					// Channel closed
					$scope.results.push({
						streamLogo: "https://pbs.twimg.com/profile_images/509073338191183872/fYdty6yd.png",
						streamChannel: "",
						url: "#",
						channelDescription: channel + " account has neen closed.",
						classStream: "stream-off"
					});
				}
			});
		});
	});
})()