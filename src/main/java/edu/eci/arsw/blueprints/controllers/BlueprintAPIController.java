/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import edu.eci.arsw.blueprints.services.BlueprintsServices;
import org.hibernate.validator.constraints.ParameterScriptAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

/**
 *
 * @author hcadavid
 */

@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {
    @Autowired
    private BlueprintsServices blueprintsServices;
    @GetMapping
    public ResponseEntity<?> getBlueprints(){
        try{
            return new ResponseEntity<>(blueprintsServices.getAllBlueprints(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Resource Not Found " , HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/{author}")
    public ResponseEntity<?> getBlueprintsByAuthor(@PathVariable String author) {
        try {
            return new ResponseEntity<>(blueprintsServices.getBlueprintsByAuthor(author), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Resource Not Found ", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{author}/{bpname}")
    public ResponseEntity<?> getBlueprint(@PathVariable String author, @PathVariable String bpname) {
        try {
            return new ResponseEntity<>(blueprintsServices.getBlueprint(author, bpname), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Resource Not Found ", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> addBlueprint(@RequestBody Blueprint blueprint){
        try {
            blueprintsServices.addNewBlueprint(blueprint);
            return new ResponseEntity<>("Resource Created ", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Resource Not Created ", HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping
    public ResponseEntity<?> replaceBlueprint(@RequestBody Blueprint blueprint){
        try {
            blueprintsServices.updateBlueprint(blueprint);
            return new ResponseEntity<>("Resource Updated", HttpStatus.OK);
        } catch (BlueprintPersistenceException e) {
            try {
                blueprintsServices.addNewBlueprint(blueprint);
                return new ResponseEntity<>("Resource Created ", HttpStatus.CREATED);
            } catch (BlueprintPersistenceException ex) {
                return new ResponseEntity<>("Resource Not Created ", HttpStatus.FORBIDDEN);
            }
        }

    }
}

