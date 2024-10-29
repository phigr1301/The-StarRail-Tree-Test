addLayer("p", {
    name: "Base Level", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#CD12EF",
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
        if (hasUpgrade('j', 11)) mult = mult.times(upgradeEffect('j', 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        mult = new Decimal(0)
        if (hasUpgrade('ph', 13))
            mult = new Decimal(0.3);
        if (hasUpgrade('p', 22))
            mult = new Decimal(1.5);
        return mult
    },
    autoUpgrade() {
        upg = false
        if (hasUpgrade('ph', 14)) upg = true
        return upg
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P reset L1", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
        22: {
            title: "",
            description: "Auto gain changes(30% to 150%)",
            cost: new Decimal(1e34),
            unlocked() { return (hasUpgrade('ph', 14)) },
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
    requires: new Decimal(40000), // Can be a function that takes requirement increases into account
    resource: "L2 SR Credits", // Name of prestige currency
    baseResource: "L1 StarRail Point", // Name of resource prestige is based on
    baseAmount() { return player['p'].points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.35, // Prestige currency exponent
    branches() { return ['p'] },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasMilestone('ph',2)) mult = mult.times(1.3) ;
        if (hasUpgrade('ph', 11)) mult = mult.times(upgradeEffect('ph', 11));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        mult = new Decimal(0)
        if (hasUpgrade('c', 23))
            mult = new Decimal(0.1);
        return mult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "c", description: "C reset L2", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],challenges: {
    11: {
        name: "Herta Space Station I",
        challengeDescription: "SR Fragment on gain ^0.5",
        goalDescription:"1e13 fragments",
        rewardDescription:"Unlock four L2.5 upgrades",
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
            unlocked() { return (hasUpgrade('c', 11)) },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id))  },
        },13: {
            title: "Oh it boosts",
            description: "Multiply Fragment by L2 Credits",
            cost: new Decimal(2500),
            effect() { return player.c.points.add(2).log(2).pow(3) },
            unlocked() { return (hasUpgrade('c', 12)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },14: {
            title: "A New Generation",
            description: "New Level",
            cost: new Decimal(1e7),
            unlocked() { return (hasUpgrade('c', 13)) },
        },21: {
            title: "What's the Start?",
            description: "Multiply L1 point by L2 credits, unlock a challenge",
            cost: new Decimal(1e7),
            effect() { return player.c.points.add(2).log(2).pow(2).mul(3) },
            unlocked() { return (hasMilestone('ph', 1)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },22: {
            title: "Start on Herta spacestation",
            description: "Change PHM exponent(1 to 2)",
            cost: new Decimal(1e11),
            effect() { return 2 },
            unlocked() { return (hasUpgrade('ph', 11)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },23: {
            title: "Mainline on it",
            description: "Gain 10% L2 on reset per second",
            cost: new Decimal(1e13),
            unlocked() { return (hasUpgrade('c', 22)) },
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
    exponent: 2, // Prestige currency exponent
    branches() { return ['p'] },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        expr = new Decimal(1)
        if(hasUpgrade('c',22)) expr = expr.add(1)
        return expr
    },canBuyMax(){return hasUpgrade('Inf',11)},milestones: {
    0: {
        requirementDescription: "Get 1 PHM",
        effectDescription: "Unlock a L1 upgrade, let points gain 2x",
        done() { return player.ph.points.gte(1) }
    },
    1: {
        requirementDescription: "Get 2 PHM",
        effectDescription: "Unlock a L2 upgrade",
        unlocked() {return hasMilestone('ph',0)},
        done() { return player.ph.points.gte(2) }
    },
    2: {
        requirementDescription: "Get 3 PHM",
        effectDescription: "let L2 gain 1.5x",
        unlocked() {return hasMilestone('ph',1)},
        done() { return player.ph.points.gte(3) }
     },
},
     row: 1, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [
         { key: "h", description: "H reset L2.5", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
     ],
     upgrades: {11: {
             title: "",
             description: "Multiply Credits by PHM, unlock a L2 upgrade",
         cost: new Decimal(4),
         unlocked() { return (hasChallenge('c', 11)) },
             effect() { return player.ph.points.add(1).pow(5).div(4).add(0.75).min(new Decimal('1e500')) },
             effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         },12: {
             title: "",
             description: "PHM require points is 1e19(1e23 formerly)",
             cost: new Decimal(5),
         effect() { return 0.0001 },
         unlocked() { return (hasUpgrade('ph', 11)) },
             effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         }, 13: {
             title: "",
         description: "Gain 30% L1 on reset per second",
         unlocked() { return (hasUpgrade('ph', 12)) },
             cost: new Decimal(6),
         }, 14: {
             title: "",
         description: "Autobuy L1 upgrade",
         unlocked() { return (hasUpgrade('ph', 13)) },
             cost: new Decimal(8),
         }, 15: {
             title: "The Next Level",
             description: "Unlock L3",
             unlocked() { return (hasUpgrade('ph', 14)) },
             cost: new Decimal(10),
         },
     },
     layerShown() { return player.ph.points.gt(0) || player.ph.unlocked() }
}),
addLayer("j", {
     name: "L3 Stellarjade", // This is optional, only used in a few places, If absent it just uses the layer id.
     symbol: "J", // This appears on the layer's node. Default is the id with the first letter capitalized
     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
     startData() {
         return {
             unlocked() { return (hasUpgrade('ph', 15)) },
             points: new Decimal(0),
         }
     },
     color: "#EA8512",
     requires: new Decimal(1.5e16), // Can be a function that takes requirement increases into account
     resource: "L3 Stellarjade", // Name of prestige currency
     baseResource: "L2 Credits", // Name of resource prestige is based on
     baseAmount() { return player['c'].points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.22, // Prestige currency exponent
     branches() { return ['c'] },
     gainMult() { // Calculate the multiplier for main currency from bonuses
         mult = new Decimal(1)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
     },
     passiveGeneration() {
         mult = new Decimal(0)
         return mult
     },
     row: 2, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [
         { key: "j", description: "J reset L3", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
     ], challenges: {
     },
     upgrades: {
        11: {
             title: "Stellar Jades",
             description: "Multiply L1 gain by L3",
             cost: new Decimal(1),
            effect() { return player.j.points.add(1).pow(0.25).mul(2).sub(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         },
        161: {
             title: "通关游戏",
             description: "你现在可以通关！",
             cost: new Decimal("e1e35"),
         },
     },
     layerShown() { return player.j.points.gt(0) || player.j.unlocked() }
}),
addLayer("Placeholder0", {
     name: "Placeholder", // This is optional, only used in a few places, If absent it just uses the layer id.
     symbol: "AAA", // This appears on the layer's node. Default is the id with the first letter capitalized
     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
     startData() {
         return {
             unlocked() { return true },
             points: new Decimal(0),
         }
     },
     color: "#CC6600",
     requires: new Decimal("1.7976e308"), // Can be a function that takes requirement increases into account
     resource: "Infinity points", // Name of prestige currency
     baseResource: "SR Fragment", // Name of resource prestige is based on
     baseAmount() { return player.points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.1, // Prestige currency exponent
     branches() { return ['QQ'] },
     gainMult() { // Calculate the multiplier for main currency from bonuses
         mult = new Decimal(1)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
     },
     passiveGeneration() {
         mult = new Decimal(0)
         return mult
     },
     row: 96, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [], challenges: {
     },
     upgrades: {
     },
     layerShown() { return false }
}),
addLayer("Placeholder1", {
     name: "Placeholder", // This is optional, only used in a few places, If absent it just uses the layer id.
     symbol: "AAA", // This appears on the layer's node. Default is the id with the first letter capitalized
     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
     startData() {
         return {
             unlocked() { return true },
             points: new Decimal(0),
         }
     },
     color: "#CC6600",
     requires: new Decimal("1.7976e308"), // Can be a function that takes requirement increases into account
     resource: "Infinity points", // Name of prestige currency
     baseResource: "SR Fragment", // Name of resource prestige is based on
     baseAmount() { return player.points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.1, // Prestige currency exponent
     branches() { return ['QQ'] },
     gainMult() { // Calculate the multiplier for main currency from bonuses
         mult = new Decimal(1)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
     },
     passiveGeneration() {
         mult = new Decimal(0)
         return mult
     },
     row: 97, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [], challenges: {
     },
     upgrades: {
     },
     layerShown() { return false }
}),
addLayer("Placeholder2", {
     name: "Placeholder", // This is optional, only used in a few places, If absent it just uses the layer id.
     symbol: "AAA", // This appears on the layer's node. Default is the id with the first letter capitalized
     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
     startData() {
         return {
             unlocked() { return true },
             points: new Decimal(0),
         }
     },
     color: "#CC6600",
     requires: new Decimal("1.7976e308"), // Can be a function that takes requirement increases into account
     resource: "Infinity points", // Name of prestige currency
     baseResource: "SR Fragment", // Name of resource prestige is based on
     baseAmount() { return player.points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.1, // Prestige currency exponent
     branches() { return ['QQ'] },
     gainMult() { // Calculate the multiplier for main currency from bonuses
         mult = new Decimal(1)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
     },
     passiveGeneration() {
         mult = new Decimal(0)
         return mult
     },
     row: 98, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [], challenges: {
     },
     upgrades: {
     },
     layerShown() { return false }
}),
addLayer("Placeholder3", {
     name: "Placeholder", // This is optional, only used in a few places, If absent it just uses the layer id.
     symbol: "AAA", // This appears on the layer's node. Default is the id with the first letter capitalized
     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
     startData() {
         return {
             unlocked() { return true },
             points: new Decimal(0),
         }
     },
     color: "#CC6600",
     requires: new Decimal("1.7976e308"), // Can be a function that takes requirement increases into account
     resource: "Infinity points", // Name of prestige currency
     baseResource: "SR Fragment", // Name of resource prestige is based on
     baseAmount() { return player.points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.1, // Prestige currency exponent
     branches() { return ['QQ'] },
     gainMult() { // Calculate the multiplier for main currency from bonuses
         mult = new Decimal(1)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
     },
     passiveGeneration() {
         mult = new Decimal(0)
         return mult
     },
     row: 100, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [], challenges: {
     },
     upgrades: {
     },
     layerShown() { return false }
}),
addLayer("Inf", {
     name: "Infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
     symbol: "Inf", // This appears on the layer's node. Default is the id with the first letter capitalized
     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
     startData() {
         return {
             unlocked() { return true },
             points: new Decimal(0),
         }
     },
     color: "#CC6600",
     requires: new Decimal("1.7976e308"), // Can be a function that takes requirement increases into account
     resource: "Infinity points", // Name of prestige currency
     baseResource: "SR Fragment", // Name of resource prestige is based on
     baseAmount() { return player.points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.1, // Prestige currency exponent
     branches() { return ['Etr'] },
     gainMult() { // Calculate the multiplier for main currency from bonuses
         mult = new Decimal(1)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
     },
     passiveGeneration() {
         mult = new Decimal(0)
         return mult
     },
     row: 99, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [], challenges: {
     },
     upgrades: {
        11: {
             title: "无限增益",
             description: "然而并没有效果...吗？",
             unlocked() { return (player.j.points.gte(1)) },
             cost: new Decimal(0),
         },
     },
     layerShown() { return true }
}),
addLayer("Etr", {
     name: "Eternity", // This is optional, only used in a few places, If absent it just uses the layer id.
     symbol: "Etr", // This appears on the layer's node. Default is the id with the first letter capitalized
     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
     startData() {
         return {
             unlocked() { return true },
             points: new Decimal(0),
         }
     },
     color: "#660066",
     requires: new Decimal("1.7976e308"), // Can be a function that takes requirement increases into account
     resource: "Eternity Points", // Name of prestige currency
     baseResource: "Infinity Points", // Name of resource prestige is based on
     baseAmount() { return player['Inf'].points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.1, // Prestige currency exponent
     branches() { return ['Inf'] },
     gainMult() { // Calculate the multiplier for main currency from bonuses
         mult = new Decimal(1)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
     },
     passiveGeneration() {
         mult = new Decimal(0)
         return mult
     },
     row: 101, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [], challenges: {
     },
     upgrades: {
     },
     layerShown() { return true }
})