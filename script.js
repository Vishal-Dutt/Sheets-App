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
let cellData = {
    "Sheet1": {}
};

let save = true;

let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastlyAddedSheet = 1;

// Default Properties of Each Cell In Sheet
let defaultProperties = {
    "font-family": "Noto Sans",
    "font-size": 14,
    "text": "",
    "bold": false,
    "italic": false,
    "underlined": false,
    "alignment": "left",
    "color": "#444",
    "bgcolor": "#fff"
};


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
    // Add selected class to the selected cell
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
});

$(".input-cell").blur(function (e) {
    $(this).attr("contenteditable", "false");
    updateCellData("text", $(this).text());
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
    // Cell Data Structure in the object format
    // console.log(cellData);
    // Structure of cell Data
    // { Sheet1: { … } }
    // Sheet1:
    // 2:
    // 2:
    // alignment: "center"
    // bgcolor: "#2980B9"
    // bold: true
    // color: "#ECF0F1"
    // font - family: "Impact"
    // font - size: 24
    // italic: true
    // text: "TextTyped"
    // underlined: true
    // __proto__: Object
    // __proto__: Object
    // __proto__: Object
    // __proto__: Object
    // We are passing reference because we did not updated any cell data
    let data;
    if (cellData[selectedSheet][rowId - 1] && cellData[selectedSheet][rowId - 1][colId - 1]) {
        data = cellData[selectedSheet][rowId - 1][colId - 1];
    } else {
        data = defaultProperties;
    }
    // console.log(data);
    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    // if (data.bold) {
    //     $("#bold").addClass("selected");
    // } else {
    //     $("#bold").removeClass("selected");
    // }
    addRemoveSelectFromFontStyle(data, "bold");
    addRemoveSelectFromFontStyle(data, "italic");
    addRemoveSelectFromFontStyle(data, "underlined");
    $("#fill-color").css("border-bottom", `4px solid ${data.bgcolor}`);
    $("#text-color").css("border-bottom", `4px solid ${data.color}`);
    $("#font-family").val(data["font-family"]);
    $("#font-size").val(data["font-size"]);
    $("#font-family").css("font-family", data["font-family"]);
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
    // $(".input-cell.selected").each(function (index, data) {
    //     // The data will print this
    //     // console.log(data);
    //     let [rowId, colId] = getRowCol(data);
    //     cellData[rowId - 1][colId - 1].alignment = alignment;
    // });
    updateCellData("alignment", alignment);
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
        // $(".input-cell.selected").each(function (index, data) {
        //     let [rowId, colId] = getRowCol(data);
        //     cellData[rowId - 1][colId - 1][property] = false;
        //     //[property] act as a variable
        // });
        updateCellData(property, false);
    } else {
        $(ele).addClass("selected");
        $(".input-cell.selected").css(key, value);
        // $(".input-cell.selected").each(function (index, data) {
        //     let [rowId, colId] = getRowCol(data);
        //     cellData[rowId - 1][colId - 1][property] = true;
        // });
        updateCellData(property, true);
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
                // $(".input-cell.selected").each((index, data) => {
                //     let [rowId, colId] = getRowCol(data);
                //     cellData[rowId - 1][colId - 1].bgcolor = this.color;
                // });
                updateCellData("bgcolor", this.color);
            }
            if ($(this.element.children()[1]).attr("id") == "text-color") {
                $(".input-cell.selected").css("color", this.color);
                $("#text-color").css("border-bottom", `4px solid ${this.color}`);
                // $(".input-cell.selected").each((index, data) => {
                //     let [rowId, colId] = getRowCol(data);
                //     cellData[rowId - 1][colId - 1].color = this.color;
                // });
                updateCellData("color", this.color);
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

// Change Font family and font size 
$(".menu-selector").change(function (e) {
    let value = $(this).val();
    // console.log(value);
    let key = $(this).attr("id");
    if (key == "font-family") {
        $("#font-family").css(key, value);
    }
    // console.log(typeof(value));
    // isNaN --> if a string is passed to the isNaN is convertable to number return false and returns true if it is not convertable to number
    if (!isNaN(value)) {
        value = parseInt(value);
    }

    $(".input-cell.selected").css(key, value);
    // $(".input-cell.selected").each((index, data) => {
    //     let [rowId, colId] = getRowCol(data);
    //     cellData[rowId - 1][colId - 1][key] = value;
    // });
    updateCellData(key, value);
});

function updateCellData(property, value) {
    let currCellData = JSON.stringify(cellData);
    if (value != defaultProperties[property]) {
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = getRowCol(data);
            if (cellData[selectedSheet][rowId - 1] == undefined) {
                cellData[selectedSheet][rowId - 1] = {};
                cellData[selectedSheet][rowId - 1][colId - 1] = { ...defaultProperties };
                // ... Means Sparese of an object or Sparse Array 
                // Creates an copy of object ans trans the copy of the object instead of reference of the object
                cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
            } else {
                if (cellData[selectedSheet][rowId - 1][colId - 1] == undefined) {
                    cellData[selectedSheet][rowId - 1][colId - 1] = { ...defaultProperties };
                    cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
                } else {
                    cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
                }
            }
        });
    } else {
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = getRowCol(data);
            if (cellData[selectedSheet][rowId - 1] && cellData[selectedSheet][rowId - 1][colId - 1]) {
                cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
                if (JSON.stringify(cellData[selectedSheet][rowId - 1][colId - 1]) == JSON.stringify(defaultProperties)) {
                    delete cellData[selectedSheet][rowId - 1][colId - 1];
                }
                // Delete Rows if there is no column keys in the entire row
                // Object.keys gives the keys 
                // using Object.keys the object is converted into the array as we cannot use .lenght function on objects
                if (Object.keys(cellData[selectedSheet][rowId - 1]).length == 0) {
                    // Object.keys will give the rows keys
                    delete cellData[selectedSheet][rowId - 1];
                }
            }
        });
    }
    // Check cell data if saved or not
    if (save && currCellData != JSON.stringify(cellData)) {
        save = false;
    }
}

// Remove context rename delete modal when we click 
$(".container").click(function (e) {
    $(".sheet-options-modal").remove();
})

// Add Sheet Events
function addSheetEvents() {
    // Binds the sheet tab to the context menu .on can also be use in place of .bind
    $(".sheet-tab.selected").on("contextmenu", function (e) {
        // console.log("hello");
        // preventDefault stops the opening of the context menu on righ click
        e.preventDefault();
        // if (!$(this).hasClass("selecedted")) {
        //     $(".sheet-tab.selected").removeClass("selected");
        //     $(this).addClass("selected");
        //     selectSheet();
        // }
        selectSheet(this);
        // Rename Modal
        $(".sheet-options-modal").remove();
        let modal = $(`    <div class="sheet-options-modal">
                    <div class = "option sheet-rename">Rename</div>
                    <div class = "option sheet-delete">Delete</div>
                </div>`);
        // console.log(e);
        // e give xposition and yposition
        modal.css({ "left": e.pageX });
        $(".container").append(modal);

        // Sheet Rename Modal
        $(".sheet-rename").click(function (e) {
            let renameModal = $(`<div class="sheet-modal-parent">
                                    <div class="sheet-rename-modal">
                                        <div class="sheet-modal-title">Rename Sheet</div>
                                        <div class="sheet-modal-input-container">
                                            <span class="sheet-modal-input-title">Rename Sheet to:</span>
                                            <input class="sheet-modal-input" type="text" />
                                        </div>
                                        <div class="sheet-modal-confirmation">
                                            <div class="button yes-button">OK</div>
                                            <div class="button no-button">Cancel</div>
                                        </div>
                                    </div>
                                </div>`);
            $(".container").append(renameModal);
            // focus on rename modal input 
            $(".sheet-modal-input").focus();
            $(".no-button").click(function (e) {
                $(".sheet-modal-parent").remove();
            });
            $(".yes-button").click(function (e) {
                renameSheet();
            });
            // Rename the sheet on pressing enter
            $(".sheet-modal-input").keypress(function (e) {
                if (e.key == "Enter") {
                    renameSheet();
                }
            })
        });

        // Delete sheet on delete
        $(".sheet-delete").click(function (e) {
            if (totalSheets > 1) {
                // <div class="sheet-modal-title">${$(".sheet-tab.selected").text()}</div>
                let deleteModal = $(`<div class="sheet-modal-parent">
                        <div class="sheet-delete-modal">
                            <div class="sheet-modal-title">${selectedSheet}</div>
                            <div class="sheet-modal-detail-container">
                                <span class="sheet-modal-detail-title">Are you sure?</span>
                            </div>
                            <div class="sheet-modal-confirmation">
                                <div class="button yes-button">
                                    <div class="material-icons delete-icon">delete</div>
                                    Delete
                                </div>
                                <div class="button no-button">Cancel</div>
                            </div>
                        </div>
                    </div>`);
                $(".container").append(deleteModal);

                $(".no-button").click(function (e) {
                    $(".sheet-modal-parent").remove();
                });

                $(".yes-button").click(function (e) {
                    // console.log(Object.keys(cellData));
                    deleteSheet();
                });

            } else {
                // Make Not Possilbe Delete Modal
                alert("Not Possible");
            }
        })
    });

    // fucntion will get bind to sheet 1 only
    $(".sheet-tab.selected").click(function (e) {
        // emptyPreviousSheet();
        // // Currently selected sheet will we selected
        // selectedSheet = $(this).text();
        // loadCurrentSheet();
        // The selected sheet does not have selected sheet event
        // if (!$(this).hasClass("selecedted")) {
        //     $(".sheet-tab.selected").removeClass("selected");
        //     $(this).addClass("selected");
        //     selectSheet();
        // }
        selectSheet(this);
    });
}

addSheetEvents();
// EVENTS GET BIND WITH ELEMENT NOT WITH CLASSES
// focusout

// Add new Sheet 
$(".add-sheet").click(function (e) {
    save = false;
    lastlyAddedSheet++;
    totalSheets++;
    cellData[`Sheet${lastlyAddedSheet}`] = {};
    // Remove selected class from the previous sheet
    $(".sheet-tab.selected").removeClass("selected");
    // Add new sheet to the sheet tab conatiner and make it selected
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">Sheet${lastlyAddedSheet}</div>`);
    selectSheet();
    addSheetEvents();
    $(".sheet-tab.selected")[0].scrollIntoView();
});


// Select Sheet first empty the previous sheet the make
function selectSheet(ele) {
    if (ele && !$(ele).hasClass("selected")) {
        $(".sheet-tab.selected").removeClass("selected");
        $(ele).addClass("selected");
    }
    emptyPreviousSheet();
    // Currently Selected Sheet gets Selected
    selectedSheet = $(".sheet-tab.selected").text();
    loadCurrentSheet();
    $("#row-1-col-1").click();
}


// Function will empty the previous sheet wheh clicked on other sheet
function emptyPreviousSheet() {
    let data = cellData[selectedSheet];
    // Gives rows in which changes are done
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
        // console.log(rowKeys);
        let rowId = parseInt(i);
        let colKeys = Object.keys(data[rowId]);
        for (let j of colKeys) {
            // Here i and j are string 
            let colId = parseInt(j);
            let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);
            cell.text("");
            cell.css({
                "font-family": "NotoSans",
                "font-size": 14,
                "background-color": "#fff",
                "color": "#444",
                "font-weight": "",
                "font-style": "",
                "text-decoration": "",
                "text-align": "left"
            });
        }
    }
}

// Fucntion to load the current sheet data

function loadCurrentSheet() {
    let data = cellData[selectedSheet];
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
        let rowId = parseInt(i);
        let colKeys = Object.keys(data[rowId]);
        for (let j of colKeys) {
            let colId = parseInt(j);
            let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);
            cell.text(data[rowId][colId].text);
            cell.css({
                "font-family": data[rowId][colId]["font-family"],
                "font-size": data[rowId][colId]["font-size"],
                "background-color": data[rowId][colId]["bgcolor"],
                "color": data[rowId][colId].color,
                "font-weight": data[rowId][colId].bold ? "bold" : "",
                "font-style": data[rowId][colId].italic ? "italic" : "",
                "text-decoration": data[rowId][colId].underlined ? "underline" : "",
                "text-align": data[rowId][colId].alignment
            });
        }
    }
}

// Fucntion to Rename the Sheet 
function renameSheet() {
    // Get the new sheet name
    let newSheetName = $(".sheet-modal-input").val();
    // if newSheetName typed is not empty and the name of the sheet is not in the celldata
    // Traverse on the cell data and ceate a new ccel data to updata the renamed sheet and
    // then point the newCellData to the cellData
    if (newSheetName && !Object.keys(cellData).includes(newSheetName)) {
        save = false;
        let newCellData = {};
        for (let i of Object.keys(cellData)) {
            if (i == selectedSheet) {
                newCellData[newSheetName] = cellData[selectedSheet];
            } else {
                newCellData[i] = cellData[i];
            }
        }

        cellData = newCellData;
        selectedSheet = newSheetName;
        // linked list created new node and deleted the old node
        // cellData[selectedSheet] is pointing to a sheet data in cellData
        // A new pointer is creted withe new sheetmane cellData[newSheetName].
        // Now points this pointer to the same referenced cellData[selectedSheet]
        // delete the previous cellData[selectedSheet] pointer
        // and updates the selectedSheet = newSheetName
        // and now deleted
        // cellData[newSheetName] = cellData[selectedSheet];
        // delete cellData[selectedSheet];
        // selectedSheet = newSheetName;
        // updates the entered text to the selected sheet
        $(".sheet-tab.selected").text(newSheetName);
        // remove the rename modal on clicking to ok
        $(".sheet-modal-parent").remove();
    } else {
        $(".rename-error").remove();
        // Give error if sheet name is empty and sheet name already in the sheet data
        $(".sheet-modal-input-container").append(`
            <div class="rename-error"> Sheet Name is not valid or Sheet already exists! </div>
        `)
    }
}

// function to delete the Sheet1
function deleteSheet() {
    $(".sheet-modal-parent").remove();
    let sheetIndex = Object.keys(cellData).indexOf(selectedSheet);
    let currSelectedSheet = $(".sheet-tab.selected");
    // find index of the selected sheet
    if (sheetIndex == 0) {
        // Select the next sheet
        // as sheets are sotred udner div so .next give next subling of the current div
        selectSheet(currSelectedSheet.next()[0]);
    } else {
        // selecte previous sheet
        selectSheet(currSelectedSheet.prev()[0]);
    }
    // deletes sheet from cellData
    delete cellData[currSelectedSheet.text()];
    // delete sheet from 
    currSelectedSheet.remove();
    totalSheets--;
}

// Left Scroller and right scroller
$(".left-scroller,.right-scroller").click(function (e) {
    let keysArray = Object.keys(cellData);
    let selectedSheetIndex = keysArray.indexOf(selectedSheet);
    if (selectedSheetIndex != 0 && $(this).text() == "arrow_left") {
        selectSheet($(".sheet-tab.selected").prev()[0]);
    } else if (selectedSheetIndex != (keysArray.length - 1) && $(this).text() == "arrow_right") {
        selectSheet($(".sheet-tab.selected").next()[0]);
    }
    // .scrollIntoView() is javascript method by which elemetns get into view automatically
    $(".sheet-tab.selected")[0].scrollIntoView();
});

// Right Scroller
// $(".right-scroller").click(function(e){
//     let keysArray = Object.keys(cellData);
//     let selectedSheetIndex = keysArray.indexOf(selectedSheet);
//     if(selectedSheetIndex!= (keysArray.length-1)){
//         selectSheet($(".sheet-tab.selected").next()[0]);
//         $(".sheet-tab.selected")[0].scrollIntoView();
//     }
// });

// Open File modal on clicking on file menu
$("#menu-file").click(function (e) {
    let fileModal = $(` <div class="file-modal">
                            <div class="file-options-modal">
                                <div class="close">
                                    <div class="material-icons close-icon">arrow_circle_down</div>
                                    <div>Close</div>
                                </div>
                                <div class="new">
                                    <div class="material-icons new-icon">insert_drive_file</div>
                                    <div>New</div>
                                </div>
                                <div class="open">
                                    <div class="material-icons open-icon">folder_open</div>
                                    <div>Open</div>
                                </div>
                                <div class="save">
                                    <div class="material-icons save-icon">save</div>
                                    <div>Save</div>
                                </div>
                            </div>
                            <div class="file-recent-modal"></div>
                            <div class="file-transparent"></div>
                        </div>`);
    $(".container").append(fileModal);
    fileModal.animate({
        width: "100vw"
    }, 300);
    // Close file modal when click on close button and also while click on transparnt modal
    $(".close,.file-transparent,.new,.save").click(function (e) {
        fileModal.animate({
            width: "0vw"
        }, 300);
        setTimeout(() => {
            fileModal.remove();
        }, 250);
    });
    // $(".file-transparent").click(function(e){
    //     console.log("file transparem div");
    // });
    // $(".close").click(console.log("1"));

    // Add New Sheet when click on new 
    $(".new").click(function (e) {
        // Data the current excel book data is empty then simply remove the excel book and create the new excel file
        if (save) {
            newFile();
        }
        else {
            $(".container").append(`<div class="sheet-modal-parent">
                                        <div class="sheet-delete-modal">
                                            <div class="sheet-modal-title">${$(".title").text()}</div>
                                            <div class="sheet-modal-detail-container">
                                                <span class="sheet-modal-detail-title">Do you Want to save Changes? </span>
                                            </div>
                                            <div class="sheet-modal-confirmation">
                                                <div class="button yes-button">
                                                    Yes
                                                </div>
                                                <div class="button no-button">No</div>
                                            </div>
                                        </div>
                                    </div>`);
            $(".yes-button").click(function (e) {
                saveFile();
                // $(".sheet-modal-parent").remove();
                // newFile();
            });
            $(".no-button,.yes-button").click(function (e) {
                $(".sheet-modal-parent").remove();
                newFile();
            });
        }
    });
    $(".save").click(function (e) {
        if(!save){
            saveFile();
        }
    });
});

// 
function newFile() {
    emptyPreviousSheet();
    cellData = { "Sheet1": {} };
    $(".sheet-tab").remove();
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">Sheet1</div>`);
    // add sheet events to the new added sheet as it does not have any events attached to it
    addSheetEvents();
    selectedSheet = "Sheet1";
    totalSheets = 1;
    lastlyAddedSheet = 1;
    $(".title").text("Excel - Book");
    $("#row-1-col-1").click();
}

// Steps to create a new file function
// On click new file first show only one sheet in the sheet tab 
// Emply all the cells in the sheet with default properties
// Sheet Title Excel Book
// Cell Data sheet 1 empty sheet
// emptyprevioussheet funtion empty the input cells in the sheet
// cellData = { "Sheet1": {} }; empty the cell data
// the below three line empty the sheet tab and create a new sheet tab with sheet 1
// and adds the sheet events to the newly created sheet
// select the sheet 1 and change the title of the new sheet and click on the first cell in the selected sheet
// We run new file only when the data is saved or not
// updatecell , rename , newsheet are the points where the cell data or sheet data changes
// if yes the call the save fucntion and save the sheet data it no is clicked then simpy remove the modal


// fucntion to save the file
function saveFile() {

    $(".container").append(` <div class="sheet-modal-parent">
                                <div class="sheet-rename-modal">
                                    <div class="sheet-modal-title">Save File</div>
                                    <div class="sheet-modal-input-container">
                                        <span class="sheet-modal-input-title">File Name:</span>
                                        <input class="sheet-modal-input" value="${$(".title").text()}" type="text" />
                                    </div>
                                    <div class="sheet-modal-confirmation">
                                        <div class="button yes-button">Save</div>
                                        <div class="button no-button">Cancel</div>
                                    </div>
                                </div>
                            </div>`);
    $(".yes-button").click(function(e){
        $(".title").text($(".sheet-modal-input").val());
        // jquery click is not working 
        let a = document.createElement("a");
        a.href = `data:application/json,${encodeURIComponent(JSON.stringify(cellData))}`;
        // encodeURIComponent is used to ecode the url to unicode
        // encodeurl is import to download the file from the browser 
        // if encodeURIComponent is not applied the cell data is missed while downloading
        // a.href = `data:application/json,${JSON.stringify(cellData)}`;
        a.download = $(".title").text() + ".json";
        $(".container").append(a);
        a.click();
        a.remove();
        save=true;
    });
    $(".no-button,.yes-button").click(function (e) {
        $(".sheet-modal-parent").remove();
    });
}