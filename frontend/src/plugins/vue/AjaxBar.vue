<template>
  <div v-show="showContainer" :style="containerStyle">
    <vue-topprogress color="#FFBB00" :speed="100" ref="progress"></vue-topprogress>
  </div>
</template>


<script>
    import { vueTopprogress } from 'vue-top-progress';
    import debounce from 'lodash/debounce';

    export default {
        components: {
            vueTopprogress
        },
        data() {
            return {
                containerStyle: {
                    width: 'calc(100% - 17px)',
                    height: '3px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#1A237E',
                    'z-index': 9999
                },
                showContainer: true
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
            const start = () => {
                progress.start();
            }

            const end = debounce(() => {
                    progress.done();
            }, 250);

            XMLHttpRequest.prototype.open = function(a = '', b = '') {
                start()
                listener.tempOpen.apply(this, arguments);
                listener.method = a;
                listener.url = b;
                if (a.toLowerCase() === 'get') {
                    listener.data = b.split('?');
                    listener.data = listener.data[1];
                }
            };
            XMLHttpRequest.prototype.send = function(a = '') {
                listener.tempSend.apply(this, arguments);
                end();
                if (listener.method.toLowerCase() === 'post') { listener.data = a; }
                listener.callback();
            };

            window.addEventListener('RouterTransitionStart', start)
            window.addEventListener('RouterTransitionDone', end)
        }
    }
</script>
