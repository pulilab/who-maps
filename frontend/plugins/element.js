import Vue from 'vue';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import LazyElSelect from '@/components/proxy/LazyElSelect';

export default () => {
  Vue.use(Element, { locale });
  Vue.component(LazyElSelect.name, LazyElSelect);
};
