package edu.eci.arsw.blueprints.persistence.filters.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.filters.BlueprintFilter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service("subsamplingFilter")
public class SubsamplingFilter implements BlueprintFilter {

    @Override
    public Blueprint filterBlueprint(Blueprint blueprint) {
        List<Point> originalPoints = blueprint.getPoints();
        List<Point> filteredPoints = new ArrayList<>();

        // Agregar solo 1 de cada 2 puntos (índices pares)
        for (int i = 0; i < originalPoints.size(); i += 2) {
            filteredPoints.add(originalPoints.get(i));
        }

        // Retornar un nuevo Blueprint con los puntos submuestreados
        return new Blueprint(blueprint.getAuthor(), blueprint.getName(), filteredPoints.toArray(new Point[0]));
    }
}
