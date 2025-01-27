const app = Vue.createApp({
    data () {
        return{
            title : 'Welcome to my vue training range',
            nb : 0,
            clickPower : 1,
            upgradesShown : false,
        };
    },
    methods : {
        increment(){
            this.nb+=this.clickPower;
            console.log('Test');
        },
        showUpgrades(){
            this.upgradesShown = !this.upgradesShown;
        },
        changeClickPower(nb){
            this.clickPower+=nb;
        }
    }

})
app.mount('#app');