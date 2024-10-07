// Selecciona entre apimock y apiclient
var api = apiclient; // Cambiar entre apimock y apiclient según sea necesario

var app = (function () {
    // Estado privado del módulo
    var authorName = '';
    var blueprintsList = [];
    var points = []; // Arreglo para almacenar los puntos capturados
    var currentBlueprintName = ''; // Nombre del plano actual

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
                    return { name: blueprint.name, points: blueprint.points.length };
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
        currentBlueprintName = blueprintName; // Guardamos el nombre del plano actual
        points = []; // Reiniciar puntos cuando se dibuja un nuevo plano
        api.getBlueprintsByNameAndAuthor(author, blueprintName, function (blueprint) {
            if (blueprint) {
                var canvas = document.getElementById("blueprintCanvas");
                var ctx = canvas.getContext("2d");

                // Limpiar el canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Dibujar los puntos del plano
                var blueprintPoints = blueprint.points; // Usar variable diferente para evitar conflicto
                if (blueprintPoints.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(blueprintPoints[0].x, blueprintPoints[0].y);
                    for (var i = 1; i < blueprintPoints.length; i++) {
                        ctx.lineTo(blueprintPoints[i].x, blueprintPoints[i].y);
                    }
                    ctx.stroke();
                }

                // Actualizar el campo del plano que se está dibujando
                $("#selectedBlueprint").text("Current blueprint: " + blueprintName);
                points = blueprintPoints.slice(); // Guardar los puntos del blueprint actual en la variable global

                // Habilitar el canvas para continuar dibujando
                initCanvasEvents();
            } else {
                console.error("No se pudo dibujar el plano");
            }
        });
    };

    // Función para guardar/actualizar el plano
    var saveOrUpdateBlueprint = function () {
        if (!currentBlueprintName || points.length === 0) {
            alert("No blueprint selected or no points to save.");
            return;
        }

        // Crear el objeto blueprint que se enviará a la API
        var blueprintToUpdate = {
            author: authorName,
            points: points.map(point => ({ x: Math.round(point.x), y: Math.round(point.y) })), // Asegúrate de que los puntos sean enteros
            name: currentBlueprintName
        };

        // Hacer el PUT a la API
        api.updateBlueprint(blueprintToUpdate, function(response) {
            if (response) {
                console.log(response); // Manejar la respuesta del servidor
                // Hacer un GET para obtener todos los planos de nuevo
                api.getBlueprintsByAuthor(authorName, function (blueprints) {
                    if (blueprints) {
                        // Actualizar la tabla de planos
                        updateBlueprintsList(authorName);
                        // Calcular el total de puntos
                        var totalPoints = blueprints.reduce(function (total, blueprint) {
                            return total + blueprint.points.length;
                        }, 0);
                        $("#totalPoints").text(totalPoints);
                    } else {
                        console.error("No se pudo obtener la lista de planos después de la actualización.");
                    }
                });
            } else {
                alert("Error al actualizar el plano.");
            }
        });
    };

    var createNewBlueprint = function () {
            // Verificar si authorName está vacío
            if (!authorName) {
                alert("Author name is required to create a new blueprint.");
                return; // Salir de la función si no hay autor
            }

            // Solicitar el nombre del nuevo blueprint
            var newBlueprintName = prompt("Please enter the name of the new blueprint:");

            // Validar el nombre
            if (!newBlueprintName) {
                alert("Blueprint name is required.");
                return; // Salir si no hay nombre
            }

            // Asignar el nuevo nombre de blueprint
            currentBlueprintName = newBlueprintName; // Asignar el nombre del nuevo blueprint
            points = []; // Reiniciar puntos para el nuevo blueprint

            // Habilitar la funcionalidad de dibujo en el canvas
            $("#selectedBlueprint").text("Current blueprint: " + newBlueprintName); // Mostrar el nombre del nuevo blueprint

            // Iniciar el evento de dibujo
            initCanvasEvents(); // Mantener el canvas habilitado para dibujar
        };

    var initCanvasEvents = function () {
        var canvas = document.getElementById("blueprintCanvas");

        // Manejar eventos de mouse/touch
        if (window.PointerEvent) {
            canvas.addEventListener("pointerdown", handleCanvasClick);
        } else {
            canvas.addEventListener("mousedown", handleCanvasClick);
        }
    };

    // Función para manejar los clics en el canvas
    var handleCanvasClick = function (event) {
        if (currentBlueprintName) { // Asegurarse de que hay un blueprint seleccionado
            var rect = event.target.getBoundingClientRect();
            var x = Math.round(event.clientX - rect.left); // Obtener coordenadas del canvas y convertir a entero
            var y = Math.round(event.clientY - rect.top); // Convertir a entero

            // Agregar el nuevo punto al arreglo
            points.push({ x: x, y: y });

            // Repintar el canvas
            repaintedCanvas();
        }
    };

    // Función para repintar el canvas con los puntos actuales
    var repaintedCanvas = function () {
        var canvas = document.getElementById("blueprintCanvas");
        var ctx = canvas.getContext("2d");

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar los puntos del plano actual
        if (points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }
    };

    // Registrar eventos después de que el DOM esté listo
    var init = function () {
        $(document).ready(function () {
            $("#getBlueprints").click(function () {
                var author = $("#author").val();
                updateBlueprintsList(author);
            });

            $("#saveUpdate").click(function () {
                saveOrUpdateBlueprint(); // Llama a la función de guardar/actualizar
            });

            $("#createNewBlueprint").click(function () {
                createNewBlueprint(); // Llama a la función de crear nuevo blueprint
            });

            initCanvasEvents(); // Inicializar eventos del canvas
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
