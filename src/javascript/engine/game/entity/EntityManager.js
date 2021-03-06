/**
 * @file This prototype manages all game entities.
 * 
 * @author Human Interactive
 */
"use strict";

var GameEntity = require( "./GameEntity" );
var Player = require( "./Player" );
var Vehicle = require( "./Vehicle" );

/**
 * Creates the entity manager.
 * 
 * @constructor
 */
function EntityManager() {

	Object.defineProperties( this, {

		entities : {
			value : [],
			configurable : false,
			enumerable : false,
			writable : false
		}

	} );
}

/**
 * Creates the player object
 * 
 * @param {World} world - The reference to the world object.
 * 
 * @returns {Player} The new player.
 */
EntityManager.prototype.createPlayer = function( world ) {

	var player = new Player( world );
	this.addEntity( player );
	return player;
};

/**
 * Creates a vehicle, a moving entity that uses steering behaviors.
 * 
 * @param {World} world - The reference to the world object.
 * @param {THREE.Object3D} object3D - The 3D object of the entity.
 * @param {number} numSamplesForSmoothing - How many samples the smoother will use to average the velocity.
 * 
 * @returns {Vehicle} The new vehicle.
 */
EntityManager.prototype.createVehicle = function( world, object3D, numSamplesForSmoothing ) {

	var vehicle = new Vehicle( world, object3D, numSamplesForSmoothing );
	this.addEntity( vehicle );
	return vehicle;
};

/**
 * Updates all entities.
 * 
 * @param {number} delta - The time delta value.
 */
EntityManager.prototype.update = function( delta ) {

	for ( var index = 0; index < this.entities.length; index++ )
	{
		this.entities[ index ].update( delta );
	}
};

/**
 * Gets an entity by its ID.
 * 
 * @param {number} id - The ID of the entity.
 * 
 * @returns {GameEntity} The entity.
 */
EntityManager.prototype.getEntity = function( id ) {

	var entity = null;

	for ( var index = 0; index < this.entities.length; index++ )
	{
		if ( this.entities[ index ].id === id )
		{
			entity = this.entities[ index ];

			break;
		}
	}

	if ( entity === null )
	{
		throw "ERROR: EntityManager: Entity with ID " + id + " not existing.";
	}
	else
	{
		return entity;
	}
};

/**
 * Adds a single entity to the internal array.
 * 
 * @param {GameEntity} entity - The entity to add.
 */
EntityManager.prototype.addEntity = function( entity ) {

	this.entities.push( entity );
};

/**
 * Removes a single entity from the internal array.
 * 
 * @param {GameEntity} entity - The entity to remove.
 */
EntityManager.prototype.removeEntity = function( entity ) {

	var index = this.entities.indexOf( entity );
	this.entities.splice( index, 1 );
};

/**
 * Removes all entities from the internal array.
 * 
 * @param {boolean} isClear - Should also all world entities be removed?
 */
EntityManager.prototype.removeEntities = function( isClear ) {

	if ( isClear === true )
	{
		this.entities.length = 0;
	}
	else
	{
		for ( var index = this.entities.length - 1; index >= 0; index-- )
		{
			// only remove entities with scope "STAGE"
			if ( this.entities[ index ].scope === GameEntity.SCOPE.STAGE )
			{
				this.remove( this.children[ index ] );
			}
		}
	}
};

module.exports = new EntityManager();