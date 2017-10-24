/* eslint-disable no-new,func-names */
import Vue from 'vue/dist/vue.common';
import AjaxBar from './vue/AjaxBar.vue';

new Vue({
    el: '#v-base',
    components: {
        AjaxBar
    },
    template: '<ajax-bar />'
});
