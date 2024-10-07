package edu.eci.arsw.blueprints.persistence.filters.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.filters.BlueprintFilter;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service("redundancyFilter")
@Primary
public class RedundancyFilter implements BlueprintFilter {

    @Override
    public Blueprint filterBlueprint(Blueprint blueprint) {
        List<Point> originalPoints = blueprint.getPoints();
        List<Point> filteredPoints = new ArrayList<>();

        if (!originalPoints.isEmpty()) {
            Point previousPoint = originalPoints.get(0);
            filteredPoints.add(previousPoint);

            // Eliminar puntos consecutivos repetidos
            for (int i = 1; i < originalPoints.size(); i++) {
                Point currentPoint = originalPoints.get(i);
                if (!currentPoint.equalsPoints(previousPoint)) {
                    filteredPoints.add(currentPoint);
                }
                previousPoint = currentPoint;
            }
        }

        // Retornar un nuevo Blueprint con los puntos filtrados
        return new Blueprint(blueprint.getAuthor(), blueprint.getName(), filteredPoints.toArray(new Point[0]));
    }
}
