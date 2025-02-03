
const app = Vue.createApp({
    data () {
        return{
            title : 'Random aah clicker',
            Cv : 0,
            passiveCv : 0,
            passiveStarted : false,
            clickPower : 1,
            maxUnlockedId : 0,
            upgradesNb: null,
            settingsShown : false,
            upgradesShown : false,
            upgrades : null,
            //notes for me : [] = array | {} = object
        };
    },
    mounted(){
        fetch('../externalFiles/upgrades.json')
            .then(response=>response.json())
            .then(data=>{
                this.upgrades = data;
                this.upgradesNb= this.upgrades.length;
            })
            .catch(error=>console.error('JSON fetch error : ',error));
    },

    methods : {
        increment(){
            this.Cv+=this.clickPower;
        },
        showUpgrades(){
            this.upgradesShown = !this.upgradesShown;
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
                if(this.upgrades[id].amountBought===10){
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
    let ligne=e.target.parentElement.innerText;
    const colors = ligne.split("\t");
    const fgCol = colors[1];
    const bgCol = colors[0];
    const bg= document.querySelector("body");
    bg.style.backgroundColor=bgCol;
    text.forEach((element) => element.style.color=fgCol);
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