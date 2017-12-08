if (!$) {
    $ = django.jQuery
}

function deleteTextInput(element) {
    var liElement = element.parentNode
    var ulElement = liElement.parentNode

    if ($('li', ulElement).length > 2) {
        ulElement.removeChild(liElement)
    }
    else {
        $(liElement).find('input').val('')
    }
}

function addNewInputElement(element) {
    var ulElement = element.parentNode
    var liElement = $(ulElement.parentNode)

    var elementCounter = liElement.data('element-counter')
    elementCounter++
    liElement.data('element-counter', elementCounter)

    var elementName = liElement.attr('id') + '_' + elementCounter

    var clonedItem = liElement.children(":first").clone()
    clonedItem.find('input').attr('name', elementName).attr('id', 'id_'+elementName).val('')
    clonedItem.find('select').attr('name', elementName).attr('id', 'id_'+elementName)
    clonedItem.find('select option:first').attr('selected', true)
    clonedItem.insertBefore(liElement.find('li:last'))
}

function checkOptionsVisibility(element) {
    console.log(element)
}


$(document).on('click', '.add-arraywidget-item', function(e) {
    e.preventDefault()
    addNewInputElement(e.target)
})

$(document).on('click', '.delete-arraywidget-item', function(e) {
    e.preventDefault()
    deleteTextInput(e.target)
})

$(document).on("change", '#fields-group td.field-type select', function(e) {
    var parent = e.target.parentNode.parentNode
    var list = $('.arrayfield-list', parent)
    var value = +e.target.value

    if (value === 4 || value === 5 ) {
        list.show()
    }
    else {
        list.hide()
    }
})

$( document ).ready(function() {
    $('#fields-2-group .arrayfield-list').show()
})
