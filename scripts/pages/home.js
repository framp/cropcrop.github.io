/* txt-rotator */

$(".rotator").textrotator({
  animation: "dissolve",
  separator: "-",
  speed: 3000
});


/* home animation */

var animationEnd = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd';

$('#canvas-wrap .btn-explore').click(function () {
  $('#canvas-wrap canvas').removeClass('fadeIn').addClass('animated fadeOut').one(animationEnd, function () {
    $('#canvas-wrap h1').removeClass('fadeInDown').addClass('animated fadeOutUp');
    $(' #canvas-wrap .btn-explore').removeClass('fadeInUp').addClass('animated fadeOutDown').one(animationEnd, function () {
      $('#canvas-wrap').addClass('hidden');
      $('#container-social').removeClass('hidden fadeOut').addClass('animated fadeIn');
    });
  });
});

$('#container-social .box-back').click(function () {
  $('#container-social').removeClass('fadeIn').addClass('animated fadeOut').one(animationEnd, function () {
    $('#canvas-wrap').removeClass('hidden');
    $('#canvas-wrap canvas').removeClass('fadeOut').addClass('animated fadeIn');
    $('#canvas-wrap h1').removeClass('fadeOutUp').addClass('animated fadeInDown');
    $('#canvas-wrap .btn-explore').removeClass('fadeOutDown').addClass('animated fadeInUp');
    $('#container-social').addClass('hidden');
  });
});

/* graph */

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

(function($){

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem
    

    var that = {
      init:function(system){
        particleSystem = system

        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        that.initMouseHandling()
      },
      
      redraw:function(){

        // redraw will be called repeatedly during the run whenever the node positions
        // change.
        
        ctx.fillStyle = "#000"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(255,255,255, 0.13)"
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 2
          var ww = 3
          
          ctx.beginPath();
          if (node.data.alone) { 
            ctx.arc(pt.x-ww/2, pt.y-ww/2, ww,0, Math.PI*2, true ); 
          } else { 
            ctx.arc(pt.x-w/2, pt.y-w/2, w,0, Math.PI*2, true);
          }
          ctx.fillStyle = (node.data.alone) ? "#ddd" : "#ccc";
          ctx.fill();
          ctx.closePath();
          ctx.fill();
          
          /*ctx.fillStyle = (node.data.alone) ? "#666" : "white"
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)*/
        })    			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    

  $(document).ready(function(){
    var sys = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    // add some nodes to the graph and watch it go...
/*    sys.addEdge('a','b')
    sys.addEdge('a','c')
    sys.addEdge('a','d')
    sys.addEdge('a','e')
    sys.addNode('f', {alone:true, mass:.25})*/
    
    sys.graft({
       nodes:{
        n1:{ alone:true, mass: .7, fixed: true, x:0, y: 0 },
		n2:{ alone:true, mass: .6, fixed: true, x:0, y: 0 },
        n3:{ alone:true, mass: .7, fixed: true, x:0, y: 0 },
       }, 
       edges:{
         aa:{ a1:{}, a2:{}, a3:{} },
            a1: { a11:{} },
            a2: { a21:{},a22:{},a23:{} },
                a21: { a211:{}, a212:{}, n3:{}, a213:{} },
                a23: { a231:{}, a232:{}, n2:{} }, 
		  
		 bb:{ b1:{}, b2:{}, b3:{} },
            b1: { b11:{}, a21:{} },
            b2: { b21:{},b22:{},b23:{} },
                b21: { b211:{}, b212:{}, b213:{} },
                b23: { b231:{}, b232:{} },
		   
		    cc:{ c1:{}, c2:{}, n1:{}, c3:{} },
            c1: { c11:{}},
            c2: { c21:{},c22:{},c23:{} },
                c21: { c211:{}, c212:{}, c213:{} },
                c23: { c231:{}, c232:{} },
       }
    })
    
  });

})(this.jQuery)