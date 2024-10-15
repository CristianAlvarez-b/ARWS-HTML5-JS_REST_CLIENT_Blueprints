var apiclient = (function () {

    // Función para obtener planos por autor con promesas
    var getBlueprintsByAuthor = function (authorName) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/blueprints/${authorName}`,
                method: 'GET',
                dataType: 'json'
            })
            .done(data => resolve(data))
            .fail((jqXHR, textStatus, errorThrown) => {
                console.error("Error al obtener los planos del autor: " + textStatus, errorThrown);
                reject(errorThrown);
            });
        });
    };

    // Función para obtener un plano específico por autor y nombre con promesas
    var getBlueprintsByNameAndAuthor = function (authorName, blueprintName) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/blueprints/${authorName}/${blueprintName}`,
                method: 'GET',
                dataType: 'json'
            })
            .done(data => resolve(data))
            .fail((jqXHR, textStatus, errorThrown) => {
                console.error("Error al obtener el plano: " + textStatus, errorThrown);
                reject(errorThrown);
            });
        });
    };

    // Función para actualizar un plano existente con promesas
    var updateBlueprint = function (blueprint) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/blueprints`,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            })
            .done(response => resolve(response))
            .fail((jqXHR, textStatus, errorThrown) => {
                console.error("Error al actualizar el plano: " + textStatus, errorThrown);
                reject(errorThrown);
            });
        });
    };

    // Función para eliminar un plano con promesas
    var deleteBlueprint = function (blueprint) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/blueprints`,
                type: 'DELETE',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            })
            .done(response => resolve(response))
            .fail((jqXHR, textStatus, errorThrown) => {
                console.error("Error al eliminar el plano: " + textStatus, errorThrown);
                reject(errorThrown);
            });
        });
    };

    return {
        getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor: getBlueprintsByNameAndAuthor,
        updateBlueprint: updateBlueprint,
        deleteBlueprint: deleteBlueprint
    };

})();
