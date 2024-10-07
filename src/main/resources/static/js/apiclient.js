var apiclient = (function () {

    // Función para obtener planos por autor
    var getBlueprintsByAuthor = function (authorName, callback) {
        $.ajax({
            url: `/blueprints/${authorName}`, // Cambia la URL si es necesario
            method: 'GET',
            dataType: 'json'
        })
        .done(function (data) {
            callback(data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Error al obtener los planos del autor: " + textStatus, errorThrown);
            callback(null);
        });
    };

    // Función para obtener un plano específico por autor y nombre
    var getBlueprintsByNameAndAuthor = function (authorName, blueprintName, callback) {
        $.ajax({
            url: `/blueprints/${authorName}/${blueprintName}`, // Cambia la URL si es necesario
            method: 'GET',
            dataType: 'json'
        })
        .done(function (data) {
            callback(data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Error al obtener el plano: " + textStatus, errorThrown);
            callback(null);
        });
    };

    return {
        getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor: getBlueprintsByNameAndAuthor
    };

})();
