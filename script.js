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
for(let i=1;i<=100;i++){
    let row = $(`<div class="cell-row"></div>`)
    for(let j=1;j<=100;j++){
        row.append(`<div id="row-${i}-col${j}" class="input-cell" contenteditable="false"></div>`);
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

$("#cells").scroll(function(e) {
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
});

// Function when user double click then the cell became contenteditable

$(".input-cell").dblclick(function(e) {
    $(this).attr("contenteditable", "true");
    $(this).focus();
});