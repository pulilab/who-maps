if (!$) {
    $ = django.jQuery;
}

function deleteTextInput(element) {
    var listElement = element.parentNode;
    var listNode = listElement.parentNode;

    listNode.removeChild(listElement);
}

function addNewInputElement(element) {
    var listElement = element.parentNode;
    var listNode = listElement.parentNode;

    listNode = $(listNode);

    var elementCounter = listNode.data('element-counter');
    elementCounter++;
    listNode.data('element-counter', elementCounter);

    var elementName = listNode.attr('id') + '_' + elementCounter;

    var clonedItem = listNode.children(":first").clone();
    clonedItem.find('input').attr('name', elementName).attr('id', 'id_'+elementName).attr('value', '');
    clonedItem.find('select').attr('name', elementName).attr('id', 'id_'+elementName);
    clonedItem.find('select option:first').attr('selected', true);
    clonedItem.insertBefore(listNode.find('li:last'));
}
