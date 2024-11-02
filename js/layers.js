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
        if (hasUpgrade('j', 12)) mult = mult.times(35)
        if (hasUpgrade('ch', 22)) mult = mult.times(upgradeEffect('ch', 22))
        if (hasUpgrade('ch', 23)) mult = mult.times(upgradeEffect('ch', 23))
        if (hasUpgrade('Inf', 11)) mult = mult.times(2)
        if (hasUpgrade('ch', 12)) mult = mult.pow(1.12)
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
        if (hasMilestone('j', 0)) upg = true
        return upg
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P reset L1", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = []
            if (hasMilestone('j', 3) && (resettingLayer == "j" || (hasMilestone('ch', 1) && resettingLayer == "ch"))) kept.push("upgrades")
            if(hasMilestone('j',4)&&resettingLayer == "ph") kept.push("points")
            layerDataReset(this.layer, kept)
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
        if (buyableEffect('j', 11).gte(1)) mult = mult.times(buyableEffect('j', 11));
        if (hasUpgrade('j', 14)) mult = mult.times(upgradeEffect('j', 14));
        if (hasUpgrade('ch', 24)) mult = mult.times("1e14");
        if (hasUpgrade('Inf', 11)) mult = mult.times(2);
        if (hasUpgrade('ch', 13)) mult = mult.pow(1.08);
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
    autoUpgrade() {
        upg = false
        if (hasMilestone('j', 1)) upg = true
        return upg
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "c", description: "C reset L2", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = []
            if (hasMilestone('j', 3) && (resettingLayer == "j" || (hasMilestone('ch', 1) && resettingLayer == "ch"))) kept.push("upgrades")
            if (hasMilestone('j', 4) && (resettingLayer == "j" || (hasMilestone('ch', 1) && resettingLayer == "ch"))) kept.push("challenges")
            layerDataReset(this.layer, kept)
        }
    },challenges: {
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
    branches() { return ['p','c'] },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        expr = new Decimal(1)
        if(hasUpgrade('c',22)) expr = expr.add(1)
        return expr
    },canBuyMax(){return hasUpgrade('Inf',221)},
    autoUpgrade() {
        upg = false
        if (hasMilestone('j', 2)) upg = true
        return upg
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = []
            if (hasMilestone('j', 3) && (resettingLayer == "j" || (hasMilestone('ch', 1) && resettingLayer == "ch"))) kept.push("milestones")
            if (hasMilestone('j', 4) && (resettingLayer == "j" || (hasMilestone('ch', 1) && resettingLayer == "ch"))) kept.push("upgrades")
            if (hasMilestone('j', 5) && (resettingLayer == "j" || (hasMilestone('ch', 1) && resettingLayer == "ch"))) kept.push("points")
            layerDataReset(this.layer, kept)
        }
    },milestones: {
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
             gachaRand: new Decimal(0),
             gachaEff: new Decimal(1),
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
         if (hasUpgrade('j', 13)) mult = mult.times(upgradeEffect('j', 13))
         if (hasUpgrade('j', 21)) mult = mult.times(upgradeEffect('j', 21))
         if (hasUpgrade('ch', 21)) mult = mult.times(upgradeEffect('ch', 21))
         if (hasUpgrade('Inf', 11)) mult = mult.times(2)
         if (hasUpgrade('ch', 14)) mult = mult.pow(1.06)
         return mult
     },
     gainExp() { // Calculate the exponent on main currency from bonuses
         return new Decimal(1)
    },
    passiveGeneration() {
        mult = new Decimal(0)
        if (hasMilestone('ch', 0))
            mult = new Decimal(0.25);
        return mult
    },
     row: 2, // Row the layer is in on the tree (0 is the first row)
     hotkeys: [
         { key: "j", description: "J reset L3", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
     ], challenges: {
     },milestones: {
    0: {
        requirementDescription: "Get 1 Stellar Jade",
        effectDescription: "Autobuy L1 upgrade",
        done() { return player.j.points.gte(1) }
    },
    1: {
        requirementDescription: "Get 3 Stellar Jades",
        effectDescription: "Autobuy L2 upgrade",
        unlocked() {return true},
        done() { return player.j.points.gte(3) }
    },
    2: {
        requirementDescription: "Get 5 Stellar Jades",
        effectDescription: "Autobuy L2.5 upgrade",
        unlocked() {return true},
        done() { return player.j.points.gte(5) }
    },
    3: {
        requirementDescription: "Get 9 Stellar Jades",
        effectDescription: "Unlock Stellar Jade Buyables, keep L1&L2 upgrades and L2.5 milestones on L3 reset",
        unlocked() {return true},
        done() { return player.j.points.gte(9) }
    },
    4: {
        requirementDescription: "Get 18 Stellar Jades",
        effectDescription: "keep L2.5 upgrades&L2 challenges on L3 reset, keep L1 points on L2.5 reset",
        unlocked() {return true},
        done() { return player.j.points.gte(18) }
    },
    5: {
        requirementDescription: "Get 33 Stellar Jades",
        effectDescription: "keep PHM on L3 reset",
        unlocked() {return true},
        done() { return player.j.points.gte(33) }
    },
    6: {
        requirementDescription: "Get 160 Stellar Jades",
        effectDescription: "Unlock 抽卡",
        unlocked() {return true},
        done() { return player.j.points.gte(160) }
    },},buyables: {
    11: {
        title(){ return "L2 gain upgrade"},
            cost(x) { req = new Decimal(7).mul(x.add(1)).mul(x.add(1)).sub(4); if (req.gte(50000)) req = req.mul(20).sub(950000); if (req.gte(25000000)) req = req.pow(1.5).sub(1.24975e11); if (x.gte(500)) return new Decimal("(e^1e30)10"); return req; },
        display() { return "Multiply L2 gain by (1+buys)^2 \nNow:" + format(buyableEffect(this.layer, this.id)) + "x\nCost:" + format(this.cost()) + " Stellar Jades" },
        unlocked() { return hasMilestone('j', 3) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
            effect(x) { eff = new Decimal(1).mul(x.add(1)).mul(x.add(1)); if (x.gte(431)) eff = eff.div(185761).pow(3).mul(185761); return eff}
    },},
     clickables:{
     11: {
      title() {return "进行抽卡！"},
      display() {return "消耗160星琼，随机获得1-5.5倍的碎片获取加成。\n当前：" + format(clickableEffect(this.layer, this.id)) + "x"},
             canClick() { return player.j.points.gte(160) && player.j.gachaEff.lt(1e72)},
      unlocked() { return hasMilestone('j', 6) },
      effect() {return player.j.gachaEff},
             onClick() { player.j.points = player.j.points.sub(160); player.j.gachaRand = new Decimal(Math.random()).times(450).floor().add(1).mul(0.01).add(1); player.j.gachaEff = player.j.gachaEff.add(player.j.gachaRand);if(player.j.gachaEff.gte("1e72")) player.j.gachaEff=new Decimal("1.00e72")},
    },
     12: {
      title() {return "十连抽！"},
      display() {return "抽卡10次！需要1600星琼"},
         canClick() { return player.j.points.gte(1600) && player.j.gachaEff.lt(1e72)},
      unlocked() { return hasMilestone('j', 6) },
         onClick() { player.j.points = player.j.points.sub(1600); player.j.gachaRand = new Decimal(Math.random()).times(4500).floor().add(1).mul(0.01).add(10); player.j.gachaEff = player.j.gachaEff.add(player.j.gachaRand); if (player.j.gachaEff.gte("1e72")) player.j.gachaEff = new Decimal("1.00e72")},
    },
     13: {
      title() {return "使用一半星琼抽卡！"},
      display() {return "使用自己拥有的一半星琼抽卡！"},
      canClick() {return player.j.points.gte(320)&&player.j.gachaEff.lt(1e72)},
      unlocked() { return hasMilestone('j', 6) },
         onClick() { player.j.gachaRand = new Decimal(Math.random()).times(player.j.points.mul(0.5).mul(0.00625).add(0.000001).floor().mul(450)).floor().add(1).mul(0.01).add(player.j.points.mul(0.5).mul(0.00625).add(0.000001).floor()); player.j.gachaEff = player.j.gachaEff.add(player.j.gachaRand); player.j.points = player.j.points.sub(player.j.points.mul(0.5).mul(0.00625).add(0.000001).floor().mul(160)); if (player.j.gachaEff.gte("1e72")) player.j.gachaEff = new Decimal("1.00e72")},
    },},
     upgrades: {
        11: {
             title: "Stellar Jades",
             description: "Multiply L1 gain by L3",
             cost: new Decimal(1),
            effect() { return player.j.points.add(1).pow(0.25).mul(2).sub(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         },
        12: {
             title: "So What it is?",
             description: "Multiply L1 gain by 35",
             cost: new Decimal(3),
            effect() { return new Decimal(35) },
            unlocked() { return (hasUpgrade('j', 11)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         },
        13: {
             title: "",
             description: "Multiply L3 gain by sqrt(Buyable 1 Effect)",
             cost: new Decimal(350),
            effect() { return buyableEffect('j', 11).pow(0.5) },
            unlocked() { return (hasUpgrade('j', 12)) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         },
         14: {
             title: "",
             description: "PHM upgrade 11 effect ^2.5",
             cost: new Decimal(3333),
             effect() { return upgradeEffect('ph', 11).pow(1.5) },
             unlocked() { return (hasUpgrade('j', 13)) },
             effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         },
         15: {
             title: "Unlock Next Level",
             description: "",
             unlocked() { return (hasUpgrade('j', 14)) },
             cost: new Decimal(2e9),
         },
         21: {
             title: "",
             description: "L3 upgrade 13 effect ^1.35",
             cost: new Decimal(1e11),
             effect() { return upgradeEffect('j', 13).pow(0.35) },
             effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
         },
         22: {
             title: "",
             description: "Extense L3.5 Softcap",
             unlocked() { return (hasUpgrade('j', 21)) },
             cost: new Decimal(6e13),
         },
         23: {
             title: "",
             description: "Extense L3.5 Softcap 2",
             unlocked() { return (hasUpgrade('j', 22)) },
             cost: new Decimal(8e38),
         },
        161: {
             title: "通关游戏",
             description: "你现在可以通关！",
             cost: new Decimal("e1e35"),
         },
     },
     layerShown() { return player.j.points.gt(0) || player.j.unlocked() }
}),
    addLayer("ch", {
        name: "L3.5 Characters", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "Ch", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() {
            return {
                unlocked() { return (hasUpgrade('j', 15)) },
                points: new Decimal(0),
            }
        },
        type: "static",
        color: "#12EF56",
        requires() {
            req = new Decimal(1e9)
            return req
        }, // Can be a function that takes requirement increases into account
        resource: "Characters", // Name of prestige currency
        baseResource: "L3 Stellarjade", // Name of resource prestige is based on
        baseAmount() { return player['j'].points }, // Get the current amount of baseResource
        // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 1, // Prestige currency exponent
        branches() { return ['j','c'] },
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            expr = new Decimal(1)
            if (player.ch.points.gte(2)) expr = expr.sub(0.5)
            if (player.ch.points.gte(6)) expr = expr.sub(0.04)
            if (player.ch.points.gte(7)) expr = expr.sub(0.32)
            if (hasUpgrade('j', 22)) {
                expr = new Decimal(1)
                if (player.ch.points.gte(2)) expr = expr.sub(0.2)
                if (player.ch.points.gte(9)) expr = expr.sub(0.3)
                if (player.ch.points.gte(21)) expr = expr.sub(0.36)
            }
            if (hasUpgrade('j', 23)) {
                expr = new Decimal(1)
                if (player.ch.points.gte(2)) expr = expr.sub(0.2)
                if (player.ch.points.gte(9)) expr = expr.sub(0.3)
                if (player.ch.points.gte(100)) expr = expr.sub(0.36)
            }
            return expr
        }, //canBuyMax() { return hasUpgrade('Inf', 221) },
        doReset(resettingLayer) {
            if (layers[resettingLayer].row > layers[this.layer].row) {
                let kept = []
                layerDataReset(this.layer, kept)
            }
        }, milestones: {
            0: {
                requirementDescription: "Get 1 Character",
                effectDescription: "Gain 25% of StellarJade on reset per second",
                done() { return player.ch.points.gte(1) }
            },
            1: {
                requirementDescription: "Get 2 Characters",
                effectDescription: "Keep \"All that keeps on L3 reset\" on L3.5 reset",
                unlocked() { return hasMilestone('ch', 0) },
                done() { return player.ch.points.gte(2) }
            },
            2: {
                requirementDescription: "Get 3 Characters",
                effectDescription: "Unlock Characters Upgrade",
                unlocked() { return hasMilestone('ch', 1) },
                done() { return player.ch.points.gte(3) }
            },
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            { key: "q", description: "Q reset L3.5", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
        ],
        upgrades: {
            11: {
                title: "Silver Wolf",
                description: "Fragments on gain x1e5",
                cost: new Decimal("6"),
                unlocked() { return hasMilestone('ch',2) },
            },
            12: {
                title: "Kafka",
                description: "L1 points on gain ^1.12",
                cost: new Decimal("7"),
                unlocked() { return hasUpgrade('ch', 11) },
            },
            13: {
                title: "Blade",
                description: "L2 on gain ^1.08",
                cost: new Decimal("53"),
                unlocked() { return hasUpgrade('ch', 12) },
            },
            14: {
                title: "Firefly",
                description: "L3 on gain ^1.06",
                cost: new Decimal("55"),
                unlocked() { return hasUpgrade('ch', 13) },
            },
            15: {
                title: "???",
                description: "Fragments on gain ^1.07",
                cost: new Decimal("67"),
                unlocked() { return hasUpgrade('ch', 14) },
            },
            21: {
                title: "March 7th",
                description: "Multiply L3 by fragments over 1e100",
                cost: new Decimal("9"),
                unlocked() { return hasMilestone('ch', 2) },
                effect() { return player.points.div("1e100").max(1).pow(0.25).min(1e18) },
                effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            },
            22: {
                title: "Dan Heng",
                description: "Multiply L1 by Characters",
                cost: new Decimal("16"),
                unlocked() { return hasUpgrade('ch', 21) },
                effect() { return player.ch.points.add(1).pow(1.24).div(2).add(0.5) },
                effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            },
            23: {
                title: "Himeko",
                description: "Upgrade 22 effect ^4",
                cost: new Decimal("21"),
                unlocked() { return hasUpgrade('ch', 22) },
                effect() { return upgradeEffect('ch',22).pow(3) },
                effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            },
            24: {
                title: "Welt",
                description: "Fragments ^1.04",
                cost: new Decimal("50"),
                unlocked() { return hasUpgrade('ch', 23) },
            },
            25: {
                title: "Trailblazer",
                description: "L2 x1e14",
                cost: new Decimal("64"),
                unlocked() { return hasUpgrade('ch', 24) },
            },
        },
        layerShown() { return player.ch.points.gt(0) || player.ch.unlocked() }
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
     resource: "Infinity Points", // Name of prestige currency
     baseResource: "SR Fragment", // Name of resource prestige is based on
     baseAmount() { return player.points }, // Get the current amount of baseResource
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.001, // Prestige currency exponent
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
             title: "产出翻倍",
             description: "星穹碎片、星穹点数、信用点、星琼产出翻2倍",
             unlocked() { return true },
             cost: new Decimal(1),
         },
        12: {
             title: "打破无限",
             description: "取消星穹碎片硬上限",
             unlocked() { return true },
             cost: new Decimal(3),
         },
        221: {
             title: "无限增益",
             description: "然而并没有效果...吗？",
             unlocked() { return (player.j.points.gte(1)) },
             cost: new Decimal(0),
         },
        231: {
             title: "别点",
             description: "会炸档",
             unlocked() { return !hasUpgrade('Inf', 234) },
             pay(){player.points=NaN; player.Inf.points=NaN; player.devSpeed=NaN; confirm("都说了会炸档了")},
             cost: NaN,
         },
        232: {
             title: "你点不了",
             description: "你点不了的",
             unlocked() { return !hasUpgrade('Inf', 234) },
             cost: Infinity,
         },
        233: {
             title: "测试服专属",
             description: "所有产量翻1亿倍",
             unlocked() { return !hasUpgrade('Inf', 234) },
             pay(){hasUpgrade('Inf',233)=false},
             cost: 0,
         },
        234: {
             title: "点击删除",
             description: "点击删除这一行升级",
             unlocked() { return !hasUpgrade('Inf', 234) },
             pay(){confirm("删了")},
             cost: -10,
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
     exponent: 0.001, // Prestige currency exponent
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
     clickables:{
     11: {
      title() {return "可点击测试"},
      display() {return "点击获得0永恒点数"},
      canClick() {return true},
      onClick() {player.Etr.points = player.Etr.points.add(0);},},
      12: {
           title(){return "可点击测试2"},
           display: "点击重置L1",
          canClick() {return true},
           onClick() { doReset('p') },
      },
     13: {
      title() {return "可点击测试3"},
      display() {return "点击暂停游戏"},
      canClick() {return true},
      onClick() {player.devSpeed = new Decimal(0);},
    },
     14: {
      title() {return "可点击测试4"},
      display() {return "点击继续游戏"},
      canClick() {return true},
      onClick() {player.devSpeed = new Decimal(1);},},
    },
     upgrades: {
     },
     layerShown() { return true }
})