let modInfo = {
	name: "The StarRail Tree",
	id: "starrailmod",
	author: "phi.1001301",
	pointsName: "SR Fragments",
	modFiles: ["layers.js", "tree.js"],

	discordName: "作者的B站账号",
	discordLink: "http://space.bilibili.com/1269046117",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.0",
	name: "Pre-Beta",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1.0 Pre-Beta</h3><br>
		- Rebalanced.<br>		- Add 3 levels.<br>		- Add some milestones, upgrades and buyables.<br>
	<h3>v0.0.2 Mid-Alpha</h3><br>
		- Add PHM level.<br>		- Add a challenge, two milestones and some upgrades.<br>
	<h3>v0.0.1 Early Alpha</h3><br>
		- Add 2 levels.`

let winText = `你现在通关了！`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
  if ((!hasUpgrade('Inf',12)) && player.points.gte(new Decimal("1.7977e308"))) return false
  return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('p', 11)) gain = gain.times(100)
	if (hasUpgrade('p', 13)) gain = gain.times(upgradeEffect('p', 13))
	if (hasUpgrade('p', 15)) gain = gain.times(upgradeEffect('p', 15))
	if (hasUpgrade('c', 11)) gain = gain.times(25)
	if (hasUpgrade('c', 13)) gain = gain.mul(upgradeEffect('c', 13))
	if (hasMilestone('ph',0)) gain = gain.mul(2)
	if (hasUpgrade('Inf',221)) gain = gain.mul(3)
	if (hasUpgrade('Inf',11)) gain = gain.mul(2)
	if (clickableEffect('j', 11).gte(1)) gain = gain.times(clickableEffect('j', 11));
	if (hasUpgrade('c', 12)) gain = gain.pow(1.6)
	if (inChallenge('c', 11)) gain = gain.pow(0.5)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade('j', 161)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}