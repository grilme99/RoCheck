/**
 * SECURITY MODULE
 *
 * This module is used to validate that a request is really from Roblox.
 * It uses a bot cookie to "fake" a join request to a game and then
 * returns the IP address of the game server.
 *
 * This module should NOT be used for validating a request and should
 * only return the IP of the game server. The script using this module
 * should compare the IP.
 */

/**
 * Module dependencies
 */
const request = require('request-promise') // Used to make HTTP requests

/**
 * Makes bot (with supplied cookie) initialize a join request to the game,
 * then returns the IP of the game server.
 *
 * @author grilme99
 * @param {Number} placeId
 * @param {String} jobId
 * @param {String} cookie
 * @return {String}
 * @api public
 */
module.exports = async (placeId, jobId, cookie) => {
	/**
	 * Initialize the join request. Receives "joinScriptUrl" which will
	 * reutrn lots of information about the game if successful.
	 */
	const initial_request = await request({
		uri: `https://assetgame.roblox.com/Game/PlaceLauncher.ashx?request=RequestGameJob&placeId=${placeId}&gameId=${jobId}`,
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
			Referer: `https://www.roblox.com/games/${placeId}/`,
			Origin: 'https://www.roblox.com',
			Cookie: `.ROBLOSECURITY=${cookie}; path=/; domain=.roblox.com;`
		},
		json: true // Automatically parses the JSON string in the response
	})
		.then(response => {
			return response
		})
		.catch(error => {
			throw Error(error)
		})

	/**
	 * Check if "joinScriptUrl" was returned
	 */
	if (initial_request && initial_request.joinScriptUrl) {
		/**
		 * Use the "joinScriptUrl" to get information about the game,
		 * including the game server IP (MachineAddress)
		 */
		const game_data = await request({
			uri: initial_request.joinScriptUrl,
			json: true
		})
			.then(response => {
				return response
			})
			.catch(error => {
				throw Error(error)
			})

		console.log(game_data)
	} else {
		throw Error('Error on initial request to Roblox')
	}
}
