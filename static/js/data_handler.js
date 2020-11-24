// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })
        })
            .then(response => response.json())
            .then(json_response => callback(json_response))
            .catch((error) => {
                console.log("Fetch error: " + error);
            });

    },
    init: function () {
    }
    ,
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data['cards'] = response;
            callback(response);
        });
        // the cards are retrieved and then the callback function is called with the cards
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post('/write-new-board', boardTitle, (response) => {
            this._data['boards'] = response;
            callback(response)
        });
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
    },
    dragStartHandler: function (e) {
        // setDropZonesHighlight();
        this.classList.add('dragged', 'drag-feedback');
        e.dataTransfer.setData('type/dragged-box', 'dragged')
    },
    dragEndHandler: function () {
        // setDropZonesHighlight(false)
        this.classList.remove('dragged');
    },
    dropZoneEnterHandler: function (e) {
        if (e.dataTransfer.types.includes('type/dragged-box')) {
            this.classList.add("over-zone");
            e.preventDefault();
        }
    },
    dropZoneLeaveHandler: function (e) {
        if (e.dataTransfer.types.includes('type/dragged-box') &&
            e.relatedTarget !== null &&
            e.currentTarget !== e.relatedTarget.closest('.card-slot:empty')) {
            this.classList.remove("over-zone");
        }
    },
    dropZoneOverHandler: function (e) {
        e.preventDefault()
        // if (e.dataTransfer.types.includes('type/dragged-box')) {
        //     e.preventDefault();
        // }
    },
    dropZoneDropHandler: function (e) {
        e.preventDefault();
        let draggedElement = document.querySelector('.dragged');
        if (e.target.classList.contains('active-zone') || e.target.classList.contains('mixed-cards')) {
            e.target.appendChild(draggedElement);
        }
        // here comes more features
    }
};
