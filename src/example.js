"use strict";
exports.__esModule = true;
exports.getRandomColor = void 0;
var getRandomColor = function () {
    // list all hex characters in a string
    var letters = '0123456789ABCDEF';
    // Set up a string with the leading '#'
    var color = '#';
    // Assign the letters one-by-one until all 6 are assigned
    for (var i = 0; i < 6; i++) {
        // Get 6 randomly-selected character from the letters string
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
exports.getRandomColor = getRandomColor;
var NUMBER_OF_COLORS = 4;
var templateArray = new Array(NUMBER_OF_COLORS).fill(null);
// newArray.fill(null) // Very Object-Oriented (imperative expression)
var colorArray1 = templateArray.map(function (_item, _itemIndex, _origialArray) {
    return (exports.getRandomColor());
});
var colorArray2 = templateArray.map(exports.getRandomColor);
console.log(colorArray1);
console.log(colorArray2);
