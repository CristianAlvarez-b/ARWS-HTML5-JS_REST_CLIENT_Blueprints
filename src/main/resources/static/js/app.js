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

        api.getBlueprintsByAuthor(authorName)
            .then(blueprints => {
                if (blueprints) {
                    // Actualizar la lista de planos
                    blueprintsList = blueprints.map(blueprint => {
                        return { name: blueprint.name, points: blueprint.points.length };
                    });

                    // Limpiar la tabla antes de llenarla
                    $("#blueprintsTable tbody").empty();

                    // Añadir cada plano a la tabla
                    blueprintsList.forEach(blueprint => {
                        const row = `<tr>
                            <td>${blueprint.name}</td>
                            <td>${blueprint.points}</td>
                            <td><button class="btn btn-primary" onclick="app.drawBlueprint('${authorName}', '${blueprint.name}')">Open</button></td>
                        </tr>`;
                        $("#blueprintsTable tbody").append(row);
                    });

                    // Calcular el total de puntos
                    const totalPoints = blueprints.reduce((total, blueprint) => {
                        return total + blueprint.points.length;
                    }, 0);

                    // Actualizar el campo del total de puntos
                    $("#totalPoints").text(totalPoints);
                    $("#selectedAuthor").text(`${authorName}'s blueprints`);
                } else {
                    $("#blueprintsTable tbody").empty();
                    $("#totalPoints").text(0);
                    $("#selectedAuthor").text("Author not found");
                }
            })
            .catch(error => {
                console.log("No hay planos asociados para el autor:", error);
                $("#blueprintsTable tbody").empty();
                $("#totalPoints").text(0);
                $("#selectedAuthor").text("Not Blueprint's found for this author");
            });
    };

    // Operación pública para dibujar un plano
    var drawBlueprint = function (author, blueprintName) {
        currentBlueprintName = blueprintName; // Guardamos el nombre del plano actual
        points = []; // Reiniciar puntos cuando se dibuja un nuevo plano
        api.getBlueprintsByNameAndAuthor(author, blueprintName)
            .then(blueprint => {
                if (blueprint) {
                    const canvas = document.getElementById("blueprintCanvas");
                    const ctx = canvas.getContext("2d");

                    // Limpiar el canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Dibujar los puntos del plano
                    const blueprintPoints = blueprint.points; // Usar variable diferente para evitar conflicto
                    if (blueprintPoints.length > 0) {
                        ctx.beginPath();
                        ctx.moveTo(blueprintPoints[0].x, blueprintPoints[0].y);
                        for (let i = 1; i < blueprintPoints.length; i++) {
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
            })
            .catch(error => {
                console.error("Error al obtener el plano:", error);
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
        api.updateBlueprint(blueprintToUpdate)
            .then(response => {
                if (response) {
                    console.log(response); // Manejar la respuesta del servidor

                    // Hacer un GET para obtener todos los planos de nuevo
                    return api.getBlueprintsByAuthor(authorName);
                } else {
                    throw new Error("Error al actualizar el plano.");
                }
            })
            .then(blueprints => {
                if (blueprints) {
                    // Actualizar la tabla de planos
                    updateBlueprintsList(authorName);

                    // Calcular el total de puntos
                    var totalPoints = blueprints.reduce((total, blueprint) => {
                        return total + blueprint.points.length;
                    }, 0);
                    $("#totalPoints").text(totalPoints);
                } else {
                    console.error("No se pudo obtener la lista de planos después de la actualización.");
                }
            })
            .catch(error => {
                alert(error.message);
                console.error("Error en el proceso de guardar o actualizar el plano:", error);
            });
    };

   // Función para obtener y actualizar la lista de blueprints
   // Función para obtener y actualizar la lista de blueprints
   function updateBlueprintsList(authorName) {
       // Hacer un GET para obtener todos los planos de un autor
       api.getBlueprintsByAuthor(authorName)
           .then(blueprints => {
               const tableBody = $("#blueprintsTable tbody");
               tableBody.empty(); // Limpiar la tabla antes de agregar nuevos elementos

               if (blueprints && blueprints.length > 0) {
                   // Si hay planos, agregarlos a la tabla
                   blueprints.forEach(blueprint => {
                       const row = `<tr>
                           <td>${blueprint.name}</td>
                           <td>${blueprint.author}</td>
                           <td>${blueprint.points.length}</td>
                           <td><button onclick="selectBlueprint('${blueprint.name}')">Select</button></td>
                       </tr>`;
                       tableBody.append(row); // Agregar nueva fila a la tabla
                   });
               } else {
                   // Si no hay planos, mostrar mensaje
                   const messageRow = `<tr>
                       <td colspan="4">No blueprints found for this author.</td>
                   </tr>`;
                   tableBody.append(messageRow); // Mostrar mensaje de tabla vacía
               }
           })
           .catch(error => {
               console.error("Error al obtener los blueprints:", error);
               const tableBody = $("#blueprintsTable tbody");
               tableBody.empty(); // Limpiar la tabla en caso de error
               const messageRow = `<tr>
                   <td colspan="4">Error al cargar los blueprints. Inténtalo de nuevo más tarde.</td>
               </tr>`;
               tableBody.append(messageRow); // Mostrar mensaje de error
           });
   }

   // Llamada para actualizar la lista de blueprints después de eliminar
   var deleteBlueprint = function () {
       // Verifica si hay un blueprint seleccionado
       if (!currentBlueprintName) {
           alert("No blueprint selected to delete.");
           return; // Salir si no hay un blueprint seleccionado
       }

       // Hacer GET para obtener el blueprint seleccionado utilizando la función de apiclient
       api.getBlueprintsByNameAndAuthor(authorName, currentBlueprintName)
           .then(blueprint => {
               // Confirmar la acción
               if (confirm("Are you sure you want to delete the blueprint: " + currentBlueprintName + "?")) {
                   // Crear el objeto blueprint que se enviará a la API para eliminar
                   var blueprintToDelete = {
                       author: blueprint.author,
                       name: blueprint.name,
                       points: blueprint.points
                   };

                   // Hacer DELETE utilizando la función de apiclient
                   return api.deleteBlueprint(blueprintToDelete);
               } else {
                   return Promise.reject("Deletion cancelled."); // Cancelar la promesa si el usuario no confirma
               }
           })
           .then(response => {
               console.log(response); // Manejar la respuesta del servidor

               // Borrar el canvas
               var canvas = document.getElementById("blueprintCanvas");
               var ctx = canvas.getContext("2d");
               ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

               // Actualizar la lista de blueprints
               updateBlueprintsList(authorName); // Asegúrate de pasar el nombre del autor correcto

               // Reiniciar el nombre del blueprint actual
               currentBlueprintName = '';
               $("#selectedBlueprint").text("Current blueprint: None"); // Actualizar la interfaz
           })
           .catch(error => {
               if (error !== "Deletion cancelled.") {
                   console.error("Error al eliminar el plano:", error);
                   alert("Error al eliminar el blueprint.");
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

                $("#deleteBlueprint").click(function () {
                   deleteBlueprint();  // Llama a la función de eliminar blueprint
                });

                initCanvasEvents(); // Inicializar eventos del canvas
            });
        };

    return {
        init: init,
        updateBlueprintsList: updateBlueprintsList,
        drawBlueprint: drawBlueprint,
        deleteBlueprint: deleteBlueprint
    };
})();

// Inicializar el módulo al cargar la página
app.init();
