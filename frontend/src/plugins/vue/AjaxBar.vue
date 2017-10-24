<template>
  <div v-show="showContainer" :style="containerStyle">
    <vue-topprogress color="#FFBB00" ref="progress"></vue-topprogress>
  </div>
</template>


<script>
    import { vueTopprogress } from 'vue-top-progress';
    export default {
        components: {
            vueTopprogress
        },
        data() {
            return {
                containerStyle: {
                    width: '100%',
                    height: '3px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#080D43'
                },
                showContainer: false
            };
        },
        mounted() {
            const progress = this.$refs.progress;
            const instance = this;
            const listener = {
                tempOpen: XMLHttpRequest.prototype.open,
                tempSend: XMLHttpRequest.prototype.send,
                callback() { }
            };
            XMLHttpRequest.prototype.open = function(a = '', b = '') {
                instance.showContainer = true;
                progress.start();
                listener.tempOpen.apply(this, arguments);
                listener.method = a;
                listener.url = b;
                if (a.toLowerCase() === 'get') {
                    listener.data = b.split('?');
                    listener.data = listener.data[1];
                }
            };
            XMLHttpRequest.prototype.send = function(a = '') {
                setTimeout(()=>{
                    progress.done();
                    instance.showContainer = false;
                }, 500);
                listener.tempSend.apply(this, arguments);
                if (listener.method.toLowerCase() === 'post') { listener.data = a; }
                listener.callback();
            };
        }
    }
</script>