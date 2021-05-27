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

// Cell Data Default Properties
let cellData = [];

// Add Cells to the cell div
for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`)
    let rowArray = [];
    for (let j = 1; j <= 100; j++) {
        row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`);
        rowArray.push({
            "font-family": "Noto Sans",
            "font-size": 14,
            "text": "",
            "bold": false,
            "italic": false,
            "underlined": false,
            "alignment": "left",
            "color": "#444",
            "bgcolor": "#fff"
        });
    }
    cellData.push(rowArray);
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
    // Add selected class to the selected cell
    $(this).addClass("selected");
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
    changeHeader(getRowCol(ele));
}

// This Function Removes the Selected class from the cell and add selected class 
// to the last aligned cell
// Two Way Alignment
function changeHeader([rowId, colId]) {
    let data = cellData[rowId - 1][colId - 1];
    // console.log(data);
    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    // if(data.bold){
    //     $("#bold").addClass("selected");
    // }else {
    //     $("#bold").removeClass("selected");
    // }
    addRemoveSelectFromFontStyle(data, "bold");
    addRemoveSelectFromFontStyle(data, "italic");
    addRemoveSelectFromFontStyle(data, "underlined");
    $("#fill-color").css("border-bottom", `4px solid ${data.bgcolor}`);
    $("#text-color").css("border-bottom", `4px solid ${data.color}`);
}

function addRemoveSelectFromFontStyle(data, property) {
    if (data[property]) {
        $(`#${property}`).addClass("selected");
    } else {
        $(`#${property}`).removeClass("selected");
    }
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
let count = 0;
let startcellSelected = false;
let startCell = {};
let endCell = {};
let scrollXRStarted = false;
let scrollXLStarted = false;
let scrollYBStarted = false;
let scrollYTStarted = false;
$(".input-cell").mousemove(function (e) {
    // e.pagex shows mouse position
    // console.log($(window).width());
    // console.log(e.pageX);
    // console.log(e.pageY);
    // console.log($(window).height());
    e.preventDefault();
    if (e.buttons == 1) {
        // Move scroll bar while selecting cells
        // if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
        //     // scroll in x direction
        //     scrollXR();
        // } else if (e.pageX < 10 && !scrollXLStarted) {
        //     scrollXL();
        // }

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

        if (e.pageY < ($(window).height() - 10) && scrollYBStarted) {
            clearInterval(scrollYBInterval);
            scrollYBStarted = false;
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

// scroll bottom
let scrollYBInterval;
function scrollYB() {
    scrollYBStarted = true;
    scrollYBInterval = setInterval(() => {
        $("#cells").scrollTop($("#cells").scrollTop() + 100);
    }, 100);
}

$(".data-container").mousemove(function (e) {
    e.preventDefault();
    if (e.buttons == 1) {
        if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
            // scroll right
            scrollXR();
        } else if (e.pageX < 10 && !scrollXLStarted) {
            // scroll left
            scrollXL();
        } else if (e.pageY > ($(window).height() - 10) && !scrollYBStarted) {
            scrollYB();
        }
    }
})

// This will celear interval in mouse clic is released
$(".data-container").mouseup(function (e) {
    clearInterval(scrollXRInterval);
    clearInterval(scrollXLInterval);
    clearInterval(scrollYBInterval);
    scrollXRStarted = false;
    scrollXLStarted = false;
    scrollYBStarted = false;
});

// Hightlights text alignt icons ans alignt items when selected
$(".alignment").click(function (e) {
    let alignment = $(this).attr("data-type");
    $(".alignment.selected").removeClass("selected");
    $(this).addClass("selected");
    $(".input-cell.selected").css("text-align", alignment);
    // Traversing on cells For each loop in jquery
    $(".input-cell.selected").each(function (index, data) {
        // The data will print this
        // console.log(data);
        let [rowId, colId] = getRowCol(data);
        cellData[rowId - 1][colId - 1].alignment = alignment;
    });
});

// Change Text to bold
$("#bold").click(function (e) {
    setStyle(this, 'bold', "font-weight", "bold");
});

// Change Text to italic 
$("#italic").click(function (e) {
    setStyle(this, "italic", "font-style", "italic");
});

// Underline The Text
$("#underlined").click(function (e) {
    setStyle(this, "underlined", "text-decoration", "underline");
});

// Fucntion to change the style of the text
function setStyle(ele, property, key, value) {
    if ($(ele).hasClass("selected")) {
        $(ele).removeClass("selected");
        $(".input-cell.selected").css(key, "");
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = getRowCol(data);
            cellData[rowId - 1][colId - 1][property] = false;
            //[property] act as a variable
        });
    } else {
        $(ele).addClass("selected");
        $(".input-cell.selected").css(key, value);
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = getRowCol(data);
            cellData[rowId - 1][colId - 1][property] = true;
        });
    }
}

//Color Picker
// When we click on the colorpick icon the the .colorPick function get called two times 
$(".pick-color").colorPick({
    'initialColor': "#abcd",
    'allowRecent': true,
    'recentMax': 5,
    'allowCustomColor': true,
    'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
    'onColorSelected': function () {
        //   this.element.css({'backgroundColor': this.color, 'color': this.color});
        //   Defalut color will print #ABCD two times in console
        //   console.log(this.color);
        //   console.log(this.element);
        //   this.element represents the jquery element
        if (this.color != "#ABCD") {
            // console.log(this.color);
            // Current Element
            // if we use [] on this then jquery wrapper removes automatically from this so we have to add wrapper by usng again $ on this
            // this.element will give current div and this.element.children() will give children to the div
            // console.log(this.element.children());
            // $((this.element.children()[1]).attr("id"));
            // Get id of the image selected 
            // console.log($(this.element.children()[1]).attr("id"));
            // this.element represents the div of the image
            if ($(this.element.children()[1]).attr("id") == "fill-color") {
                $(".input-cell.selected").css("background-color", this.color);
                $("#fill-color").css("border-bottom", `4px solid ${this.color}`);
                $(".input-cell.selected").each((index, data) => {
                    let [rowId, colId] = getRowCol(data);
                    cellData[rowId - 1][colId - 1].bgcolor = this.color;
                });
            }
            if ($(this.element.children()[1]).attr("id") == "text-color") {
                $(".input-cell.selected").css("color", this.color);
                $("#text-color").css("border-bottom", `4px solid ${this.color}`);
                $(".input-cell.selected").each((index, data) => {
                    let [rowId, colId] = getRowCol(data);
                    cellData[rowId - 1][colId - 1].color = this.color;
                });
            }
        }
    }
});

// If we click on the fill color the below code will click on the parent after 10sec i.e. click on the div
$("#fill-color").click(function (e) {
    setTimeout(() => {
        $(this).parent().click();
    }, 10)
});

$("#text-color").click(function (e) {
    setTimeout(() => {
        $(this).parent().click();
    }, 10)
});

// Arrow fucntion Both this is same 
// If there is no parent fucntion the the this will represent the this of the other parent ot this of point to the golbal this (window).
// $("#text-color").click(function (e) {
//     console.log(this);
//     setTimeout(() => {
//         // Below this will point to the outher this of the function
//         // The value of outer this and inner this are same
//         console.log(this);
//         $(this).parent().click();
//     }, 10)
// });

// Both this are dfferent
// $("#text-color").click(function (e) {
//     console.log(this);
//     setTimeout(function () {
//         console.log(this);
//         // The below this will point to the setTimeout fucntion
//         $(this).parent().click();
//     }, 10)
// });