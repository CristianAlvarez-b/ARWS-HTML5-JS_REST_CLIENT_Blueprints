/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import edu.eci.arsw.blueprints.persistence.filters.BlueprintFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author hcadavid
 */
@Service
public class BlueprintsServices {
   

    BlueprintsPersistence bpp;
    BlueprintFilter filter;
    @Autowired
    public BlueprintsServices(@Qualifier("inMemoryBlueprintPersistence") BlueprintsPersistence bpp, @Qualifier("redundancyFilter") BlueprintFilter filter) {
        this.bpp = bpp;
        this.filter = filter;
    }

    public void addNewBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        bpp.saveBlueprint(bp);
    }
    
    public Set<Blueprint> getAllBlueprints(){
        Set<Blueprint> filterBlueprints = new HashSet<>();
        Set<Blueprint> blueprints = bpp.getAllBlueprints();
        for(Blueprint bp: blueprints){
            Blueprint filterBp = filter.filterBlueprint(bp);
            filterBlueprints.add(filterBp);
        }
        return filterBlueprints;
    }
    
    /**
     * 
     * @param author blueprint's author
     * @param name blueprint's name
     * @return the blueprint of the given name created by the given author
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public Blueprint getBlueprint(String author,String name) throws BlueprintNotFoundException{
        return filter.filterBlueprint(bpp.getBlueprint(author, name));
    }
    
    /**
     * 
     * @param author blueprint's author
     * @return all the blueprints of the given author
     * @throws BlueprintNotFoundException if the given author doesn't exist
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException{
        Set<Blueprint> filterBlueprints = new HashSet<>();
        Set<Blueprint> blueprints = bpp.getBlueprintsByAuthor(author);
        for(Blueprint bp: blueprints){
            Blueprint filterBp = filter.filterBlueprint(bp);
            filterBlueprints.add(filterBp);
        }
        return filterBlueprints;
    }
    public void updateBlueprint(Blueprint blueprint) throws BlueprintPersistenceException {
        bpp.updateBlueprint(blueprint);
    }
}
