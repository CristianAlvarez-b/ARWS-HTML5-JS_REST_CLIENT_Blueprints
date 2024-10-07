// Selecciona entre apimock y apiclient
var api = apiclient; // Cambiar entre apimock y apiclient según sea necesario

var app = (function () {

    // Estado privado del módulo
    var authorName = '';
    var blueprintsList = [];

    // Operación pública para cambiar el autor seleccionado
    var setAuthorName = function (newAuthorName) {
        authorName = newAuthorName;
    };

    // Operación pública para actualizar el listado de planos del autor
    var updateBlueprintsList = function (author) {
        setAuthorName(author);

        // Verificar si se ha ingresado un autor
        if (!authorName) {
            $("#blueprintsTable tbody").empty();
            $("#totalPoints").text(0);
            $("#selectedAuthor").text("No author selected"); // Cambia a inglés
            return; // Salir de la función
        }

        api.getBlueprintsByAuthor(authorName, function (blueprints) {
            if (blueprints) {
                // Actualizar la tabla de planos
                blueprintsList = blueprints.map(function (blueprint) {
                    return {name: blueprint.name, points: blueprint.points.length};
                });

                // Limpiar la tabla antes de llenarla
                $("#blueprintsTable tbody").empty();

                // Añadir cada plano a la tabla
                blueprintsList.map(function (blueprint) {
                    var row = `<tr>
                        <td>${blueprint.name}</td>
                        <td>${blueprint.points}</td>
                        <td><button class="btn btn-primary" onclick="app.drawBlueprint('${authorName}', '${blueprint.name}')">Open</button></td>
                    </tr>`;
                    $("#blueprintsTable tbody").append(row);
                });

                // Calcular el total de puntos
                var totalPoints = blueprints.reduce(function (total, blueprint) {
                    return total + blueprint.points.length;
                }, 0);

                // Actualizar el campo del total de puntos
                $("#totalPoints").text(totalPoints);
                $("#selectedAuthor").text(authorName + "'s blueprints");
            } else {
                $("#blueprintsTable tbody").empty();
                $("#totalPoints").text(0);
                $("#selectedAuthor").text("Author not found"); // Cambia a inglés
            }
        });
    };

    // Operación pública para dibujar un plano
    var drawBlueprint = function (author, blueprintName) {
        api.getBlueprintsByNameAndAuthor(author, blueprintName, function (blueprint) {
            if (blueprint) {
                var canvas = document.getElementById("blueprintCanvas");
                var ctx = canvas.getContext("2d");

                // Limpiar el canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Dibujar los puntos del plano
                var points = blueprint.points;
                if (points.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    for (var i = 1; i < points.length; i++) {
                        ctx.lineTo(points[i].x, points[i].y);
                    }
                    ctx.stroke();
                }

                // Actualizar el campo del plano que se está dibujando
                $("#currentBlueprint").text("Current blueprint: " + blueprintName);
            } else {
                console.error("No se pudo dibujar el plano");
            }
        });
    };

    // Registrar eventos después de que el DOM esté listo
    var init = function () {
        $(document).ready(function () {
            $("#getBlueprints").click(function () {
                var author = $("#author").val();
                updateBlueprintsList(author);
            });
        });
    };

    return {
        init: init,
        updateBlueprintsList: updateBlueprintsList,
        drawBlueprint: drawBlueprint
    };

})();

// Inicializar el módulo al cargar la página
app.init();
