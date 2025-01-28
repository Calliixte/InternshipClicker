
const app = Vue.createApp({
    data () {
        return{
            title : 'Welcome to my vue training range',
            nb : 0,
            clickPower : 1,
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
                    method : "passiveClick",
                    cost : 2,
                    amountBought: 0
                }
            ],

        };
    },
    methods : {
        increment(){
            this.nb+=this.clickPower;
        },
        showUpgrades(){
            this.upgradesShown = !this.upgradesShown;
        },
        changeClickPower(nb){
            this.clickPower+=nb;
        },
        changeScore(nb){
            this.nb+=nb;
        },
        giveMax(){
            this.nb+=999999;
        },
        processUpgrade(id){
            if(this.nb>this.upgrades[id].cost){
                let methodName = this.upgrades[id].method;
                if (this[methodName]) {
                    this[methodName](id);
                }
                this.upgrades[id].amountBought++;
                this.upgrades[id].cost+=Math.round((this.upgrades[id].amountBought*this.upgrades[id].cost)/2);
            }else{
                console.log("Cannot buy this " + this.upgrades[id].title);
            }

        },
        upgradeClickPower(id){
                this.changeClickPower(1);
                this.nb-=this.upgrades[id].cost;
        },
        timesTwoClickPower(id){
            this.changeClickPower(this.clickPower);
            this.nb-=this.upgrades[id].cost;
        },
        async passiveClick(){
            console.log("je dors");
            await sleep(2000);
            console.log("j'ai dormi");
        },
    }

})
app.mount('#app');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}