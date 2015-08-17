/**
 * @file Prototype for defining an animation for
 * a single property.
 * 
 * @author Human Interactive
 */

"use strict";

/**
 * Creates an animation.
 * 
 * @constructor
 * 
 * @param {object} options - The parameter for the animation.
 */
function Animation(options) {

	Object.defineProperties(this, {
		object: {
			value: null,
			configurable: false,
			enumerable: true,
			writable: true
		},
		property: {
			value: null,
			configurable: false,
			enumerable: true,
			writable: true
		},
		duration: {
			value: 0,
			configurable: false,
			enumerable: true,
			writable: true
		},
		startValue: {
			value: 0,
			configurable: false,
			enumerable: true,
			writable: true
		},
		endValue: {
			value: 0,
			configurable: false,
			enumerable: true,
			writable: true
		},
		delayTime: {
			value: 0,
			configurable: false,
			enumerable: false,
			writable: true
		},
		easingFunction: {
			value: undefined,
			configurable: false,
			enumerable: false,
			writable: true
		},
		onStartCallback: {
			value: undefined,
			configurable: false,
			enumerable: false,
			writable: true
		},
		onUpdateCallback: {
			value: undefined,
			configurable: false,
			enumerable: false,
			writable: true
		},
		onCompleteCallback: {
			value: undefined,
			configurable: false,
			enumerable: false,
			writable: true
		},
		onStopCallback: {
			value: undefined,
			configurable: false,
			enumerable: false,
			writable: true
		},
		isPlaying: {
			value: false,
			configurable: false,
			enumerable: false,
			writable: true
		},
		_startTime: {
			value: 0,
			configurable: false,
			enumerable: false,
			writable: true
		},
		_isHover: {
			value: false,
			configurable: false,
			enumerable: false,
			writable: true
		}
	});
	
	// set options
	for(var property in options){
		if( this.hasOwnProperty( property ) === true ){
			this[ property ] = options[ property ];
		}
	}
}

/**
 * Starts the animation.
 * 
 * @param {number} time - The update time.
 * 
 * @returns {boolean} Is the animation finished?
 */
Animation.prototype.update = (function(){
	
	var index, elapsed, value, temp = 0;
	var isFinished = false;
	
	return function( time ){
		
		// set default value
		isFinished = false;
		
		// if the startTime is greater than the current time,
		// we will skip the update. this is important for delayed
		// start time.
		if ( time < this._startTime ) {

			return isFinished;

		}
		
		// calculate elapsed time. the final value of "elapsed"
		// will always be inside the range of [0, 1].
		elapsed = ( time - this._startTime ) / this.duration;
		elapsed = elapsed > 1 ? 1 : elapsed;
		
		// execute easing function
		if( typeof this.easingFunction === "function" ){
			
			value = this.easingFunction( elapsed );
			
		}else{
			
			throw "ERROR: Animation: No easing function assigned.";
		}
		
		// check, if the object has the specified property
		if( this.object.hasOwnProperty( this.property ) === true ){
			
			// calculate and assign new value
			this.object[ this.property ] = this.startValue + ( this.endValue - this.startValue ) * value;
		}
		
		// execute callback
		if( typeof this.onUpdateCallback === "function" ){
			
			this.onUpdateCallback();
		}
		
		// check finish
		if( elapsed === 1 ){
			
			// when the hover flag is set, the animation
			// will be played in an endless loop.
			if( this._isHover === true ){
				
				// swtich start and end values
				temp = this.startValue;
				this.startValue = this.endValue;
				this.endValue =  temp;
				
				// set new start time
				this._startTime = time + this.delayTime;
				
			}else{
				
				// exectue callback
				if ( typeof this.onCompleteCallback ===  "function" ) {

					this.onCompleteCallback();

				}
				
				isFinished = true;
				
			}
		
		}
		
		return isFinished;
	};
	
}());

/**
 * Starts the animation.
 * 
 * @param {number} time - The starting time.
 */
Animation.prototype.start = function( time ){
	
	this.isPlaying = true;
	
	this._startTime = time !== undefined ? time : global.performance.now();
	this._startTime += this.delayTime;
	
	// execute callback
	if( typeof this.onStartCallback === "function" ){
		
		this.onStartCallback();
	}
};

/**
 * Stops the animation.
 */
Animation.prototype.stop = function(){
	
	if( this.isPlaying === true ){
		
		this.isPlaying = false;
	}
	
	// execute callback
	if( typeof this.onStopCallback === "function" ){
		
		this.onStopCallback();
	}
};

/**
 * Set the hover flag.
 * 
 * @param {boolean} hover - Should the animation has an endless hover effect?
 */
Animation.prototype.setHover = function( isHover ){
	
	this._isHover = isHover;
};

module.exports = Animation;