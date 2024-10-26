addLayer("p", {
    name: "Base Level", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "L1 StarRail Point", // Name of prestige currency
    baseResource: "StarRail Fragment", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 12)) mult = mult.times(5)
        if (hasUpgrade('c', 11)) mult = mult.times(25)
        if (hasUpgrade('c', 21)) mult = mult.times(upgradeEffect('c', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P reset L1", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "General": {
            content: ["main-display",
                "prestige-button", ["display-text",
                    function () { return 'You have ' + format(player.points) + 'SR Fragment' },
                    { "color": "#ffffff", "font-size": "14px", "font-family": "Comic Sans MS" }],"blank","blank",
                "buyables",
                "upgrades",
            ],
        }
    },
    upgrades: {
        11: {
            title: "First Upgrade",
            description: "Multiply SR Fragment to 100",
            cost: new Decimal(1),
            effect() { return 100 },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        12: {
            title: "Second Upgrade",
            description: "Multiply L1 SR Point to 5",
            cost: new Decimal(150),
            effect() { return 5 },
            unlocked() { return (hasUpgrade('p', 11)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        13: {
            title: "Progress so fast",
            description: "Multiply SR Fragment to L1 SR Point^0.3",
            cost: new Decimal(1000),
            effect() { return player.p.points.add(1).pow(0.3).min(new Decimal('1e500')) },
            unlocked() { return (hasUpgrade('p', 12)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        14: {
            title: "New Level",
            description: "Unlock Credits Level",
            cost: new Decimal(10000),
            unlocked() { return (hasUpgrade('p', 13)) },
        },
        15: {
            title: "Multiply Double",
            description: "Multiply SR Fragment to SR Fragment^0.1",
            cost: new Decimal(15000),
            effect() { return player.points.add(1).pow(0.1).min(new Decimal('1e500')) },
            unlocked() { return (hasUpgrade('p', 14)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        21: {
            title: "So Go On",
            description: "Multiply SR Fragment by PHM",
            cost: new Decimal(3e23),
            effect() { return player.ph.points.add(1).pow(2).min(new Decimal('1e500')) },
            unlocked() { return (hasMilestone('ph', 0)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
    },
    layerShown(){return true}
}),
addLayer("c", {
    name: "L2 Credits Level", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked() { return (hasUpgrade('p', 14)) },
            points: new Decimal(0),
        }
    },
    color: "#31CDEF",
    requires: new Decimal(60000), // Can be a function that takes requirement increases into account
    resource: "L2 SR Credits", // Name of prestige currency
    baseResource: "L1 StarRail Point", // Name of resource prestige is based on
    baseAmount() { return player['p'].points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.35, // Prestige currency exponent
    branches() { return ['s'] },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('ph', 11)) mult = mult.times(upgradeEffect('ph', 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "c", description: "C reset L2", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],challenges: {
    11: {
        name: "Herta Space Station I",
        challengeDescription: "SR Fragment on gain ^0.5",
        goalDescription:"1e13 fragments",
        rewardDescription:"Unlock two L2.5 upgrades",
        unlocked(){unlock= false
        if(hasUpgrade('c',21)) unlock=true
          return unlock
        },
        canComplete: function() {return player.points.gte(1e13)},
    },
},
    upgrades: {
        11: {
            title: "First Credits Upgrade",
            description: "Multiply SR Fragment and L1 Point to 25",
            cost: new Decimal(1),
            effect() { return 25 },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },12: {
            title: "It's Very Fast",
            description: "Let SR Fragment gain to the power 1.6",
            cost: new Decimal(20),
            effect() { return 1.6 },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id))  },
        },13: {
            title: "Oh it boosts",
            description: "Multiply Fragment by L2 Credits",
            cost: new Decimal(2500),
            effect() { return player.c.points.add(2).log(2).pow(3) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },14: {
            title: "A New Generation",
            description: "New Level",
            cost: new Decimal(1e7),
        },21: {
            title: "What's the Start?",
            description: "Multiply L1 point by L2 credits, unlock a challenge",
            cost: new Decimal(1e7),
            effect() { return player.c.points.add(2).log(2).pow(2).mul(3) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },22: {
            title: "Start on Herta spacestation",
            description: "Change PHM exponent(1 to 2)",
            cost: new Decimal(1e11),
            effect() { return 2 },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
    },
    layerShown() { return player.c.points.gt(0) || player.c.unlocked() }
}),
addLayer("ph", {
    name: "L2.5 PHM level", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ph", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked() { return (hasUpgrade('c', 14)) },
            points: new Decimal(0),
        }
    },
    type: "static", 
    color: "#DCBA21",
    requires() {req=new Decimal(1e23)
    if(hasUpgrade('ph',12)) req=new Decimal(1e19)
    return req}, // Can be a function that takes requirement increases into account
    resource: "L2.5 SR PHM", // Name of prestige currency
    baseResource: "L1 StarRail Point", // Name of resource prestige is based on
    baseAmount() { return player['p'].points }, // Get the current amount of baseResource
     // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3, // Prestige currency exponent
    branches() { return ['s'] },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        expr = new Decimal(1)
        if(hasUpgrade('c',22)) expr = expr.add(1)
        return expr
    },milestones: {
    0: {
        requirementDescription: "Get 1 PHM",
        effectDescription: "Unlock a L1 upgrade",
        done() { return player.ph.points.gte(1) }
    },
    1: {
        requirementDescription: "Get 2 PHM",
        effectDescription: "Unlock a L2 upgrade",
        unlocked() {return hasMilestone('ph',0)},
        done() { return player.ph.points.gte(2) }
    },
},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "h", description: "H reset L2.5", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {11: {
            title: "",
            description: "Multiply Credits by PHM, unlock a L2 upgrade",
            cost: new Decimal(3),
            effect() { return player.ph.points.add(1).pow(5).div(4).add(0.75).min(new Decimal('1e500')) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },12: {
            title: "",
            description: "PHM require points is 1e19(1e23 formerly)",
            cost: new Decimal(4),
            effect() { return 0.0001 },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        }, 13: {
            title: "",
            description: "Gain 30% L1 on reset per second",
            cost: new Decimal(5),
        },
    },
    layerShown() { return player.ph.points.gt(0) || player.ph.unlocked() }
})