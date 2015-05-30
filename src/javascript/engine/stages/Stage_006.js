"use strict";

var THREE = require("three");
var TWEEN = require("tween.js");

var StageBase = require("../core/StageBase");
var JSONLoader = require("../etc/JSONLoader");

var self;

var audioFire, audioClock;

function Stage(){
	
	StageBase.call(this, "006");

	self = this;
}

Stage.prototype = Object.create(StageBase.prototype);
Stage.prototype.constructor = Stage;

Stage.prototype.setup = function(){
	
	StageBase.prototype.setup.call(this);
	
	// setup controls
	this.controls.setPosition(new THREE.Vector3(0, 0, -75));
	this.controls.setRotation(new THREE.Vector3(0, Math.PI, 0));
	
	// load texts
	this.textManager.load(this.stageId);
	
	// add ground
	var groundGeometry = new THREE.Geometry().fromBufferGeometry(new THREE.PlaneBufferGeometry(200, 200, 20, 20));
	var groundMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
	
	var ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.matrixAutoUpdate = false;
	ground.rotation.x = -0.5 * Math.PI;
	ground.updateMatrix();
	ground.receiveShadow = true;
	this.controls.addGround(ground);
	this.scene.add(ground);
	
	// color faces
	colorFaces(groundGeometry);
	
	// add boxes
	var staticBoxFire = new THREE.Mesh( new THREE.BoxGeometry(10, 10, 10) , new THREE.MeshLambertMaterial({color: 0x6083c2}));
	staticBoxFire.matrixAutoUpdate = false;
	staticBoxFire.position.set(40, 5, 0);
	staticBoxFire.castShadow = true;
	staticBoxFire.updateMatrix();
	this.scene.add(staticBoxFire);
	this.actionManager.createStatic(staticBoxFire);
	
	var staticBoxClock = new THREE.Mesh( new THREE.BoxGeometry(10, 10, 10) , new THREE.MeshLambertMaterial({color: 0xf3f4f6}));
	staticBoxClock.matrixAutoUpdate = false;
	staticBoxClock.position.set(-40, 5, 0);
	staticBoxClock.castShadow = true;
	staticBoxClock.updateMatrix();
	this.scene.add(staticBoxClock);
	this.actionManager.createStatic(staticBoxClock);
	
	var staticBoxWall = new THREE.Mesh( new THREE.BoxGeometry(1, 20, 40) , new THREE.MeshBasicMaterial({wireframe: true}));
	staticBoxWall.matrixAutoUpdate = false;
	staticBoxWall.position.set(-5.5, 5, 0);
	staticBoxWall.updateMatrix();
	staticBoxClock.add(staticBoxWall);
	this.actionManager.createStatic(staticBoxWall);
	
	// add dynamic sounds
	this.audioManager.createAudioBufferList(["fire", "clock"], function(bufferList){
		audioFire = self.audioManager.createDynamicSound("ambient.fire", bufferList[0], true, 20, 1, 50);
		audioClock = self.audioManager.createDynamicSound("ambient.clock", bufferList[1], true, 20, 1, 50);
		audioClock.addDirection(180, 0, 0);
		audioClock.position.set(-5, 0, 0);
		staticBoxFire.add(audioFire);
		staticBoxClock.add(audioClock);
	}).load();
	
	// add sign
	var signLoader = new JSONLoader();
	signLoader.load("assets/models/sign.json",  function(geometry, materials) {
		
		self.settingsManager.adjustMaterials(materials, self.renderer);
		
		var sign = new THREE.Mesh(geometry,  new THREE.MeshFaceMaterial(materials));
		sign.position.set(0, 20, 75);
		sign.rotation.set(0, Math.PI * -0.5, 0);
		self.scene.add(sign);
		
		self.animationManager.createHoverAnimation(sign.position.y, 18, 23, 5000, TWEEN.Easing.Sinusoidal.InOut, function(){
			sign.position.y = this.x;
		}).start();
	});
	
	// add trigger for stage change
	var stageTrigger = this.actionManager.createTrigger("Change Stage", 15, function(){
		self._changeStage("007", true);
	});
	stageTrigger.position.set(0, 0, 75);
	this.scene.add(stageTrigger);
	
	// light
	var light = new THREE.DirectionalLight(0xffffff);
	light.position.set(-100, 50, -100);
	light.shadowCameraLeft = -40;
	light.shadowCameraRight = 40;
	light.shadowCameraTop = 40;
	light.shadowCameraBottom = -40;
	this.settingsManager.adjustLight(light);
	this.scene.add(light);

	// start rendering
	this._render();
};

Stage.prototype.start = function(){
	
	StageBase.prototype.start.call(this);
	
	// start playing
	audioFire.play();
	audioClock.play();
	
	// set information panel text
	this.userInterfaceManager.setInformationPanelText("InformationPanel.Text");
};

Stage.prototype.destroy = function(){
	
	StageBase.prototype.destroy.call(this);
	
	// stop playing
	audioFire.stop();
	audioClock.stop();
};

Stage.prototype._render = function(){
	
	StageBase.prototype._render.call(self);
};

//custom functions

function colorFaces(geometry){
	
	for (var i = 0; i < geometry.faces.length; i ++){
		
		if(i % 2 === 0){
			geometry.faces[i].color = new THREE.Color(0x6083c2);
		}else{
			geometry.faces[i].color = new THREE.Color(0x455066);
		}
	}
}

module.exports = Stage;