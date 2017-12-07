from __future__ import unicode_literals

import re

from django.contrib.postgres.forms.array import SimpleArrayField
from django.forms.widgets import MultiWidget, TextInput
from django.utils.html import format_html
from django.utils.safestring import mark_safe


class AdminArrayFieldWidget(MultiWidget):
    template_name = 'admin/widgets/arrayfieldwidget.html'
    is_hidden = False
    input_class = TextInput
    outer_html = '<ul{id_attr} data-element-counter="{element_count}" class="arrayfield-list">{content}{add_new}</ul>'
    add_new_html = '<li><a href="#" onclick="addNewInputElement(this)">Add new entry</a></li>'

    def __init__(self, input_widget, attrs=None):
        self.widget = input_widget
        super(AdminArrayFieldWidget, self).__init__([], attrs)

    def render(self, name, value, attrs=None):
        """

            {% for widget in widget.subwidgets %}
                <li>
                    {% include widget.template_name %}
                    <img src="{% static "admin/img/icon-no.svg" %}" alt="Delete" onclick="deleteTextInput(this)">
                </li>
            {% endfor %}
            <li><a href="#" onclick="addNewInputElement('#{{ widget.name }}')">Add new entry</a></li>
        </ul>
        """

        if value:
            widget_count = len(value)
        else:
            widget_count = 1
        self.widgets = [self.widget for i in range(widget_count)]

        output = super(AdminArrayFieldWidget, self).render(name, value, attrs)

        return format_html(self.outer_html,
                           id_attr=format_html(' id="{}"', name) if name else '',
                           element_count=widget_count,
                           content=mark_safe(output),
                           add_new=format_html(self.add_new_html))

    def format_output(self, rendered_widgets):
        output = []
        for widget in rendered_widgets:
            output.append('<li>{}<img src="#" alt="Delete" onclick="deleteTextInput(this)" /></li>'.format(widget))
        return '\n'.join(output)

    def value_from_datadict(self, data, files, name):
        pattern = re.compile(r'^{}_[0-9]+$'.format(name))
        data_keys = [key for key in data if pattern.match(key)]
        data_keys = sorted(data_keys, key=lambda x: int(x.split('_')[-1]))

        self.widgets = [self.widget for i in range(len(data_keys))]

        ret = []
        for i, key in enumerate(data_keys):
            widget = self.widgets[i]
            value = widget.value_from_datadict(data, files, key)
            if value:
                ret.append(value)
        return ret

    def decompress(self, value):
        """This is only to handle None"""
        if value is None:
            return []
        raise TypeError('Cannot handle type {}'.format(type(value).__name__))

    def get_context(self, name, value, attrs):
        context = super(AdminArrayFieldWidget, self).get_context(name, value, attrs)
        if value:
            context['widget']['element_count'] = len(value)
        else:
            context['widget']['element_count'] = 0
        return context


class AdminArrayField(SimpleArrayField):
    def __init__(self, *args, **kwargs):
        widget = AdminArrayFieldWidget(input_widget=kwargs['base_field'].widget)
        kwargs.setdefault('widget', widget)
        super(AdminArrayField, self).__init__(*args, **kwargs)

    def prepare_value(self, value):
        return value

    def to_python(self, value):
        if value:
            value = self.delimiter.join(value)

        return super(AdminArrayField, self).to_python(value)
