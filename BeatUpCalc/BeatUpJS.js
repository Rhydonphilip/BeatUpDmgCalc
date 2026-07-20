let randoValues = [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]; //all potential integers used for the randomized roll

document.getElementById("calcBtn").onclick = function() {
    let randKOCount = 0; //counter for how many Ko's
    let turnCnt = 1;
    let oppDef; 
    let other = 4096; //other multiplier used for practically everything ranging from weather to abilities to items
    let burn = 4096;
    document.getElementById("possOutPut").innerHTML = "Possible damage amounts: <br />";
    let resultString = document.getElementById("possOutPut").innerHTML; //output field for each individual damage roll

    //checking level
    let lvl = document.getElementById("lvl").value;
    
    //checking STAB
    let stab = 4096; //base stab in Pokemon's bit notation
    if (document.getElementById("stab").checked) {stab += 2048;};
    if (document.getElementById("tera").checked) {stab += 2048;};

    //checking user's attack value
    let usrAtkBstMult = statStageSwitch(+document.getElementById("attackStage").value);
    let usrAtk = (+document.getElementById("selectMon1").value) * usrAtkBstMult;
    usrAtk = Math.floor(usrAtk);

    //checking opposing typing
    let typeRes = 4096;
    type1 = document.getElementById("type1").value;
    type2 = document.getElementById("type2").value;
    if (document.getElementById("gen5").checked){
        if (type1 == "Dark" || type1 == "Fighting" || type1 == "Fairy" || type1 == "Steel") typeRes *= 0.5;

        if (type2 == "Dark" || type2 == "Fighting" || type2 == "Fairy" || type1 == "Steel"){
            if (type1 != type2) typeRes *= 0.5;
        }
    
        if (type1 == "Psychic" || type1 == "Ghost") typeRes *= 2;
    
        if (type2 == "Psychic" || type2 == "Ghost"){
            if (type1 != type2) typeRes *= 2;
        }
    } else {
        if (type1 == "Dark" || type1 == "Fighting" || type1 == "Fairy") typeRes *= 0.5;

        if (type2 == "Dark" || type2 == "Fighting" || type2 == "Fairy" ){
            if (type1 != type2) typeRes *= 0.5;
        }
    
        if (type1 == "Psychic" || type1 == "Ghost") typeRes *= 2;
    
        if (type2 == "Psychic" || type2 == "Ghost"){
            if (type1 != type2) typeRes *= 2;
        }    
    }

    //checking opposing HP
    let currentHP = +document.getElementById("oppHP").value;
    let maxHP = +document.getElementById("oppMaxHP").value;
    if (currentHP > maxHP) currentHP = maxHP;

    //make mon objects
    let monObjects = [
        mon1 = {
            baseAtk: +document.getElementById("atkMon1").value,
            fainted: 0,
            crit: 4096
        },
        mon2 = {
            baseAtk: +document.getElementById("atkMon2").value,
            fainted: 0,
            crit: 4096
        },
        mon3 = {
            baseAtk: +document.getElementById("atkMon3").value,
            fainted: 0,
            crit: 4096
        },
        mon4 = {
            baseAtk: +document.getElementById("atkMon4").value,
            fainted: 0,
            crit: 4096
        },
        mon5 = {
            baseAtk: +document.getElementById("atkMon5").value,
            fainted: 0,
            crit: 4096
        },
        mon6 = {
            baseAtk: +document.getElementById("atkMon6").value,
            fainted: 0,
            crit: 4096
        }
    ];

    //check each mon for faint and crit multipliers
    for (let p = 1; p <= 6; p++) {
        let crBoxMon_X = "crBoxMon" + p;
        if (document.getElementById(crBoxMon_X).checked)
        {
            if (document.getElementById("gen5").checked) monObjects[p-1].crit = 8192;
            else monObjects[p-1].crit = 6144;
        }
        let hkBoxMon_X = "hkBoxMon" + p;
        if (p != 1) {
            if (document.getElementById(hkBoxMon_X).checked){monObjects[p-1].fainted = 1;};
        }
    }

    //checking for Items and Burn
    if (document.getElementById("burn").checked)
        burn = pokeRound(other * 2048 / 4096);
    if (document.getElementById("userItem").value == "Black Glasses")
        other = pokeRound(other * 4915 / 4096);
    if (document.getElementById("userItem").value == "Life Orb")
        other = pokeRound(other * 5324 / 4096);
    if (document.getElementById("userAbility").value == "Hustle")
        other = pokeRound(other * 6144 / 4096);
    if (document.getElementById("userAbility").value == "Stakeout")
        other = pokeRound(other * 8192 / 4096);
//  if (document.getElementById("userAbility").value == "Tough Claws") other *= (5325 /4096);
    let technicianBool = false;
    if (document.getElementById("userItem").value == "Choice Band") {
        usrAtk = Math.floor(usrAtk * 6144 / 4096);
    } 

    //checks for reflect
    if (document.getElementById("reflect").checked) {other = pokeRound(other / 2);};
    //Checks for sr, spikes, status conditions
    residDmgCheck();

    //unfinished multiline, this was to have a fractional %
    /*
    document.getElementById("outputP").innerHTML = "Beat Up has a " + (randKOCount / 16) + "% chance to " ;
    //need to run through all the rando values, and make it output each instance it did KO
    if (damageCalc(randoValues[0]) <= 0){
        document.getElementById("outputP").innerHTML += "OHKO";
    } else if (damageCalc(randoValues[0]) <= (maxHP/2)) {
        document.getElementById("outputP").innerHTML += "2HKO";
    } else {
        turnCnt = 2;
        residDmgCheck();
        if (damageCalc(randoValues[0]) <= (maxHP/2)){
        document.getElementById("outputP").innerHTML += "2HKO after taking double hazards";
        }
    }*/

    //performs the calc for each damage roll in our roll array
    for (let j = 0; j < randoValues.length; j++){
        if (damageCalc(randoValues[j]) <= 0){randKOCount++;};
    }    

    //possible damage roll's as an output; need to be turned back into HTML
    document.getElementById("possOutPut").innerHTML = resultString;

    if (damageCalc(randoValues[0]) <= 0) {document.getElementById("outputP").innerHTML = "It always KO's";}; //if the min roll always KO's


    //internal Functions
    function residDmgCheck(){
        //checks for Stealth Rocks
        if (document.getElementById("sr").checked) {
            let divSR = 8;
            if (type1 == "Bug" || type1 == "Flying" || type1 == "Ice" || type1 == "Fire") {
                divSR /= 2;
            }

            if (type2 == "Bug" || type2 == "Flying" || type2 == "Fire" || type2 == "Ice" ){
                if (type1 != type2) divSR /= 2;
            }

            if (type1 == "Fighting" || type1 == "Ground" || type1 == "Steel") {
                divSR *= 2;
            }

            if (type2 == "Fighting" || type2 == "Ground" || type2 == "Steel"){
                if (type1 != type2) divSR *= 2;
            }
            let tempSR = maxHP/divSR;
            tempSR = Math.floor(tempSR);
            currentHP -= tempSR;
        }

        //check spikes
        if (document.getElementById("spike").value == "1") {
            let tempSpk = maxHP/8;
            tempSpk = Math.floor(tempSpk);
            currentHP -= tempSpk;
        } else if (document.getElementById("spike").value == "2") {
            let tempSpk = maxHP/6;
            tempSpk = Math.floor(tempSpk);
            currentHP -= tempSpk;
        } else if (document.getElementById("spike").value == "3") {
            let tempSpk = maxHP/4;
            tempSpk = Math.floor(tempSpk);
            currentHP -= tempSpk;
        }

        //check status
        let oppStatus = document.getElementById("oppStatus").value;
        if (oppStatus == "brn5" || oppStatus == "psn" || (oppStatus == "toxic" && turnCnt == 2) ) {
            let tempStD = maxHP/8;
            tempStD = Math.floor(tempStD);
            currentHP -= tempStD;
        } else if (oppStatus == "brn7" || oppStatus == "toxic") {
            let tempStD = maxHP/16;
            tempStD = Math.floor(tempStD);
            currentHP -= tempStD;
        }
    }


    //switch to determine fractions for stat stages
    function statStageSwitch(x){
        //this changes what the stat stage value is, ranging from -6 to 6 into a boost multiplier using its fraction. 
        //If negative: the fraction is changed on the bottom. If possitive it instead increases on the top. It's 2/2 by default aka a 1x multiplier
        let top = 2;
        let bott = 2;
        switch (x) {
        case -6:
            bott = 8;
            break;
        case -5:
            bott = 7;
            break;
        case -4:
            bott = 6;
            break;
        case -3:
            bott = 5;
            break;
        case -2:
            bott = 4;
            break;
        case -1:
            bott = 3;
            break;
        case 1:
            top = 3;
            break;
        case 2:
            top = 4;
            break;
        case 3:
            top = 5;
            break;
        case 4:
            top = 6;
            break;
        case 5:
            top = 7;
            break;
        case 6:
            top = 8;
            break;
        default:
            top = 2;
            bott = 2;
        }
        let rslt = top/bott;
        return rslt;
    }

    function getBaseDamage(level, basePower, attack, defense) {
        return Math.floor(
            OF32(
                Math.floor(
                    OF32(OF32(Math.floor((2 * level) / 5 + 2) * basePower) * attack) / defense
                ) / 50 + 2
            )
        );
    }

    // Game Freak rounds DOWN on .5
    function pokeRound(num) {
        return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
    }

    // 16-bit Overflow
    function OF16(n) {
        return n > 65535 ? n % 65536 : n;
    }

    // 32-bit Overflow
    function OF32(n) {
        return n > 4294967295 ? n % 4294967296 : n;
    }


    function damageCalc(randVal){
        resultString += "roll " + randVal + ": (";  //start of the list of individual hits
        let KO = 0; //KO boolean

        //initializing the defense stage and adjusting it only as a variable in here
        let oppDefStage = +document.getElementById("defStage").value;
        let resHP = currentHP;
        //the damage calc and damage being removed from total HP
        let itemConsumed = false;
        for (let i = 0; i < 6; i++) {
            if (monObjects[i].fainted == 0) 
            {
                //Adjusting potential stat states that may change mid attack (Weak Armor or Stamina)
                if (monObjects[i].crit == 4096) {
                    oppDefMult = statStageSwitch(oppDefStage);
                    if (document.getElementById("oppAbility").value == "Fur Coat"){
                        oppDef = (+document.getElementById("oppDefense").value) * 2 * oppDefMult;
                    } 

                    if (document.getElementById("oppItem").value == "Eviolite"){
                        oppDef = (+document.getElementById("oppDefense").value) * 1.5 * oppDefMult;
                    } else {
                        oppDef = (+document.getElementById("oppDefense").value) * oppDefMult;
                    }
                } else {
                    oppDef = (+document.getElementById("oppDefense").value);
                }

                let basePow = Math.floor(monObjects[i].baseAtk / 10) + 5;
                basePow = OF16(Math.max(1, pokeRound(basePow)));

                //check technician
                let otherWithTechnician = other;
                if (basePow <= 60 && document.getElementById("userAbility").value == "Technician") {
                    otherWithTechnician = pokeRound(other * 6144 / 4096);
                }

                //the true damage calc:
                let damage = getBaseDamage(lvl, basePow, usrAtk, oppDef);
                damage = pokeRound(damage * monObjects[i].crit / 4096);
                damage = Math.floor(damage * randVal / 100);
                damage = pokeRound(damage * stab / 4096);
                damage = pokeRound(damage * typeRes / 4096);
                damage = pokeRound(damage * burn / 4096);
                damage = pokeRound(damage * otherWithTechnician / 4096);
                if (damage == 0) { damage = 1;} 
                //end of the true damage calc

                //appending a seperator comma for our list of individual hits
                resultString += damage + ", "; 
        
                //Stamina and Weak Armor procs
                if (document.getElementById("oppAbility").value == "Weak Armor"){
                    oppDefStage--;
                    if (oppDefStage <= -6) oppDefStage = -6;
                }
        
                if (document.getElementById("oppAbility").value == "Stamina"){
                    oppDefStage++;
                    if (oppDefStage >= 6) oppDefStage = 6;
                }
        
                //reducing HP from total
                resHP -= damage;
                if (itemConsumed == true) {
                    
                }
                else if (document.getElementById("oppItem").value == "Berry Juice") {
                    if ((maxHP / 2) > resHP) {
                        resHP += 20;
                        if (resHP > maxHP) resHP = maxHP;
                        itemConsumed = true;
                    }
                } else if (document.getElementById("oppItem").value == "Oran Berry") {
                    if ((maxHP / 2) > resHP) {
                        resHP += 10;
                        if (resHP > maxHP) resHP = maxHP;
                        itemConsumed = true;
                    }
                }
        
                if (KO == 0){
                    if (resHP <= 0) {
                        document.getElementById("outputP").innerHTML = "KO's";
                        KO = 1;
                    } else {
                        document.getElementById("outputP").innerHTML = "remaining HP = " +  resHP + " out of " + maxHP;
                    }
                }
            }
        }
        resultString = resultString.slice(0, resultString.length-2);
        resultString += ") " + "<br />"; //28 per line, roughly, so might have to cut away more here
        return resHP
    }
}

/*
Code by Rhydonphilip, with help of Albison_ and a nice bugfix catch by Reggg
*/