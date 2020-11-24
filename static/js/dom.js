// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        this.loadStatuses();
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = "";
        let boardContainer = document.querySelector('div')
        boardContainer.classList.add('board-container', 'p-2')

        for(let board of boards){
            this.appendNewBoard(board)
        }
    },
    loadCards: function () {
        // retrieves cards and makes showCards called
        let boardBody = this.parentNode.parentNode;
        let boardColumns = boardBody.querySelector(".board-columns");
        let arrow = boardBody.querySelector(".fas");
        if (!boardColumns) {
            dom.addStatusColumns(boardBody);
            dataHandler.getCardsByBoardId(parseInt(boardBody.id.split("-")[1]), function (cards){
                if (cards) {
                    dom.showCards(boardBody, cards);
                }
            });
            arrow.classList.remove("fa-chevron-down");
            arrow.classList.add("fa-chevron-up");
        } else {
            boardColumns.remove();
            arrow.classList.remove("fa-chevron-up");
            arrow.classList.add("fa-chevron-down");
        }
    },
    showCards: function (board, cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for(let card of cards) {
            let column = board.querySelector(`[data-status="${card["status_id"]}"]`);
            let newCard = "";
            console.log(cards)
            newCard += `
                <div class="card" ondragstart="dataHandler.dragStartHandler()" 
                                  ondragend="dataHandler.dragEndHandler()"
                                  draggable="true">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title" data-cardId="${card['id']}">${card['title']}</div>
                </div>
                `;
            column.insertAdjacentHTML('beforeend', newCard);
        }
    },
    // here comes more features
    loadStatuses: function (){
        dataHandler.getStatuses(function (statuses) {
        });
    },
    addStatusColumns: function (boardBody) {
        let columnList = "";
        for(let column of dataHandler._data['statuses']) {
            columnList += `
                <div class="board-column" ondragenter="dataHandler.dropZoneEnterHandler()"
                                          ondragleave="dataHandler.dropZoneLeaveHandler()"
                                          ondragover="dataHandler.dropZoneOverHandler()"
                                          ondrop="dataHandler.dropZoneDropHandler()">
                    <div class="board-column-title" data-status="${column['title']}">${column['title']}</div>
                    <div class="board-column-content">
                    </div>
                </div>
                `;
        }
        let boardId = boardBody.id;
        const outHtml = `
            <div class="board-columns" id="collapse${boardId}" class="collapse" aria-labelledby="heading${boardId}" data-parent="board-#${boardId}">
                ${columnList}
            </div>
            `;
        boardBody.insertAdjacentHTML('beforeend', outHtml);
    },
    addClick: function () {
        document.querySelector('#new_submit').addEventListener('click', () => {
            dataHandler.createNewBoard(dom.getNewBoard(), (board) =>this.appendNewBoard(board))
        })
    },
    getNewBoard: function () {
        const title = document.querySelector('#board_title').value;
        return {title}
    },
    appendNewBoard: function (board) {
        const container = document.querySelector('.board-container')
        let boardList = `
            <section class="board" id="board-${board.id}">
            <div class="board-header justify-content-between" id="heading${board.id}">
                <span class="board-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button class="data-toggle" data-boardContent="${board.id}" data-toggle="collapse" data-target="#collapse${board.id}" aria-expanded="true" aria-controls="collapse${board.id}">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            </section>
            `;
        container.insertAdjacentHTML("beforeend", boardList);
        document.querySelector(`[data-boardContent="${board.id}"]`).addEventListener("click", this.loadCards);

    }
};
