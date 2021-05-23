// Perfect Scroll Bar
const ps = new PerfectScrollbar("#cells", {
    wheelspeed: 15,
    wheelPropagation: true
});

// Algortihm to all columns Name
for (let i = 1; i <= 100; i++) {
    let str = "";
    let n = i;
    while (n > 0) {
        let rem = n % 26;
        if (rem == 0) {
            str = "Z" + str;
            n = Math.floor(n / 26) - 1;
        } else {
            str = String.fromCharCode((rem - 1) + 65) + str;
            n = Math.floor(n / 26);
        }
    }
    $("#columns").append(`<div class="column-name">${str}</div>`);
    $("#rows").append(`<div class="row-name">${i}</div>`);
}

// Add Cells to the cell div
for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`)
    for (let j = 1; j <= 100; j++) {
        row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`);
    }
    $("#cells").append(row);
}

// columns scroll along with cell cell when we scroll cell
// .scroll is event it shows how manu time you have scroll
// $("#cells").scroll(function(e){
// console.log("hello");
// Left scroll
// console.log(this.scrollLeft);
// Scroll top
// console.log(this.scrollTop);
// $("#columns").scrollLeft(this.scrollLeft);
// $("#rows").scrollTop(this.scrollTop);
// this.scrollLeft and this.scrollTop states tha how scroll moves in x-axis and y-axis direction
// });

$("#cells").scroll(function (e) {
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
});

// Function when user double click then the cell became contenteditable

$(".input-cell").dblclick(function (e) {
    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
});

$(".input-cell").blur(function (e) {
    $(this).attr("contenteditable", "false");
});

// Click to select cell
// $(".input-cell").click(function(e){
//     $(".input-cell.selected").removeClass("selected");
//     $(this).addClass("selected");
// });
// $(".input-cell").click(function(e){
//     $(".input-cell.selected").removeClass("selected");
//     $(this).addClass("selected");
// });

// function to get row and column of the selected element
function getRowCol(ele) {
    let id = $(ele).attr("id");
    let idArray = id.split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
}

// fucntion to get top left bottom and right of the element
function getTopLeftBottomRightCell(rowId, colId) {
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    return [topCell, bottomCell, leftCell, rightCell];
}

// function to select the cells
$(".input-cell").click(function (e) {
    let [rowId, colId] = getRowCol(this);
    let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(rowId, colId);
    if ($(this).hasClass("selected") && e.ctrlKey) {
        unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    } else {
        selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    }
});


// Function to unselect cell 
function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if ($(ele).attr("contenteditable") == "false") {
        if ($(ele).hasClass("top-selected")) {
            topCell.removeClass("bottom-selected");
        }

        if ($(ele).hasClass("bottom-selected")) {
            bottomCell.removeClass("top-selected");
        }

        if ($(ele).hasClass("left-selected")) {
            leftCell.removeClass("right-selected");
        }

        if ($(ele).hasClass("right-selected")) {
            rightCell.removeClass("left-selected");
        }
        $(ele).removeClass("selected top-selected bottom-selected left-selected right-selected");
    }
}


// Top selected
// ele means current element
function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if (e.ctrlKey) {
        // Top Selected or Not
        let topSelected;
        if (topCell) {
            topSelected = topCell.hasClass("selected");
        }

        // bottom Selected or Not
        let bottomSelected;
        if (bottomCell) {
            bottomSelected = bottomCell.hasClass("selected");
        }

        // left Selected or Not
        let leftSelected;
        if (leftCell) {
            leftSelected = leftCell.hasClass("selected");
        }

        // right Selected or Not
        let rightSelected;
        if (rightCell) {
            rightSelected = rightCell.hasClass("selected");
        }


        if (topSelected) {
            $(ele).addClass("top-selected");
            topCell.addClass("bottom-selected");
        }

        if (bottomSelected) {
            $(ele).addClass("bottom-selected");
            bottomCell.addClass("top-selected");
        }

        if (leftSelected) {
            $(ele).addClass("left-selected");
            leftCell.addClass("right-selected");
        }

        if (rightSelected) {
            $(ele).addClass("right-selected");
            rightCell.addClass("left-selected");
        }

    } else {
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    }
    $(ele).addClass("selected");
}

// Select Cell Using Mouse Drag
// let startcellSelected = false;
// let startCell = {};
// let endCell = {};
// $(".input-cell").mousemove(function (e) {
//     e.preventDefault();
//     // console.log(e.buttons);
//     if (e.buttons == 1) {
//         $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
//         if (!startcellSelected) {
//             let [rowId, colId] = getRowCol(this);
//             startCell = { "rowId": rowId, "colId": colId };
//             startcellSelected = true;
//             // console.log(startCell);
//         } else {
//             let [rowId, colId] = getRowCol(this);
//             endCell = { "rowId": rowId, "colId": colId };
//             selectAllBetweenCells(startCell, endCell);
//         }
//         // console.log(startCell,endCell);
//     } else {
//         startcellSelected = false;
//     }
// })

// Select Cell using mouseenter function efficeint
let startcellSelected = false;
let startCell = {};
let endCell = {};
let scrollXRStarted = false;
let scrollXLStarted = false;
$(".input-cell").mousemove(function (e) {
    // e.pagex shows mouse position
    // console.log($(window).width());
    // console.log(e.pageX);
    // console.log(e.pageY);
    // console.log($(window).height());
    e.preventDefault();
    if (e.buttons == 1) {
        // Move scroll bar while selecting cells
        if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
            // scroll in x direction
            scrollXR();
        } else if (e.pageX < 10 && !scrollXLStarted) {
            scrollXL();
        }

        if (!startcellSelected) {
            let [rowId, colId] = getRowCol(this);
            startCell = { "rowId": rowId, "colId": colId };
            // The below line selects the start cell if we left click on the cell and move cursor slightly
            selectAllBetweenCells(startCell, startCell);
            startcellSelected = true;
        }
    } else {
        startcellSelected = false;
    }
});

$(".input-cell").mouseenter(function (e) {
    // console.log("hello");
    if (e.buttons == 1) {
        if (e.pageX < ($(window).width() - 10) && scrollXRStarted) {
            clearInterval(scrollXRInterval);
            scrollXRStarted = false;
        }

        if (e.pageX > 10 && scrollXLStarted) {
            clearInterval(scrollXLInterval);
            scrollXLStarted = false;
        }

        let [rowId, colId] = getRowCol(this);
        endCell = { "rowId": rowId, "colId": colId };
        selectAllBetweenCells(startCell, endCell);
    }
})

// $(".input-cell").mouseenter(function (e) {
//     if (e.buttons == 1) {
//         if (e.pageX < ($(window).width() - 100) && scrollXRStarted) {
//             clearInterval(scrollXRInterval);
//             scrollXRStarted = false;
//         }

//         if (e.pageX > 100 && scrollXLStarted) {
//             clearInterval(scrollXLInterval);
//             scrollXLStarted = false;
//         }
//         let [rowId, colId] = getRowCol(this);
//         endCell = { "rowId": rowId, "colId": colId };
//         selectAllBetweenCells(startCell, endCell);
//     }
// })


// Fucntion to traverse and select cells between start and end points
function selectAllBetweenCells(start, end) {
    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    for (let i = Math.min(start.rowId, end.rowId); i <= Math.max(start.rowId, end.rowId); i++) {
        for (let j = Math.min(start.colId, end.colId); j <= Math.max(start.colId, end.colId); j++) {
            let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(i, j);
            // console.log($(`#row-${i}-col-${j}`));
            // $(`#rwo-${i}-col-${j}`)[0] is equal to this // This will get the element 
            // $(`#row-${i}-col-${j}`) is equal to $(this)
            // $(this) is jquery object this is normal node
            selectCell($(`#row-${i}-col-${j}`)[0], { "ctrlKey": true }, topCell, bottomCell, leftCell, rightCell);
        }
    }
}

// Scroll in x-axis in right direction 
let scrollXRInterval;
function scrollXR() {
    scrollXRStarted = true;
    scrollXRInterval = setInterval(() => {
        $("#cells").scrollLeft($("#cells").scrollLeft() + 100);
    }, 100);
}


// Scroll x-axis in left direction
let scrollXLInterval;
function scrollXL() {
    scrollXLStarted = true;
    scrollXLInterval = setInterval(() => {
        $("#cells").scrollLeft($("#cells").scrollLeft() - 100);
    }, 100);
}

$(".data-container").mousemove(function (e) {
    e.preventDefault();
    if(e.buttons == 1){
        if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
            // scroll right
            scrollXR();
        } else if (e.pageX < 10 && !scrollXLStarted) {
            // scroll left
            scrollXL();
        }
    }
})

// This will celear interval in mouse clic is released
$(".data-container").mouseup(function (e) {
    clearInterval(scrollXRInterval);
    clearInterval(scrollXLInterval);
    scrollXRStarted = false;
    scrollXLStarted = false;
});