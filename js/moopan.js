/* ElementMoopanExtensions by Martyn Eggleton (martyn[dot]eggleton[at]gmail[dot]com) 01/11/2008 */
	
Element.implement({
  aDeadZone: null,
	moopan: function(options) {
    var div = this;
    
		if (div.get("tag") == "div") {
      
			options = $extend({ 
				fStartProportion: [0, 0], //The start position from 0 -1  [X, Y]
        iFPS: 16, //Frames per second
        iSecondsAtTopSpeed: [2, 2], // how long from one extreme to the other at full speed [X, Y]
        fDeadZone: [0.3, 0.3], // the size of the central dead zone 0  = no dead zone 1 turns off scrolling for that direction [X, Y]
			}, options);
      
      this.options = options;
      this.setStyle("overflow", "hidden");
      this.scrollTo(0);
      this.originalCoord = [this.getCoordinates(false).left, this.getCoordinates(false).top];
      this.scrollTo(this.getScrollSize().x * this.options.fStartProportion[0], this.getScrollSize().y * this.options.fStartProportion[1]);
      
      this.calcPanPositions()
      this.addEvent('mouseover', this.overListener);
    }
	  return div;
  },
  
  calcPanPositions: function()
  { 
    this.oCords = this.getCoordinates(false);
    this.aDeadZone = [[(this.oCords.width / 2) * (1 - this.options.fDeadZone[0]),
                      (this.oCords.width / 2) * (1 + this.options.fDeadZone[0])],
                     [(this.oCords.height / 2) * (1 - this.options.fDeadZone[1]),
                      (this.oCords.height / 2) * (1 + this.options.fDeadZone[1])]];
  },
  
  moveListener: function(event){
    event.stop(); //Prevents the browser from following the link.
    this.iSpeed = this.getSpeed(event);
  },
  
  outListener: function(event){
    event.stop(); //Prevents the browser from following the link.
    this.removeEvent('mousemove', this.moveListener);
    this.removeEvent('mouseout', this.outListener);
    this.iSpeed = [0,0];
    $clear(this.intervalID);
  },
  
  overListener: function(event){
    event.stop(); //Prevents the browser from following the link.
    this.addEvent('mousemove', this.moveListener);
    this.addEvent('mouseout', this.outListener);
    this.iSpeed = this.getSpeed(event);
    this.intervalID = this.periodicalMove.periodical(1000 / this.options.iFPS, this);
  },
  
  periodicalMove: function(){
    var aCurrScroll = this.getScroll();
    this.scrollTo(this.iSpeed[0] + aCurrScroll.x, this.iSpeed[1] + aCurrScroll.y);
  },
  
  

  /*I think i have the maths right here but bascially use can use any calculaion that will 
  get you from mouse position to a suitable number of pixels to change per frame
  this one includes a deadzone where nothing happens*/
  getSpeed: function(event){
    var aScroll = this.getScrollSize();
    var aRelMousePos = [  (event.page.x - this.originalCoord[0]),
                          (event.page.y - this.originalCoord[1])];
    
    var aSpeed = [                                                   
                  ((aRelMousePos[0] < this.aDeadZone[0][0])?
                    ((aRelMousePos[0] - this.aDeadZone[0][0]) /  this.aDeadZone[0][0]):
                    ((aRelMousePos[0] > this.aDeadZone[0][1])?
                      ((aRelMousePos[0] - this.aDeadZone[0][1]) /  (this.oCords.width - this.aDeadZone[0][1])):
                      0)
                  ) * aScroll.x / (this.options.iFPS * this.options.iSecondsAtTopSpeed[0])
                  , 
                  ((aRelMousePos[1] < this.aDeadZone[1][0])?
                    ((aRelMousePos[1] - this.aDeadZone[1][0]) /  this.aDeadZone[1][0]):
                    ((aRelMousePos[1] > this.aDeadZone[1][1])?
                      ((aRelMousePos[1] - this.aDeadZone[1][1]) /  (this.oCords.height - this.aDeadZone[1][1])):
                      0)
                  ) * aScroll.y / (this.options.iFPS * this.options.iSecondsAtTopSpeed[1])];
    
    return aSpeed;
  }
});
	
// AUTOLOAD CODE BLOCK (MAY BE CHANGED OR REMOVED)
window.addEvent("domready", function() {
  $$("div").filter(function(div) { return div.hasClass("moopan_both"); }).moopan({});
  $$("div").filter(function(div) { return div.hasClass("moopan_vert"); }).moopan({fDeadZone: [1, 0.3]});
  $$("div").filter(function(div) { return div.hasClass("moopan_horz"); }).moopan({fDeadZone: [0.3, 1]});
});

    
		
