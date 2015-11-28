"use strict";

var THREE = require( "three" );

var StageBase = require( "../core/StageBase" );
var JSONLoader = require( "../etc/JSONLoader" );
var utils = require( "../etc/Utils" );
var Easing = require( "../animation/Easing" );

var ParticleEffect = require( "../particle/ParticleEffect" );
var SphereEmitter = require( "../particle/emitter/SphereEmitter" );

var self, particles;

function Stage() {

	StageBase.call( this, "012" );

	self = this;
}

Stage.prototype = Object.create( StageBase.prototype );
Stage.prototype.constructor = Stage;

Stage.prototype.setup = function() {

	StageBase.prototype.setup.call( this );

	// player setup
	this.world.player.position.set( 0, 0, -75 );
	this.world.player.setDirection( new THREE.Vector3( 0, 0, 1 ) );
	this.world.player.updateMatrixWorld();

	// load texts
	this.textManager.load( this.stageId );

	// add ground
	var groundGeometry = new THREE.Geometry().fromBufferGeometry( new THREE.PlaneBufferGeometry( 200, 200, 20, 20 ) );
	var groundMaterial = new THREE.MeshBasicMaterial( {
		vertexColors : THREE.FaceColors
	} );

	var ground = new THREE.Mesh( groundGeometry, groundMaterial );
	ground.matrixAutoUpdate = false;
	ground.rotation.x = - utils.HALF_PI;
	ground.updateMatrix();
	ground.receiveShadow = true;
	this.world.addGround( ground );

	// color faces
	utils.colorFaces( groundGeometry, StageBase.COLORS.PRIMARY, StageBase.COLORS.BLUE_DARK );

	// add sign
	var signLoader = new JSONLoader();
	signLoader.load( "assets/models/sign.json", function( geometry, materials ) {

		self.settingsManager.adjustMaterials( materials, self.renderer );

		var sign = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
		sign.position.set( 0, 20, 75 );
		sign.rotation.set( 0, - utils.HALF_PI, 0 );
		self.world.addObject3D( sign );

		self.animationManager.createHoverAnimation( {
			object : sign.position,
			property : "y",
			duration : 5000,
			start : sign.position.y,
			end : sign.position.y + 5,
			easing : Easing.Sinusoidal.InOut
		} ).play();
	} );
	
	// particle texture
	var texture = new THREE.TextureLoader().load( "/assets/textures/Blossom_1_S.png" );
	
	// particle emitter
	var emitter = new SphereEmitter({
		origin: new THREE.Vector3( 0, 10, 0)
	});
	
	// particle effect
	particles = new ParticleEffect({
		numberOfParticles : 10000,
		emitter : emitter,
		texture : texture,
		transparent: true,
		sortParticles: true
	});

	// add trigger for ending
	var stageTrigger = this.actionManager.createTrigger( "Change Stage", new THREE.Vector3( 0, 0, 75 ), 15, true, function() {

		self.userInterfaceManager.showModalDialog( {
			headline : "Modal.Headline",
			button : "Modal.Button",
			content : "Modal.Content"
		} );

		self.saveGameManager.remove();	
	} );

	// start rendering
	this._render();
};

Stage.prototype.start = function() {

	StageBase.prototype.start.call( this );

	// set information panel text
	this.userInterfaceManager.setInformationPanelText( "InformationPanel.Text" );
};

Stage.prototype.destroy = function() {

	StageBase.prototype.destroy.call( this );
};

Stage.prototype._render = function() {
	
	particles.update( self._delta );

	StageBase.prototype._render.call( self );
};

module.exports = Stage;