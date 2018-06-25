module.exports = {
	apps	: [{
		"name"	: "Storyface",
		"script"	: "./app.js",
		"watch"	: ["app.js", "config", "public", "routes", "utilities"],
		"ignore_watch" : ["public"],
		"watch_options": {
        "usePolling": true
    }
  }]
}
