//@author hcadavid

apimock = (function () {

    var mockdata = [];

    mockdata["johnconnor"] = [
        { author: "johnconnor", "points": [{ "x": 150, "y": 120 }, { "x": 215, "y": 115 }], "name": "house" },
        { author: "johnconnor", "points": [{ "x": 340, "y": 240 }, { "x": 15, "y": 215 }], "name": "gear" }
    ];
    mockdata["maryweyland"] = [
        { author: "maryweyland", "points": [{ "x": 140, "y": 140 }, { "x": 115, "y": 115 }], "name": "house2" },
        { author: "maryweyland", "points": [{ "x": 140, "y": 140 }, { "x": 115, "y": 115 }], "name": "gear2" }
    ];

    // Nuevos autores y planos
    mockdata["tonystark"] = [
        {
            author: "tonystark", "points": [
                { "x": 50, "y": 50 },
                { "x": 150, "y": 50 },
                { "x": 150, "y": 100 },
                { "x": 100, "y": 150 },
                { "x": 50, "y": 100 },
                { "x": 50, "y": 50 }
            ], "name": "estandarte"
        },
        {
            author: "tonystark", "points": [
                { "x": 100, "y": 200 },
                { "x": 200, "y": 200 },
                { "x": 200, "y": 300 },
                { "x": 100, "y": 300 },
                { "x": 100, "y": 200 }
            ], "name": "cuadrado"
        }
    ];

    mockdata["brucewayne"] = [
        {
            author: "brucewayne", "points": [
                { "x": 75, "y": 75 },
                { "x": 200, "y": 75 },
                { "x": 200, "y": 150 },
                { "x": 75, "y": 150 },
                { "x": 75, "y": 75 }
            ], "name": "Rectangulo"
        },
        {
            author: "brucewayne", "points": [
                { "x": 150, "y": 50 },
                { "x": 250, "y": 50 },
                { "x": 250, "y": 150 },
                { "x": 200, "y": 200 },
                { "x": 150, "y": 150 },
                { "x": 150, "y": 50 }
            ], "name": "estandarte"
        }
    ];

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            callback(
                mockdata[authname]
            );
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            callback(
                mockdata[authname].find(function (e) { return e.name === bpname })
            );
        }
    }

})();

/*
Example of use:
var fun = function (list) {
    console.info(list);
}

apimock.getBlueprintsByAuthor("johnconnor", fun);
apimock.getBlueprintsByNameAndAuthor("johnconnor", "house", fun);
*/

