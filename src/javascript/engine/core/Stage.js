/**
 * @file Basis prototype for all stages. It is used to provide
 * specific stages a set of managers and other common functionality.
 * 
 * @author Human Interactive
 */

"use strict";

var THREE = require("three");
var PubSub = require("pubsub-js");

var scene = require("./Scene");
var renderer = require("./Renderer");
var camera = require("./Camera");
var controls = require("../controls/FirstPersonControls");
var actionManager = require("../action/ActionManager");
var audioManager = require("../audio/AudioManager");
var animationManager = require("../etc/AnimationManager");
var groupManager = require("../etc/GroupManager");
var textManager = require("../etc/TextManager");
var saveGameManager = require("../etc/SaveGameManager");
var settingsManager = require("../etc/SettingsManager");
var userInterfaceManager = require("../ui/UserInterfaceManager");
var utils = require("../etc/Utils");

var self;
/**
 * Creates a stage.
 * 
 * @constructor
 */
function Stage(){
	
	Object.defineProperties(this, {	
		scene: {
			value: scene,
			configurable: false,
			enumerable: true,
			writable: false
		},
		renderer: {
			value: renderer,
			configurable: false,
			enumerable: true,
			writable: false
		},
		camera: {
			value: camera,
			configurable: false,
			enumerable: true,
			writable: false
		},
		controls: {
			value: controls,
			configurable: false,
			enumerable: true,
			writable: false
		},
		actionManager: {
			value: actionManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		animationManager: {
			value: animationManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		audioManager: {
			value: audioManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		groupManager: {
			value: groupManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		saveGameManager: {
			value: saveGameManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		settingsManager: {
			value: settingsManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		textManager: {
			value: textManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		timeManager: {
			value: new THREE.Clock(),
			configurable: false,
			enumerable: true,
			writable: false
		},
		userInterfaceManager: {
			value: userInterfaceManager,
			configurable: false,
			enumerable: true,
			writable: false
		},
		_delta: {
			value: 0,
			configurable: false,
			enumerable: true,
			writable: true
		},
		_renderId: {
			value: 0,
			configurable: false,
			enumerable: true,
			writable: true
		}
	});
	
	self = this;
}

/**
 * This method is called, when the all requirements are fulfilled 
 * to setup the stage. In dev-mode, additional helper objects are added.
 */
Stage.prototype.setup = function(){
	
	if(utils.isDevelopmentModeActive() === true){
		this.scene.add(new THREE.AxisHelper(30));
		this.scene.add(new THREE.GridHelper(200, 10));
	}
};

/**
 * This method is called, when the stages is ready and started by the player.
 */
Stage.prototype.start = function(){
	
	this.controls.isActionInProgress = false;
};

/**
 * This method is called, when the stage is destroyed. 
 * It removes all scene-related data.
 */
Stage.prototype.destroy = function(){
	
	// remove stage objects from all managers
	this.actionManager.removeInteractiveObjects();
	
	this.actionManager.removeStaticObjects();
	
	this.actionManager.removeTriggers();
	
	this.animationManager.removeAnimations();
	
	this.audioManager.removeDynamicAudios();
	
	this.controls.removeGrounds();
	
	this.groupManager.removeGroups();
	
	this.textManager.removeTexts();
	
	// clear scene and renderer
	this.scene.clear();
	
	this.renderer.clear();
	
	// stop render loop
	global.cancelAnimationFrame(this._renderId);
};

/**
 * Renders the stage.
 */
Stage.prototype._render = function(){
	
	this._delta = this.timeManager.getDelta();
	this.animationManager.update();
	this.controls.update(this._delta);
	this.userInterfaceManager.update();
	this.renderer.render(this.scene, this.camera);
	this._renderId = global.requestAnimationFrame(this._render);
};

/**
 * Changes the stage
 * 
 * @param {string} stageId - The new stageId
 * @param {boolean} isSaveGame -  Should the progress be saved?
 */
Stage.prototype._changeStage = function(stageId, isSaveGame){
	
	self.controls.isActionInProgress = true;
	PubSub.publish("stage.change", {stageId: stageId, isSaveGame: isSaveGame});
};

module.exports = Stage;