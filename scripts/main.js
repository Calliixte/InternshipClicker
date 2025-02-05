
const app = Vue.createApp({
    data () {
        return{
            title : 'Very realistic simulation of the job market', 
            Cv : 0,
            AMOUNT_UNLOCK : 10,
            passiveCv : 0,
            passiveStarted : false,
            clickPower : 1,
            maxUnlockedId : 0,
            upgradesNb: null,
            settingsShown : false,
            upgradesShown : false,
            upgrades : null,
            keysPressed : {},
            codeCounter : 0,
            //notes for me : [] = array | {} = object
        };
    },
    mounted(){
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("keyup", this.handleKeyup);
        fetch('upgrades.json')
            .then(response=>response.json())
            .then(data=>{
                this.upgrades = data;
                this.upgradesNb= this.upgrades.length;
            })
            .catch(error=>console.error('JSON fetch error : ',error));
    },
    beforeUnmount() {
        //since this is single page app removing the event listeners is not needed but i include it for best practices
        window.removeEventListener("keydown", this.handleKeydown);
        window.removeEventListener("keyup", this.handleKeyup);
      },

    methods : {
        increment(){
            this.Cv+=this.clickPower;
        },
        showUpgrades(){
            this.upgradesShown = !this.upgradesShown;
        },
        handleKeydown(event) { 
            this.keysPressed[event.key] = true; // Store key state
            this.checkCheat(event.key);
            console.log(Object.keys(this.keysPressed));
          },
        handleKeyup(event) {
            this.keysPressed = {}; // Remove key from active list
        },
        checkCheat(newKey){ //↑↑↓↓←→←→B A Start 
            //right now this loads the code into memory each time so it takes more ressource than needed,
            //either pass a code as a parameter or make it a data(){} variable for better
            const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a","Enter"];
            if(newKey === code[this.codeCounter]){
                if(this.codeCounter+1==code.length){
                    this.giveMax();
                    this.codeCounter=0;
                    let audio =  new Audio("./externalFiles/crazyFun.mp3");
                    audio.play();
                    //playsound or something i need this to be more festive
                }else{
                    this.codeCounter++;
                    console.log("next key : " + code[this.codeCounter]);
                }
                
            }else{
                this.codeCounter=0;
            }
        },
        changeClickPower(nb){
            this.clickPower+=nb;
        },
        changeScore(nb){
            this.Cv+=nb;
        },
        showSettings(){
            this.settingsShown= !this.settingsShown;
        },
        giveMax(){
            this.Cv+=999999;
        },
        initUpgrade(id){
            this.upgrades[id].cost=this.upgrades[id].baseCost;
        },
        //have temporary bonuses at some random point
        unlockNew(){
            if(this.maxUnlockedId>=this.upgradesNb-1){ //-1 cuz we are using ids that start at 0 for the upgrades
                console.log("no upgrades left"); //find a way to signal this better
                return 0;
            }
            this.maxUnlockedId++;
            this.initUpgrade(this.maxUnlockedId);
        },
        checkCost(id,event){
            let button = event.target;
            if(this.Cv>=this.upgrades[id].cost){
                button.style.cursor="inherit";
            }else{
                button.style.cursor="no-drop";
            }
        },
        updatePrice(id){
            let currentCost = this.upgrades[id].cost; //still not that good of a upgrade function but at least it doesnt go to the moon now
            let augmentation = this.upgrades[id].baseCost * this.upgrades[id].amountBought;
            this.upgrades[id].cost = currentCost + augmentation;
        },
        processUpgrade(id){
            if(this.Cv>=this.upgrades[id].cost){
                let methodName = this.upgrades[id].method;
                if (this[methodName]) {
                    this[methodName](id);
                }
                this.Cv-=this.upgrades[id].cost;
                this.upgrades[id].amountBought++;
                this.updatePrice(id);
                if(this.upgrades[id].amountBought===this.AMOUNT_UNLOCK){
                    this.unlockNew();
                }
            }else{
                console.log("Cannot buy this " + this.upgrades[id].title);
            }
            if(this.passiveCv && !this.passiveStarted){
                this.applyPassive();
                this.passiveStarted= true;
            }

        },
        upgradeClickPower(id){
                this.changeClickPower(1);
        },
        upgradeTenClickPower(id){ //i'd need to change how this works because this is really lame rn
            this.changeClickPower(10);
        },
        timesTwoClickPower(id){
            this.changeClickPower(this.clickPower);
        },
        passiveUpTest(id){
            this.passiveCv+=10;
        },
        async applyPassive(){
                while(true){
                    await sleep(1000);
                    this.Cv+=this.passiveCv;
                }

        },
    }

})
app.mount('#app');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// purely javascript no vuejs as it is work done in uni that i just
// imported on there
function dynamicCol(){ 
    const cases = document.querySelectorAll("body table tr td");
    cases.forEach((element) => element.style.backgroundColor=element.innerText);
}
function changeColor(e){
    const text = document.querySelectorAll("body .text");
    const btnBg = document.querySelectorAll("body .clickButton,.buttonSwitch");
    let ligne=e.target.parentElement.innerText;
    const colors = ligne.split("\t");
    const fgCol = colors[1];
    const bgCol = colors[0];
    const bg= document.querySelector("body");
    bg.style.backgroundColor=bgCol;
    text.forEach((element) => element.style.color=fgCol);
    btnBg.forEach((element) => {
        element.style.backgroundColor=fgCol;
        element.style.color=bgCol;
    });
}
function colorText(){
    const p = document.querySelector('body table');
    p.addEventListener('click',changeColor);
}
function addTwoColors(){
    const col1 = document.getElementById("col1");
    const col2 = document.getElementById("col2");
    premiereCouleur = col1.value;
    secondeCouleur=col2.value;
    const nt1 = document.createTextNode(premiereCouleur);
    const nt2 = document.createTextNode(secondeCouleur);
    const tableau = document.querySelector("body table");
    let Ligne = document.createElement("tr");
    let case1 = document.createElement("td");
    let case2 = document.createElement("td");
    case1.appendChild(nt1);case2.appendChild(nt2);
    Ligne.appendChild(case1);Ligne.appendChild(case2);
    tableau.appendChild(Ligne);
    dynamicCol(); 
}

document.addEventListener("DOMContentLoaded",(event => {dynamicCol()}));
document.addEventListener("DOMContentLoaded",(event => {colorText()}));
