class DetailElementController {

    constructor() {
    }

    static factory() {
        require('./DetailElement.scss');

        function detailElement() {
            return new DetailElementController();
        }

        detailElement().$inject = [];
        return detailElement;
    }
}

export default DetailElementController;
