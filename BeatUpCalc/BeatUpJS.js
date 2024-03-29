//to-do list:
//still duplicate calcs
//doesn't have a chance based damage calculation

let randoValues = [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]; //all potential integers used for the randomized roll

document.getElementById("calcBtn").onclick = function() {
    let randKOCount = 0; //counter for how many Ko's
    let turnCnt = 1;
    let oppDef; 
    let other = 1; //other multiplier used for practically everything ranging from weather to abilities to items
    document.getElementById("possOutPut").innerHTML = "Possible damage amounts: <br />";
    let resultString = document.getElementById("possOutPut").innerHTML; //output field for each individual damage roll

    //checking level
    let lvl = 5;
    if (!document.getElementById("lvl5").checked) lvl = 100;
    
    //checking STAB
    let stab = 1; //stab value
    if (document.getElementById("stab").checked) {stab += 0.5;};
    if (document.getElementById("tera").checked) {stab += 0.5;};

    //checking usr's attack value
    let usrAtkBstMult = staStagSwtch(+document.getElementById("attackStage").value);
    let usrAtk = (+document.getElementById("selectMon1").value) * usrAtkBstMult;
    usrAtk = Math.floor(usrAtk);

    //checking opposing typing
    let typeRes = 1;
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
            crit: 1
        },
        mon2 = {
            baseAtk: +document.getElementById("atkMon2").value,
            fainted: 0,
            crit: 1
        },
        mon3 = {
            baseAtk: +document.getElementById("atkMon3").value,
            fainted: 0,
            crit: 1
        },
        mon4 = {
            baseAtk: +document.getElementById("atkMon4").value,
            fainted: 0,
            crit: 1
        },
        mon5 = {
            baseAtk: +document.getElementById("atkMon5").value,
            fainted: 0,
            crit: 1
        },
        mon6 = {
            baseAtk: +document.getElementById("atkMon6").value,
            fainted: 0,
            crit: 1
        }
    ];

    //check each mon for faint and crit multipliers
    for (let p = 1; p <= 6; p++) {
        let crBoxMon_X = "crBoxMon" + p;
        if (document.getElementById(crBoxMon_X).checked)
        {
            monObjects[p-1].crit = 1.5;
        }
        let hkBoxMon_X = "hkBoxMon" + p;
        if (p != 1) {
            if (document.getElementById(hkBoxMon_X).checked){monObjects[p-1].fainted = 1;};
        }
    }

    //checking for Items and Burn
    if (document.getElementById("burn").checked) other *= 0.5;
    if (document.getElementById("oppItem").value == "Eviolite") other /= 1.5;
    if (document.getElementById("userItem").value == "Black Glasses") other *= 1.2;
    if (document.getElementById("userItem").value == "Life Orb") other *= 1.3;
    if (document.getElementById("userAbility").value == "Hustle") other *= 1.5;
    if (document.getElementById("userAbility").value == "Tough Claws") other *= (5325 /4096);
    if (document.getElementById("userAbility").value == "Technician") {
        let base = (monObjects[1].baseAtk / 10) + 5;
        base = Math.floor(base);
        if (base <= 60) {other *= 1.5;}; //research implies user's atk is solely checked to then boost all following (akin to other multihits)
    }
    //let technicianBool = false;
    if (document.getElementById("userItem").value == "Choice Band") {
        let tempAtk = usrAtk * 1.5;
        Math.floor(tempAtk); //potential issue
        usrAtk = tempAtk;
    } 

    //checks for reflect
    if (document.getElementById("reflect").checked) {other /= 2;};
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
    function staStagSwtch(x){
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

    function damageCalc(randVal){
        rando = randVal/100; //the integer given from the array needs to be turned into a %

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
                oppDefMult = staStagSwtch(oppDefStage);
                if (document.getElementById("oppAbility").value == "Fur Coat"){
                    oppDef = (+document.getElementById("oppDefense").value) * 2 * oppDefMult;
                } else {
                    oppDef = (+document.getElementById("oppDefense").value) * oppDefMult;
                }

                //the true damage calc:
                let basePow = (monObjects[i].baseAtk / 10) + 5;
                basePow = Math.floor(basePow);
                /*if (basePow <= 60) {
                    if (technicianBool != true) {
                        if (document.getElementById("userAbility").value == "Technician") {
                            other *= 1.5;
                            technicianBool = true;
                        };
                    }
                }*/
                let damage = ((2*lvl)/5 + 2) * basePow;
                damage = Math.floor(damage);
                damage *= usrAtk;
                damage = Math.floor(damage);
                damage /= oppDef; 
                damage = Math.floor(damage);
                // if (damage == 0) damage = 1;
                damage /= 50;
                damage = Math.floor(damage);
                // if (damage == 0) damage = 1;
                damage += 2; //beyond me why this exists in the original damage calc
                damage = Math.floor(damage);
                damage *= rando;
                damage = Math.floor(damage);
                damage *= stab;
                damage = Math.floor(damage);
                damage *= typeRes;
                damage = Math.floor(damage);
                damage *= other;
                damage = Math.floor(damage);
                damage *= monObjects[i].crit;
                damage = Math.floor(damage);
                if (damage == 0) damage = 1;
                //end of the true damage calc

                //appending a seperator comma for our list of individual hits
                resultString += damage + ", "; 
        
                //stamina and Weak armor procs
                if (document.getElementById("oppAbility").value == "Weak Armor gen5-6"){
                    oppDefStage--;
                    if (oppDefStage <= -6) oppDefStage = -6;
                }
        
                if (document.getElementById("oppAbility").value == "Weak Armor gen7+"){
                    oppDefStage -= 2;
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
Code by Rhydonphilip, with help of Albison_
*/