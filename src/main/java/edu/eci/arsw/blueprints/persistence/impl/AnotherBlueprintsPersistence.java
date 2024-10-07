package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Repository("anotherBlueprintsPersistence")
public class AnotherBlueprintsPersistence implements BlueprintsPersistence {
    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {

    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        return null;
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        return null;
    }

    @Override
    public Set<Blueprint> getAllBlueprints() {
        return null;
    }

    @Override
    public void updateBlueprint(Blueprint blueprint) {

    }

    @Override
    public void deteleBlueprint(Blueprint blueprint) throws BlueprintPersistenceException {

    }
}
