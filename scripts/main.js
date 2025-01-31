
const app = Vue.createApp({
    data () {
        return{
            title : 'Random aah clicker',
            Cv : 0,
            passiveCv : 0,
            passiveStarted : false,
            clickPower : 1,
            settingsShown : false,
            upgradesShown : false,
            //notes for me : [] = array | {} = object
            //also for the object array underneath i will try to store it into a file later (idk if it is possible yet but i'd guess a json thing would work)
            upgrades : [
                {
                    id: 0,
                    title : "Click Power Upgrade",
                    description : "Augments the click power by 1",
                    method : "upgradeClickPower",
                    //consider adding a baseCost in order to scale the price based on the initial cost of the upgrade
                    cost : 10,
                    amountBought: 0
                },
                {
                    id: 1,
                    title : "Click Power Upgrade 2",
                    description : "Paid dlc of the first click power upgrade",
                    method : "timesTwoClickPower",
                    cost : 100,
                    amountBought: 0
                },
                {
                    id: 2,
                    title : "Passive Upgrade 1",
                    description : "Testing the unfiltered power of pure clicking",
                    method : "passiveUpTest",
                    cost : 2,
                    amountBought: 0
                }
            ],

        };
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
        processUpgrade(id){
            // for some reason there is a problem in the game loop that wasnt there before
            if(this.Cv>this.upgrades[id].cost){
                let methodName = this.upgrades[id].method;
                if (this[methodName]) {
                    this[methodName](id);
                }
                this.upgrades[id].amountBought++;
                this.upgrades[id].cost+=Math.round((this.upgrades[id].amountBought*this.upgrades[id].cost)/2);
                this.Cv-=this.upgrades[id].cost;
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