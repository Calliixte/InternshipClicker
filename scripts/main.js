const app = Vue.createApp({
    data () {
        return{
            title : 'Welcome to my vue training range',
            nb : 0,
        };
    },
    methods : {
        increment(){
            this.nb++;
            console.log('Test');
        }
    }

})
app.mount('#app');