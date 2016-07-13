//3456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_
// (JT: why the numbers? counts columns, helps me keep 80-char-wide listings)
var VSHADER_SOURCE = 
	
	'attribute vec4 a_Position;\n' +
	'attribute vec4 a_Normal;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_MvpMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +
				
	'varying vec4 v_Position; \n' +				
	'varying vec3 v_Normal; \n' +	
	 'varying vec4 forFragColor;\n'+

	'uniform vec3 u_eyePosWorld; \n' + 	// Camera/eye location in world coords.
	'varying vec3 u_eyePosWorld3; \n' + 	// Camera/eye location in world coords.
	'uniform float obj;\n'+//use to identify different object
	'varying float obj3;\n'+

	'uniform float mode;\n'+
	'varying float mode3;\n'+

	'uniform float angle;'+
	'uniform float xx;'+

	//for texture
	'attribute vec2 a_TexCoord;\n' +
	'varying vec2 v_TexCoord;\n' +


	'struct Lamp{\n'+//struct Lamp is used to store different light sources
		'vec3 pos;\n' + 			
		'vec3 amb;\n' +   
		'vec3 dif;\n' +   
		'vec3 spe;\n' +
	'};\n'+
	'uniform Lamp larray1[3];\n'+//construct an array of lightsources


	'struct Material{\n'+//struct Lamp is used to store different light sources		
		'vec3 amb;\n' +   
		'vec3 dif;\n' +   
		'vec3 spe;\n' +
		'vec3 emi;\n' +
		'float shi;\n' +
	'};\n'+
	'uniform Material mate1[6];\n'+

	



	'void main() {\n' +
		'mode3=mode;\n'+
		'  v_Position = u_ModelMatrix * a_Position; \n' +
		'vec4 v2=v_Position;'+
		'if(abs(mode3-0.0)<0.0001&&abs(xx-0.0)<0.0001){'+
			// 'v2.z=v2.z*(1.0/3.14*v2.y+0.0*sin(abs(angle/3.14/6.0)));'+
			// 'v2.x=v2.x*(1.0/3.14*v2.y+0.0*sin(abs(angle/3.14/6.0)));'+
			'v2.z=v2.z*(1.0+0.1*sin(20.0*v2.y+0.01*angle));'+
			'v2.x=v2.x*(1.0+0.1*sin(20.0*v2.y+0.01*angle));'+
		'}\n'+
		'  gl_Position = u_MvpMatrix*v2;\n' +
		'  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +

		'obj3=obj;\n'+
		'u_eyePosWorld3=u_eyePosWorld;\n'+

		


		'  v_TexCoord = a_TexCoord;\n' +


		' vec3 emissive;\n' +
		'vec3 ambient ;\n' +
		' vec3 diffuse;\n' +
		' vec3 speculr;\n' +
		'float e64;\n' +

		'  vec3 normal = v_Normal; \n' +
		'  vec3 lightDirection;\n' +
		'  vec3 eyeDirection; \n' +

		'  float nDotL; \n' +

		'  vec3 H ; \n' +
		'  float nDotH; \n' +


		'if(abs(mode3-1.0)<0.0001||abs(mode3-2.0)<0.0001){\n'+
			'for(int j=0;j<6;j++){\n'+//deal with materials
				'if(abs(obj3-float(j))<0.0001){\n'+
					'for(int i=0;i<3;i++){\n'+//add all light sources in the array
						'  vec3 lightDirection = normalize(larray1[i].pos- v_Position.xyz);\n' +
						'  vec3 eyeDirection = normalize(u_eyePosWorld3 - v_Position.xyz); \n' +
						
						'  float nDotL = max(dot(lightDirection, normal), 0.0); \n' +

						'vec3 reflectDir;\n'+
						'float nDotH; \n' +
						'float e64;\n' +
						//bling phong
						'if(abs(mode3-2.0)<0.0001){\n'+
							'H = normalize(lightDirection + eyeDirection); \n' +
							'nDotH = max(dot(H, normal), 0.0); \n' +
							'e64 = pow(nDotH, mate1[j].shi);\n' +
						'}\n'+
						//phong
						'if(abs(mode3-1.0)<0.0001){\n'+
							'reflectDir=reflect(-lightDirection,normal);\n'+
							'nDotH=max(dot(reflectDir, eyeDirection), 0.0); \n' +
							'e64 = pow(nDotH, mate1[j].shi/4.0);\n' +
						'}\n'+

						'if(i==0){\n'+
							'  emissive = mate1[j].emi;' +
							'   ambient = larray1[i].amb * mate1[j].amb;\n' +
							'  diffuse = larray1[i].dif * mate1[j].dif * nDotL;\n' +
							'  speculr = larray1[i].spe * mate1[j].spe * e64;\n' +
						'}\n'+
						'else{\n'+
							'  emissive += mate1[j].emi;' +
							'   ambient += larray1[i].amb * mate1[j].amb;\n' +
							'  diffuse += larray1[i].dif * mate1[j].dif * nDotL;\n' +
							'  speculr += larray1[i].spe * mate1[j].spe * e64;\n' +
						'}\n'+
					'}\n'+
				'}\n'+
			'}\n'+
			'  forFragColor = vec4(emissive+ ambient + diffuse + speculr , 1.0);\n' +
		'}\n'+
	






	'}\n';
// Fragment shader program----------------------------------
var FSHADER_SOURCE =
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	//-------------UNIFORMS: values set from JavaScript before a drawing command.
	// first light source: (YOU write a second one...)

	'varying vec4 forFragColor;\n'+

	'struct Lamp{\n'+//struct Lamp is used to store different light sources
		'vec3 pos;\n' + 			
		'vec3 amb;\n' +   
		'vec3 dif;\n' +   
		'vec3 spe;\n' +
	'};\n'+
	'uniform Lamp larray2[3];\n'+//construct an array of lightsources


	'struct Material{\n'+//struct Lamp is used to store different light sources		
		'vec3 amb;\n' +   
		'vec3 dif;\n' +   
		'vec3 spe;\n' +
		'vec3 emi;\n' +
		'float shi;\n' +
	'};\n'+
	'uniform Material mate2[6];\n'+//construct an array of materials



	
	// first material definition: you write 2nd, 3rd, etc.

	//
	

	'varying float obj3;\n'+//use to identify different object
	'varying float mode3;\n'+

	
	//-------------VARYING:Vertex Shader values sent per-pixel to Fragment shader: 
	'varying vec3 u_eyePosWorld3; \n' + 	// Camera/eye location in world coords.
	'varying vec3 v_Normal;\n' +				// Find 3D surface normal at each pix
	'varying vec4 v_Position;\n' +			// pixel's 3D pos too -- in 'world' coords


	'uniform sampler2D u_Sampler;\n' +
	'varying vec2 v_TexCoord;\n' +


	'void main() { \n' +


		' vec3 emissive;\n' +
		' vec3 ambient ;\n' +
		' vec3 diffuse;\n' +
		' vec3 speculr;\n' +
		' float e64;\n' +

		'  vec3 normal = v_Normal; \n' +

		'  vec3 lightDirection;\n' +
		'  vec3 eyeDirection; \n' +




		'  float nDotL; \n' +

		'  vec3 H ; \n' +
		'  float nDotH; \n' +

		//deal with materials
		'if(abs(mode3-3.0)<0.0001||abs(mode3-4.0)<0.0001||abs(mode3-7.0)<0.0001||abs(mode3-8.0)<0.0001||abs(mode3-9.0)<0.0001||abs(mode3-0.0)<0.0001){\n'+
			'for(int j=0;j<6;j++){\n'+
				'if(abs(obj3-float(j))<0.0001){\n'+
					'for(int i=0;i<3;i++){\n'+//add all light sources in the array
						'  vec3 lightDirection = normalize(larray2[i].pos- v_Position.xyz);\n' +
						'  vec3 eyeDirection = normalize(u_eyePosWorld3 - v_Position.xyz); \n' +
						'  float lightDistance = distance(larray2[i].pos, v_Position.xyz);\n' +	
						'  float nDotL = max(dot(lightDirection, normal), 0.0); \n' +

						'vec3 reflectDir;\n'+
						'float nDotH; \n' +
						'float e64;\n' +
						//bling phong
						'if(abs(mode3-4.0)<0.0001||abs(mode3-7.0)<0.0001||abs(mode3-8.0)<0.0001||abs(mode3-9.0)<0.0001||abs(mode3-0.0)<0.0001){\n'+
							'H = normalize(lightDirection + eyeDirection); \n' +
							'nDotH = max(dot(H, normal), 0.0); \n' +
							'e64 = pow(nDotH, float(mate2[j].shi));\n' +
						'}\n'+
						//phong
						'if(abs(mode3-3.0)<0.0001){\n'+
							'reflectDir=reflect(-lightDirection,normal);\n'+
							'nDotH=max(dot(reflectDir, eyeDirection), 0.0); \n' +
							'e64 = pow(nDotH, mate2[j].shi/4.0);\n' +
						'}\n'+

						'float coe=1.0;'+
						'if(abs(mode3-7.0)<0.0001){\n'+
							'coe=1.0;'+
						'}\n'+
						'if(abs(mode3-8.0)<0.0001){\n'+
							'coe=1.0/lightDistance;'+
						'}\n'+
						'if(abs(mode3-9.0)<0.0001){\n'+
							'coe=1.0/(lightDistance*lightDistance);'+
						'}\n'+
						'if(i==0){\n'+
							'  emissive = coe*mate2[j].emi;' +
							'   ambient = coe*larray2[i].amb * mate2[j].amb;\n' +
							'  diffuse = coe*larray2[i].dif * mate2[j].dif * nDotL;\n' +
							'  speculr = coe*larray2[i].spe * mate2[j].spe * e64;\n' +
						'}\n'+
						'else{\n'+
							'  emissive += coe*mate2[j].emi;' +
							'   ambient += coe*larray2[i].amb * mate2[j].amb;\n' +
							'  diffuse += coe*larray2[i].dif * mate2[j].dif * nDotL;\n' +
							'  speculr += coe*larray2[i].spe * mate2[j].spe * e64;\n' +
						'}\n'+
					'}\n'+
				'}\n'+
			'}\n'+
			'  gl_FragColor = vec4(emissive+ ambient + diffuse + speculr , 1.0);\n' +
		'}\n'+
		'if(abs(mode3-1.0)<0.0001||abs(mode3-2.0)<0.0001){\n'+
			'  gl_FragColor = forFragColor;\n' +
		'}\n'+
		//Cook-Torrance
		'if(abs(mode3-5.0)<0.0001){\n'+
			 'float roughnessValue = 0.1;'+
   			 'float F0 = 0.8;'+ 
   			 'float k = 0.2; '+//fraction of diffuse
    			'for(int j=0;j<6;j++){\n'+
				'if(abs(obj3-float(j))<0.0001){\n'+
					'for(int i=0;i<2;i++){\n'+//add all light sources in the array
						'  vec3 lightDirection = normalize(larray2[i].pos- v_Position.xyz);\n' +
						'  vec3 eyeDirection = normalize(u_eyePosWorld3 - v_Position.xyz); \n' +
									
						'  float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
						'float e64=0.0 ;'+
						'if(nDotL>0.0){'+
							'H = normalize(lightDirection + eyeDirection); \n' +
							'nDotH = max(dot(H, normal), 0.0); \n' +
							 'float NdotV = max(dot(normal, eyeDirection), 0.0);'+
							 'float VdotH = max(dot(eyeDirection, H), 0.0);'+
							 'float mSquared = roughnessValue * roughnessValue;'+
							'  float NH2 = 2.0 * nDotH;'+
	        					'float g1 = (NH2 * NdotV) / VdotH;'+
						        'float g2 = (NH2 * nDotL) / VdotH;'+
						        'float geoAtt = min(1.0, min(g1, g2));'+
						         'float r1 = 1.0 / ( 4.0 * mSquared * pow(nDotH, 4.0));'+
	        					'float r2 = (nDotH * nDotH - 1.0) / (mSquared * nDotH * nDotH);'+
	       						' float roughness = r1 * exp(r2);'+
	       						'float fresnel = pow(1.0 - VdotH, 5.0);'+
						       ' fresnel *= (1.0 - F0);'+
						       ' fresnel += F0;'+
						      ' float power = (fresnel * geoAtt * roughness) / (NdotV * nDotL * 3.14);'+
						      ' e64 = nDotL*(k+power*(1.0-k));'+
						'}\n'+ 

					      'if(i==0){\n'+
					      		'  emissive = mate2[j].emi;' +
							'   ambient = larray2[i].amb * mate2[j].amb;\n' +
							'  diffuse = larray2[i].dif * mate2[j].dif * nDotL;\n' +
					      		'  speculr = larray2[i].spe * mate2[j].spe * e64;\n' +
					      	'}\n'+
					      	'else{\n'+
							'  emissive += mate2[j].emi;' +
							'   ambient += larray2[i].amb * mate2[j].amb;\n' +
							'  diffuse += larray2[i].dif * mate2[j].dif * nDotL;\n' +
							'  speculr += larray2[i].spe * mate2[j].spe * e64;\n' +
						'}\n'+
					'}\n'+
				'}\n'+
			'}\n'+
			'  gl_FragColor = vec4(emissive+ ambient + diffuse + speculr , 1.0);\n' +	
		'}\n'+
		//Texture
		'if(abs(mode3-6.0)<0.0001){\n'+
			'  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
			//'  gl_FragColor = v_Position;\n' +	
		'}\n'+
	'}\n'

//global variables
	// Global Variables for the spinning tetrahedron:
	var ANGLE_STEP = 45.0;  // default rotation angle rate (deg/sec)

	// Global vars for mouse click-and-drag for rotation.
	var isDown=false;		// mouse-down: true when user holds down mouse button
	var isMove=false;
	var xMclik=0.0;			// last mouse button-down position (in CVV coords)
	var yMclik=0.0;   
	var xMdragTot=0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
	var yMdragTot=0.0;  

	var la=0.0;
	var ra=0.0;
	var ll=0.0;
	var rl=0.0;

	var xt=-0.0
	var yt=-0.0
	var currentAngle = 0.0;
	var st=0.3//robot scale factor
	var ct=1//clock scale factor
	//st=0
	//ct=0

	//projectB//
	var ss=100;//size of grid
	var canvas ;
	var epx=10;
	var epy=10;
	var epz=10;

	var qNew = new Quaternion(0,0,0,1); // most-recent mouse drag's rotation
	var qTot = new Quaternion(0,0,0,1);	// 'current' orientation (made from qNew)
	var quatMatrix = new Matrix4();				// rotation matrix, made from latest qTot
	var qsav=new Quaternion(0,0,0,1);
	var aa=new Object();
	var cal=0;//camera parameters
	var car=0;
	var cad=0;
	var cau=true;
	var can=true;
	var caf=true;
	var lab=true;
	var lan=true;
	var lam=true;


	var stag=0;
	var test=0;
	var sto=0;

	var taa1=-1;//store aa position
	var taa2=-1;
	var taa3=-1;

	var jo1=0; //joints parameters
	var jo2=0;
	var jo3=0;

	var voc=0.1;
	var roll=0;
	//projectB//
	


	//projectC//
	var	eyePosWorld = new Float32Array(3);	// x,y,z in world coords
	var mode=3.0;
	var ambR=0.4;
	var ambG=0.4;
	var ambB=0.4;
	var difR=1.0;
	var difG=1.0;
	var difB=1.0;
	var speR=0.0;
	var speG=0.0;
	var speB=1.0;


function main() {
	//==============================================================================
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');
	resizeCanvas();
	// Get the rendering context for WebGL
	var gl = getWebGLContext(canvas);

	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}

	// Initialize a Vertex Buffer in the graphics system to hold our vertices
	var n = initVertexBuffer(gl,currentAngle);
	if (n < 0) {
		console.log('Failed to set the vertex information');
		return;
	}

	// Register the Mouse & Keyboard Event-handlers-------------------------------
	// If users move, click or drag the mouse, or they press any keys on the 
	// the operating system will sense them immediately as 'events'.  
	// If you would like your program to respond to any of these events, you must // tell JavaScript exactly how to do it: you must write your own 'event 
	// handler' functions, and then 'register' them; tell JavaScript WHICH 
	// events should cause it to call WHICH of your event-handler functions.
	//
	// First, register all mouse events found within our HTML-5 canvas:
	canvas.onmousedown	=	function(ev){myMouseDown( ev, gl, canvas) }; 

	// when user's mouse button goes down call mouseDown() function
	canvas.onmousemove = 	function(ev){myMouseMove( ev, gl, canvas) };

	// call mouseMove() function					
	canvas.onmouseup = 		function(ev){myMouseUp(   ev, gl, canvas)};
	// NOTE! 'onclick' event is SAME as on 'mouseup' event
	// in Chrome Brower on MS Windows 7, and possibly other 
	// operating systems; use 'mouseup' instead.

	// Next, register all keyboard events found within our HTML webpage window:
	window.addEventListener("keydown", myKeyDown, false);
	window.addEventListener("keyup", myKeyUp, false);
	window.addEventListener("keypress", myKeyPress, false);
	// The 'keyDown' and 'keyUp' events respond to ALL keys on the keyboard,
	// 			including shift,alt,ctrl,arrow, pgUp, pgDn,f1,f2...f12 etc. 
	//			I find these most useful for arrow keys; insert/delete; home/end, etc.
	// The 'keyPress' events respond only to alpha-numeric keys, and sense any 
	//  		modifiers such as shift, alt, or ctrl.  I find these most useful for
	//			single-number and single-letter inputs that include SHIFT,CTRL,ALT.

	// END Mouse & Keyboard Event-Handlers-----------------------------------

	// Specify the color for clearing <canvas>
	//gl.clearColor(0.5, 0.5, 0.5, 1.0);
	
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// NEW!! Enable 3D depth-test when drawing: don't over-draw at any pixel 
	// unless the new Z value is closer to the eye than the old one..
	gl.depthFunc(gl.LESS);
	gl.enable(gl.DEPTH_TEST); 	  


	// Get handle to graphics system's storage location of u_ModelMatrix
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrix) { 
		console.log('Failed to get the storage location of u_ModelMatrix');
		return;
	}
	var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	if (!u_MvpMatrix) { 
		console.log('Failed to get the storage location of u_MvpMatrix');
		return;
	}

	var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
	if (!u_NormalMatrix) { 
		console.log('Failed to get the storage location of u_NormalMatrix');
		return;
	}
	// Create a local version of our model matrix in JavaScript 
	var modelMatrix = new Matrix4();

	// var hud = document.getElementById('hud');  
	// console.log(hud);
	// var ctx=hud.getContext('2d');
	//   ctx.clearRect(0, 0, 400, 400); // Clear <hud>
	//   // Draw triangle with white lines
	// ctx.beginPath();                      // Start drawing
	// ctx.moveTo(120, 10); ctx.lineTo(200, 150); ctx.lineTo(40, 150);
	// ctx.closePath();
	// ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; // Set white to color of lines
	// ctx.stroke();                           // Draw Triangle with white lines
	// // Draw white letters
	// ctx.font = '18px "Times New Roman"';
	// ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
	// ctx.fillText('HUD: Head Up Display', 40, 180); 
	// ctx.fillText('Triangle is drawn by Canvas 2D API.', 40, 200); 
	// ctx.fillText('Cube is drawn by WebGL API.', 40, 220); 
	





	// ANIMATION: create 'tick' variable whose value is this function:
	//----------------- 
	var tick = function() {

		shaderMode(gl,mode);




		resizeCanvas();//resize canvas in each frame

		gl.viewport(0, 0, canvas.width/1, canvas.height/1);


		
		currentAngle = animate(currentAngle);  // Update the rotation angle
		draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);   // Draw shapes

		//draw2(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
		//    console.log('currentAngle=',currentAngle); // put text in console.

		//	Show some always-changing text in the webpage :  
		//		--find the HTML element called 'CurAngleDisplay' in our HTML page,
		//			 	(a <div> element placed just after our WebGL 'canvas' element)
		// 				and replace it's internal HTML commands (if any) with some
		//				on-screen text that reports our current angle value:
		//		--HINT: don't confuse 'getElementByID() and 'getElementById()

		// gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height/1);
		// draw2(gl, n, currentAngle, modelMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);


		document.getElementById('CurAngleDisplay').innerHTML= 
		'CurrentAngle= '+currentAngle;
		// Also display our current mouse-dragging state:
		document.getElementById('Mouse').innerHTML=
		'Mouse Drag totals (CVV coords):\t'+xMdragTot+', \t'+yMdragTot;	
		//--------------------------------
		requestAnimationFrame(tick, canvas);   
		// Request that the browser re-draw the webpage
		// (causes webpage to endlessly re-draw itself)
	};
	tick();							// start (and continue) animation: draw current image
}

function initVertexBuffer(gl,currentAngle) {
	//==============================================================================
	var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
	var sq2	= Math.sqrt(2.0);
	var sq13=Math.sqrt(1/3);						 
	var d=new Date();
	var tt =([
	//back and front
	-1,-1, -1,1,0,0,-1,//formula is used to make color change smoothly and in range.
	-1, 1, -1, 1,0,0,-1,
	1, 1, -1, 1,0,0,-1,
	1,1, -1, 1, 0,0,-1,
	1, -1, -1, 1, 0,0,-1,
	-1,  -1.0, -1, 1, 0,0,-1,

	-1,-1,1,1,0,0,1,
	-1,1,1,1,0,0,1,
	1,1,1,1, 0,0,1,   
	1,1,1,1,0,0,1,
	1,-1,1,1,0,0,1,
	-1,-1,1,1,0,0,1,

	//left and right
	-1,-1,-1,1,-1,0,0,
	-1,1,-1,1,-1,0,0,
	-1,1,1,1, -1,0,0,
	-1,-1,-1,1,-1,0,0,
	-1,-1,1,1,-1,0,0,
	-1,1,1,1,-1,0,0,

	1,-1,-1,1,1,0,0,
	1,1,-1,1,1,0,0,
	1,1,1,1, 1,0,0,   
	1,-1,-1,1,1,0,0,
	1,-1,1,1,1,0,0,
	1,1,1,1,1,0,0,

	//up and down
	-1,1,-1,1,0,1,0,
	1,1,-1,1,0,1,0,
	-1,1,1,1, 0,1,0,   
	1,1,-1,1,0,1,0,
	-1,1,1,1,0,1,0,
	1,1,1,1,0,1,0,

	-1,-1,-1,1,0,-1,0,
	1,-1,-1,1,0,-1,0,
	-1,-1,1,1, 0,-1,0,    
	1,-1,-1,1,0,-1,0,
	-1,-1,1,1,0,-1,0,
	1,-1,1,1,0,-1,0,

	//prism
	-1,-sq13,-1,1,0,0,0,
	1,-sq13,-1,1,0,0,0,
	0,2*sq13,-1,1,0,0,0,

	-1,-sq13,1,1,0,0,0,
	1,-sq13,1,1,0,0,0,
	0,2*sq13,1,1,0,0,0,

	0,2*sq13,-1,1,0,0,0,
	-1,-sq13,1,1,0,0,0,
	0,2*sq13,1,1,0,0,0,
	-1,-sq13,-1,1,0,0,0,
	0,2*sq13,-1,1,0,0,0,
	-1,-sq13,1,1,0,0,0,

	1,-sq13,-1,1,0,0,0,
	0,2*sq13,-1,1,0,0,0,
	0,2*sq13,1,1,0,0,0,
	1,-sq13,1,1,0,0,0,
	0,2*sq13,1,1,0,0,0,
	1,-sq13,-1,1,0,0,0,

	-1,-sq13,-1,1,0,0,0,
	1,-sq13,-1,1,0,0,0,
	-1,-sq13,1,1,0,0,0,
	-1,-sq13,1,1,0,0,0,
	1,-sq13,1,1,0,0,0,
	1,-sq13,-1,1,0,0,0,
	]);
	//cone	
	tt=tt.concat([0,0,0,1,0,0,0]);
	var w=20;
	for(i=0;i<=2*w;i++){
		tt=tt.concat(Math.cos(Math.PI/w*i),Math.sin(Math.PI/w*i),0,1,0,0,0);
	}
	tt=tt.concat([0,0,1,1,0,0,0]);
	for(i=0;i<=2*w;i++){
		tt=tt.concat(Math.cos(Math.PI/w*i),Math.sin(Math.PI/w*i),0,1,0,0,0);
	}

	//12-prism
	//draw bases
	tt=tt.concat([0,0,0,1,0,0,-1]);
	var edge=12;
	for(i=0;i<=edge;i++){
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*i),Math.sin(Math.PI/(edge/2)*i),0,1,0,0,-1);
	}
	tt=tt.concat([0,0,1,1,0,0,1]);
	for(i=0;i<=edge;i++){
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*i),Math.sin(Math.PI/(edge/2)*i),1,1,0,0,1);
	}
	//draw sides
	tt=tt.concat(Math.cos(0),Math.sin(0),1,1,0,0,0);
	tt=tt.concat(Math.cos(0),Math.sin(0),0,1,0,0,0);
	for(i=0;i<=edge;i++){		
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),1,1,Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),0);
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),0,1,Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),0);
	}


	//ProjectB//
	//draw axes
	tt=tt.concat([0.0,  0.0,  0.0, 1.0,0,1,0,]);
	tt=tt.concat([1.3,  0.0,  0.0, 1.0,0,1,0,]);
	tt=tt.concat([0.0,  0.0,  0.0, 1.0,0,1,0,]);
	tt=tt.concat([0.0,  1.3,  0.0, 1.0,0,1,0,]);
	tt=tt.concat([0.0,  0.0,  0.0, 1.0,0,1,0,]);
	tt=tt.concat([0.0,  0.0,  1.3, 1.0,0,1,0,]);//206
	//draw grids
	for(i=-ss;i<=ss;i++){
		tt=tt.concat([-1,0.01*(2*Math.random()-1),i/ss,1,0,1,0,]);
		tt=tt.concat([1,0.01*(2*Math.random()-1),i/ss,1,0,1,0,]);
	}
	for(i=-ss;i<=ss;i++){
		tt=tt.concat([i/ss,0.01*(2*Math.random()-1),-1,1,0,1,0,]);
		tt=tt.concat([i/ss,0.01*(2*Math.random()-1),1,1,0,1,0,]);//206+8*100+4=1010
	}


	tt=tt.concat([0,0,0,1,0,0,-1]);
	var edge=50;
	for(i=0;i<=edge;i++){
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*i),Math.sin(Math.PI/(edge/2)*i),0,1,0,0,-1);
	}
	tt=tt.concat([0,0,1,1,0,0,1]);
	for(i=0;i<=edge;i++){
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*i),Math.sin(Math.PI/(edge/2)*i),1,1,0,0,1);
	}
	//draw sides
	tt=tt.concat(Math.cos(0),Math.sin(0),1,1,0,0,0);
	tt=tt.concat(Math.cos(0),Math.sin(0),0,1,0,0,0);
	for(i=0;i<=edge;i++){		
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),1,1,Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),0);
		tt=tt.concat(Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),0,1,Math.cos(Math.PI/(edge/2)*(i)),Math.sin(Math.PI/(edge/2)*(i)),0);
	}//1010+52+52+104=1218


	//ball
	// var SPHERE_DIV = 13;
	// var i, ai, si, ci;
	// var j, aj, sj, cj;
	// var aj2,sj2,cj2,s1;
	// for (j = 0; j <= SPHERE_DIV; j++) {
	// 	aj = j * Math.PI / SPHERE_DIV;
	// 	aj2=(j+1) * Math.PI / SPHERE_DIV;
	// 	sj = Math.sin(aj);
	// 	cj = Math.cos(aj);
	// 	sj2 = Math.sin(aj2);
	// 	cj2 = Math.cos(aj2);
	// 	for (i = 0; i <= SPHERE_DIV; i++) {
	// 		ai = i * 2 * Math.PI / SPHERE_DIV;
	// 		si = Math.sin(ai);
	// 		ci = Math.cos(ai);

	// 		tt=tt.concat(si * sj, cj, ci * sj,1,si * sj, cj, ci * sj);
	// 		tt=tt.concat(si * sj2, cj2, ci * sj2,1,si * sj2, cj2, ci * sj2);
	// 	}
	// }


	//indices
	// tt=tt.concat([1,1,1,1,1,1,1,0,0,0,]);
	// tt=tt.concat([-1,1,1,1,1,0,1,0,0,0,]);
	// tt=tt.concat([-1,-1,1,1,1,0,0,0,0,0,]);
	// tt=tt.concat([1,-1,1,1,1,1,0,0,0,0,]);
	// tt=tt.concat([1,-1,-1,1,0,1,0,0,0,0,]);
	// tt=tt.concat([1,1,-1,1,0,1,1,0,0,0,]);
	// tt=tt.concat([-1,1,-1,1,0,0,1,0,0,0,]);
	// tt=tt.concat([-1,-1,-1,1,0,0,0,0,0,0,]);

	//EndprojectB//
	
	var colorShapes=new Float32Array(tt); 
	
	//var xx=new Float32Array(500);
	//xx.set(colorShapes);
	


	var nn = 54;		// 12 tetrahedron vertices.
	// we can also draw any subset of these we wish,
	// such as the last 3 vertices.(onscreen at upper right)




	// var indices = new Uint8Array([


 //  		0, 1, 2,   0, 2, 4,    // front
	// 	290, 292, 294,   292, 294, 295,    // right
	// 	//290, 295, 296,   290, 296, 291,    // up
	// 	// 291, 296, 297,   291, 297, 292,    // left
	// 	// 297, 294, 293,   297, 293, 292,    // down
	// 	// 294, 297, 296,   294, 296, 295     // back
	// ]);

	// Create a buffer object
	var shapeBufferHandle = gl.createBuffer();  
	//var indexBuffer = gl.createBuffer();
 	if (!shapeBufferHandle ) {
    		console.log('Failed to create the shape buffer object');
		return false;
 	 }


	// Bind the the buffer object to target:
	gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferHandle);
	// Transfer data from Javascript array colorShapes to Graphics system VBO
	// (Use sparingly--may be slow if you transfer large shapes stored in files)
	gl.bufferData(gl.ARRAY_BUFFER, colorShapes, gl.STATIC_DRAW);
	
	
	


	var FSIZE = colorShapes.BYTES_PER_ELEMENT; // how many bytes per stored value?

	


	//Get graphics system's handle for our Vertex Shader's position-input variable: 
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}
	// Use handle to specify how to retrieve position data from our VBO:
	gl.vertexAttribPointer(
			a_Position, 	// choose Vertex Shader attribute to fill with data
			4, 						// how many values? 1,2,3 or 4.  (we're using x,y,z,w)
			gl.FLOAT, 		// data type for each value: usually gl.FLOAT
			false, 				// did we supply fixed-point data AND it needs normalizing?
			FSIZE * 7, 		// Stride -- how many bytes used to store each vertex?
			// (x,y,z,w, r,g,b) * bytes/value
			0);						// Offset -- now many bytes from START of buffer to the
	// value we will actually use?
	gl.enableVertexAttribArray(a_Position);  
	// Enable assignment of vertex buffer object's position data
	//console.log("po");
	// Get graphics system's handle for our Vertex Shader's color-input variable;

	var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
	if(a_Normal < 0) {
		console.log('Failed to get the storage location of a_Normal');
		return -1;
	}
	gl.vertexAttribPointer(a_Normal,3,gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
	gl.enableVertexAttribArray(a_Normal);  
	//console.log("po3");

	//console.log("po2");
	// Enable assignment of vertex buffer object's position data
	

	// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
 //  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	//--------------------------------DONE!
	// Unbind the buffer object 
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return nn;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix) {
	//==============================================================================
	// Clear <canvas>  colors AND the depth buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//clear out of draw function

	clrColr = new Float32Array(4);
	clrColr = gl.getParameter(gl.COLOR_CLEAR_VALUE);


	//ProjectB//

	// modelMatrix.setTranslate(0,0,0);
	// gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	// gl.drawElements(gl.TRIANGLES, 9, gl.UNSIGNED_BYTE, 0);
	


	//grid
	modelMatrix.setTranslate(0, 0, 0.0);
	//drawAxes(gl,currentAngle,modelMatrix,u_ModelMatrix);//draw axes at the origin point

	//modelMatrix.lookAt(epx, epy, epz,lpx, lpy, xxz, 0, 1, 0);
	//modelMatrix.lookAt(2+3*qTot.x, 2+3*qTot.y, 2+3*qTot.z,lpx, lpy, 0, 0, 1, 0);
	// var dist = Math.sqrt(xMdragTot*xMdragTot + yMdragTot*yMdragTot);
	// modelMatrix.lookAt(3, 3-yMdragTot, 3+xMdragTot, lpx, lpy, 0, 0, 1, 0);
	//modelMatrix.lookAt(epx, epy, epz,epx-1, epy-1, epz-1, 0, 1, 0);
	
	
	//quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
	//modelMatrix.concat(quatMatrix);	
	//modelMatrix.lookAt(epx, epy, epz, epx-0.1+qTot.x, epy-0.1+qTot.y, epz-0.1+qTot.z, 0, 1, 0);
	// var the=(xMdragTot%(2*Math.PI));
	// var det=(yMdragTot%(2*Math.PI));
	// modelMatrix.lookAt(epx, epy, epz,epx-Math.sin(the), epy+Math.sin(det), epz-Math.cos(the), 0, 1, 0);
	
	//console.log("dist"+dist+" x "+xMdragTot);

	var mvpMatrix = new Matrix4();
	mvpMatrix.setPerspective(40, 0.5*canvas.width/canvas.height, 0.001, 100);//choose proper  aspect ratio to prevent distortion



	
	if(sto==0){
		aa.x=taa1;
		aa.y=taa2;
		aa.z=taa3;
		qTot.multiplyVector3(aa);
	}
	else{
		if(sto==1){
			qsav.copy(qTot);
		}
		aa.x=taa1;
		aa.y=taa2;
		aa.z=taa3;
		qsav.multiplyVector3(aa);
		sto=2;
	}

	if(test==1){//jump to a easy to view point
		epx=0;
		epy=1;
		epz=3;
		taa1=0;
		taa2=0;
		taa3=-1;
		clearDrag();
		qTot.clear();
		test=0;
	}

	mvpMatrix.lookAt(epx, epy, epz,epx+aa.x, epy+aa.y, epz+aa.z, Math.sin(roll), Math.cos(roll),0);


	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);


	




	// gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// modelMatrix.scale(20,1,1);
	// modelMatrix.translate(0,0,-10);
	// gl.drawArrays(gl.LINES, 206, 2);
	// for(var i=0;i<200;i++){
	// 	modelMatrix.translate(0,0,0.2);
	// 	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	// 	gl.drawArrays(gl.LINES, 206, 2);
	// }

	//ProjectB//

	//draw grid
	var uxx = gl.getUniformLocation(gl.program, 'xx');
	gl.uniform1f(uxx, 1.0);
	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,5.0);
	pushMatrix(modelMatrix);	
	modelMatrix.scale(ss/5,ss/5,ss/5);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	//gl.drawArrays(gl.LINES, 206, 8*ss+4);
	gl.drawArrays(gl.TRIANGLE_STRIP, 206, 8*ss+4);
	drawAxes(gl,currentAngle,modelMatrix,u_ModelMatrix);
	modelMatrix = popMatrix();
	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,0.0);
	var uxx = gl.getUniformLocation(gl.program, 'xx');
	gl.uniform1f(uxx, 0.0);
	//draw robot
	drawRobot(gl, n, currentAngle, modelMatrix,mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawClock(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawTree(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawFan(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawHouse(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawCone(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawMailbox(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawTexture(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	

}


function draw2(gl, n, currentAngle, modelMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix) {
	//==============================================================================
	// Clear <canvas>  colors AND the depth buffer
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	clrColr = new Float32Array(4);
	clrColr = gl.getParameter(gl.COLOR_CLEAR_VALUE);


	//ProjectB//

	// modelMatrix.setTranslate(0,0,0);
	// gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	// gl.drawElements(gl.TRIANGLES, 9, gl.UNSIGNED_BYTE, 0);
	


	//grid
	modelMatrix.setTranslate(0, 0, 0.0);

	var mvpMatrix = new Matrix4();
	//mvpMatrix.setPerspective(40, 0.5*canvas.width/canvas.height, 0.001, 100);//choose proper  aspect ratio to prevent distortion
	//mvpMatrix.setOrtho(-1/800*canvas.width+cal,1/800*canvas.width,-1/400*canvas.height,1/400*canvas.height,0.01,100);
	mvpMatrix.setOrtho((-0.8+cal)*canvas.width/canvas.height,0.8*canvas.width/canvas.height+car,-1.6+cad,1.6+cau,0.01+can,100+caf);//multiplied by the ratio to prevent distortion
	
	if(sto==0){
		aa.x=taa1;
		aa.y=taa2;
		aa.z=taa3;
		qTot.multiplyVector3(aa);
	}
	else{
		if(sto==1){
			qsav.copy(qTot);
		}
		aa.x=taa1;
		aa.y=taa2;
		aa.z=taa3;
		qsav.multiplyVector3(aa);
		sto=2;
	}

	if(test==1){//jump to a easy to view point
		epx=0;
		epy=1;
		epz=3;
		taa1=0;
		taa2=0;
		taa3=-1;
		clearDrag();
		qTot.clear();
		test=0;
	}

	mvpMatrix.lookAt(epx, epy, epz,epx+aa.x, epy+aa.y, epz+aa.z, Math.sin(roll), Math.cos(roll),0);															

	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
	

	pushMatrix(modelMatrix);	
	modelMatrix.scale(ss/5,ss/5,ss/5);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.drawArrays(gl.LINES, 206, 8*ss+4);
	drawAxes(gl,currentAngle,modelMatrix,u_ModelMatrix);
	modelMatrix = popMatrix();


	 drawRobot(gl, n, currentAngle, modelMatrix, mvpMatrix,u_ModelMatrix,u_MvpMatrix,u_NormalMatrix)
	drawClock(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);

	drawTree(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawHouse(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawCone(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	drawMailbox(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
}

function drawAxes(gl,currentAngle,modelMatrix,u_ModelMatrix){
	/*modelMatrix.setTranslate(0, 0, 0.0);
	modelMatrix.setPerspective(30, 1, 1, 100);
	modelMatrix.lookAt(3, 3, 3,0, 0, 0, 0, 1, 0);*/
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.drawArrays(gl.LINES, 200, 6);
}

function drawRobot(gl, n, currentAngle, modelMatrix, mvpMatrix,u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){

	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,1.0);
	// var uobj=gl.getUniformLocation(gl.program, 'obj2');
	// gl.uniform1i(uobj,1);



	var s=0.70;
	modelMatrix.setTranslate(0,s,0);
	modelMatrix.translate(xt, yt, 0.0);  // 'set' means DISCARD old matrix,
	//modelMatrix.scale(1,1,-1);							// convert to left-handed coord sys
	// to match WebGL display canvas.
	modelMatrix.scale(0.3*st, 0.3*st, 0.3*st);				// Make it smaller.
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	// Draw triangles: start at vertex 0 and draw 12 vertices
	gl.drawArrays(gl.TRIANGLES, 0, 36);


	//left eye
	pushMatrix(modelMatrix);	
	modelMatrix.translate(-0.5,0.33,1.0);
	modelMatrix.scale(0.33, 0.33, 0.33);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_FAN, 60, 42);
	gl.drawArrays(gl.TRIANGLE_FAN, 102, 42);
	modelMatrix = popMatrix();

	//right eye
	pushMatrix(modelMatrix);	
	modelMatrix.translate(0.5,0.33,1.0);
	modelMatrix.scale(0.33, 0.33, 0.33);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_FAN, 60, 42);
	gl.drawArrays(gl.TRIANGLE_FAN, 102, 42);
	modelMatrix = popMatrix();

	//nose

	pushMatrix(modelMatrix);	
	modelMatrix.translate(0.0,0.0,1.0);
	modelMatrix.scale(0.33, 0.33, 0.33);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 36, 24);
	modelMatrix = popMatrix();


	//mouth
	pushMatrix(modelMatrix);	
	modelMatrix.translate(0.0,-0.577,1.0);
	modelMatrix.scale(0.6, 0.1, 0.1);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_FAN, 144, 14);
	gl.drawArrays(gl.TRIANGLE_FAN, 158, 14);
	gl.drawArrays(gl.TRIANGLE_STRIP, 172, 28);
	modelMatrix = popMatrix();

	//body
	modelMatrix.setTranslate(0,s,0);
	modelMatrix.translate(xt, yt, 0.0); 
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	modelMatrix.translate(0,-0.8*st,0);
	modelMatrix.scale(0.4*st, 0.5*st, 0.5*st);//scale at last
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	//left arm
	modelMatrix.setTranslate(0,s,0);
	modelMatrix.translate(xt, yt, 0.0); 
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	modelMatrix.translate(-0.5*st,-0.5*st,0);	
	modelMatrix.rotate((Math.abs(currentAngle)-90)*0.5,0,0,1);

	pushMatrix(modelMatrix);
	modelMatrix.translate(-0.5*st,0,0);//move rotation axis from the center of the arm to one end of the arm.
	modelMatrix.scale(0.4*st, 0.15*st, 0.15*st);
	modelMatrix.translate(0.5,0,0);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	modelMatrix = popMatrix();

	//second left arm
	//inherit from modelMatrix, so the initial rotation in first arm is preserved.
	modelMatrix.translate(-1.2*st,0,0);//first translate to the right position
		
	modelMatrix.translate(0.5*st,0,0);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate((Math.abs(currentAngle)-90)*(0.5+jo1),0,0,1);
	modelMatrix.translate(-0.5*st,0,0);

	pushMatrix(modelMatrix);
	modelMatrix.scale(0.5*st, 0.10*st, 0.10*st);//scale at last and must be only done in current object.

	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	modelMatrix = popMatrix();

	//paw
	modelMatrix.translate(-0.8*st,0,0);

	

	modelMatrix.translate(0.3*st,0,0);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate((Math.abs(currentAngle)-90)*(1+jo2),0,1,0);
	modelMatrix.translate(-0.3*st,0,0);

	pushMatrix(modelMatrix);
	modelMatrix.scale(0.5*st, 0.5*st, 0.50*st);
	//drawAxes(gl,currentAngle,modelMatrix,u_ModelMatrix);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
	modelMatrix.scale(0.3*st, 0.30*st, 0.02*st);//scale at last and must be only done in current object.

	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.drawArrays(gl.TRIANGLES, 0, 36);
	modelMatrix = popMatrix();

	//left finger
	pushMatrix(modelMatrix);
	modelMatrix.translate(-0.50*st,0.15*st,0);
	modelMatrix.translate(0.3*st,0,0);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate(Math.abs(currentAngle)*(1/6+jo3),0,0,1);
	modelMatrix.translate(-0.3*st,0,0);
	modelMatrix.scale(0.2*st, 0.02*st, 0.02*st);//scale at last and must be only done in current object.
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	modelMatrix = popMatrix();
	//right finger
	modelMatrix.translate(-0.50*st,-0.15*st,0);
	modelMatrix.translate(0.3*st,0,0);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate(-Math.abs(currentAngle)*(1/6+jo3),0,0,1);
	modelMatrix.translate(-0.3*st,0,0);
	modelMatrix.scale(0.2*st, 0.02*st, 0.02*st);//scale at last and must be only done in current object.
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);



	//right arm
	modelMatrix.setTranslate(0,s,0);
	modelMatrix.translate(xt, yt, 0.0); 
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	modelMatrix.translate(0.5*st,-0.5*st,0);
	modelMatrix.rotate(-ra,0,0,1);
	//modelMatrix.scale(1,1+0.005*Math.abs(currentAngle),1+0.005*Math.abs(currentAngle));
	//modelMatrix.translate(0,-0.0001*Math.abs(currentAngle),0);
	modelMatrix.translate(0.5*st,0,0);
	modelMatrix.scale(0.6*st, 0.15*st, 0.15*st);	
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	//left leg
	modelMatrix.setTranslate(0,s,0);
	modelMatrix.translate(xt, yt, 0.0); 
	//modelMatrix.rotate(currentAngle, 0, 1, 0);

	modelMatrix.translate(-0.2*st,-1.8*st,0);
	
	modelMatrix.translate(0,0.5*st,0);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate(-ll,1,0,0);
	modelMatrix.translate(0,-0.5*st,0);
	
	modelMatrix.scale(0.15*st, 0.5*st, 0.15*st);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	//right leg
	modelMatrix.setTranslate(0,s,0);
	modelMatrix.translate(xt, yt, 0.0); 
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	modelMatrix.translate(0.2*st,-1.8*st,0);
	modelMatrix.translate(0,0.5*st,0);
	modelMatrix.rotate(-rl,1,0,0);
	modelMatrix.translate(0,-0.5*st,0);
	modelMatrix.scale(0.15*st, 0.5*st, 0.15*st);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);	


	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,0.0);
	// var uobj=gl.getUniformLocation(gl.program, 'obj2');
	// gl.uniform1i(uobj,0);

}

function drawClock(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){
	
	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,4.0);

	//draw base

	modelMatrix.setTranslate(1.2,0.5, 0.0);
	modelMatrix.scale(ct,ct,ct);

	quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
	modelMatrix.concat(quatMatrix);	
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	modelMatrix.scale(0.45, 0.45, 0.2);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_FAN, 1010, 52);
	gl.drawArrays(gl.TRIANGLE_FAN, 1062, 52);
	gl.drawArrays(gl.TRIANGLE_STRIP, 1114, 104);
	//draw stand of watch hand
	modelMatrix.setTranslate(1.2,0.5, 0.0);
	modelMatrix.scale(ct,ct,ct);
	quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
	modelMatrix.concat(quatMatrix);	
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	modelMatrix.scale(0.02, 0.02, 0.08);
	modelMatrix.translate(0,0,3.6);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	//draw hour watch hands
	modelMatrix.setTranslate(1.2,0.5, 0.0);//first move arm to the same position of body
	modelMatrix.scale(ct,ct,ct);
	quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
	modelMatrix.concat(quatMatrix);	
	//modelMatrix.rotate(currentAngle, 0, 1, 0);//rotate along body with same speed
	var d=new Date();
	modelMatrix.rotate(90, 0, 0, 1);//rotate to the initial position.

	modelMatrix.rotate(-30*(d.getHours()+d.getMinutes()/60), 0, 0, 1);

	modelMatrix.translate(-0.1,0,0);//fix the position of watch hands.
	modelMatrix.scale(0.1, 0.02, 0.02);
	modelMatrix.translate(2,0,16);//translate after rotate is finished.	
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	//draw minute watch hands
	modelMatrix.setTranslate(1.2,0.5, 0.0);
	modelMatrix.scale(ct,ct,ct);
	quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
	modelMatrix.concat(quatMatrix);	
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	var d=new Date();
	modelMatrix.rotate(90, 0, 0, 1);//rotate to the initial position.
	modelMatrix.rotate(-6*(d.getMinutes()+d.getSeconds()/60), 0, 0, 1);
	modelMatrix.translate(-0.15,0,0);
	modelMatrix.scale(0.15, 0.015, 0.015);
	modelMatrix.translate(2,0,18);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	//draw second watch hands
	modelMatrix.setTranslate(1.2,0.5, 0.0);
	modelMatrix.scale(ct,ct,ct);
	quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
	modelMatrix.concat(quatMatrix);	
	//modelMatrix.rotate(currentAngle, 0, 1, 0);
	var d=new Date();
	modelMatrix.rotate(90, 0, 0, 1);//rotate to the initial position.
	modelMatrix.rotate(-6*d.getSeconds(), 0, 0, 1);
	//console.log(d.getSeconds());
	modelMatrix.translate(-0.2,0,0);
	modelMatrix.scale(0.2, 0.01, 0.01);
	modelMatrix.translate(2,0,24);
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,0.0);
}

function drawTree(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){
	
	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,2.0);

	modelMatrix.setTranslate(0.8,0.6, -1.6);
	modelMatrix.rotate(90,1,0,0);
	

	modelMatrix.translate(0,0,0.6);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate((Math.abs(currentAngle)-90)*(0.04),0,1,0);
	modelMatrix.translate(0,0,-0.6);

	pushMatrix(modelMatrix);
	modelMatrix.scale(0.15,0.15,0.6);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLE_FAN, 1010, 52);
	gl.drawArrays(gl.TRIANGLE_FAN, 1062, 52);
	gl.drawArrays(gl.TRIANGLE_STRIP, 1114, 104);
	modelMatrix = popMatrix();



	


	for(i=0;i<5;i++){
		modelMatrix.translate(0,0,-0.6);

		modelMatrix.translate(0,0,0.6);//this three step is standard for rotating around an end of object 
		modelMatrix.rotate((Math.abs(currentAngle)-90)*(0.04),0,1,0);
		modelMatrix.translate(0,0,-0.6);

		pushMatrix(modelMatrix);
		modelMatrix.scale(0.15,0.15,0.6);
		drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
		gl.drawArrays(gl.TRIANGLE_FAN, 1010, 52);
		gl.drawArrays(gl.TRIANGLE_FAN, 1062, 52);
		gl.drawArrays(gl.TRIANGLE_STRIP, 1114, 104);
		modelMatrix = popMatrix();

	}

	modelMatrix.translate(0,0,-0.05);

	modelMatrix.translate(0,0,0.6);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate((Math.abs(currentAngle)-90)*(0.04),0,1,0);
	modelMatrix.translate(0,0,-0.6);

	pushMatrix(modelMatrix);
	modelMatrix.scale(1,1,0.1);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLE_FAN, 1010, 52);
	gl.drawArrays(gl.TRIANGLE_FAN, 1062, 52);
	gl.drawArrays(gl.TRIANGLE_STRIP, 1114, 104);
	modelMatrix = popMatrix();

	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,0.0);
	//ball
	// modelMatrix.setTranslate(0,1.9,0);
	// modelMatrix.scale(0.3,0.3,0.3);
	// drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	// gl.drawArrays(gl.TRIANGLE_STRIP, 1218, 14*14*2);



}

function drawHouse(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){
	modelMatrix.setTranslate(-1.35,0.6, -1);
	modelMatrix.scale(0.5,0.5,0.8);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	modelMatrix.setTranslate(-1.35,1.27, -1);
	modelMatrix.scale(0.5,0.3,0.8);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 36, 24);

	modelMatrix.setTranslate(-1.15,0.8, -0.17);
	modelMatrix.scale(0.2,0.2,0.005);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function drawCone(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){
	modelMatrix.setTranslate(-1.0,0.3, 1.8);
	modelMatrix.rotate(90,0,1,0);
	modelMatrix.scale(0.20, 0.20, 0.01);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLE_FAN, 60, 42);
	gl.drawArrays(gl.TRIANGLE_FAN, 102, 42);

	modelMatrix.setTranslate(-1.0,0.3, 1);
	modelMatrix.rotate(90,0,1,0);
	modelMatrix.scale(0.20, 0.20, 0.01);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLE_FAN, 60, 42);
	gl.drawArrays(gl.TRIANGLE_FAN, 102, 42);

	modelMatrix.setTranslate(-1.05,0.3, 1.35);
	modelMatrix.scale(0.02, 0.02, 0.4);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	modelMatrix.setTranslate(-1.05,0.5, 1.75);
	modelMatrix.translate(0.5,0,0);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate(-40,1,0,0);
	modelMatrix.translate(-0.5,0,0);
	modelMatrix.scale(0.02, 0.2,0.02);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function drawMailbox(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){
	modelMatrix.setTranslate(-0.4,0.3, -1.6);
	modelMatrix.scale(0.02,0.3,0.02);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	modelMatrix.setTranslate(-0.4,0.6, -1.5);
	modelMatrix.scale(0.05,0.03,0.16);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	modelMatrix.setTranslate(-0.4,0.647, -1.5);
	modelMatrix.scale(0.05,0.03,0.16);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 36, 24);
}

function drawFan(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){

	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,3.0);




	modelMatrix.setTranslate(0.4,1.6, 1.8);
	modelMatrix.translate(0,-1.5,0);//this three step is standard for rotating around an end of object 
	modelMatrix.rotate((Math.abs(currentAngle)-90)*(0.06),1,0,0);
	modelMatrix.translate(0,1.5,0);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.04,1.5,0.04);
	drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	modelMatrix = popMatrix();

	modelMatrix.translate(0,1.5,-0.3);

	var xMatrix = new Matrix4();
	xMatrix.set(modelMatrix);

	for(var i=0;i<5;i++){
		modelMatrix.set(xMatrix);
		modelMatrix.translate(0,0,0.3);//this three step is standard for rotating around an end of object 
		modelMatrix.rotate(currentAngle*2+72*i,0,1,0);
		modelMatrix.translate(0,0,-0.3);
		pushMatrix(modelMatrix);
		modelMatrix.scale(0.04,0.04,0.3);
		drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
		modelMatrix = popMatrix();

		modelMatrix.translate(0,0,-0.6);
		
		modelMatrix.translate(0,0,0.3);//second arm
		modelMatrix.rotate(currentAngle*2,0,1,0);
		modelMatrix.translate(0,0,-0.3);
		modelMatrix.scale(0.04,0.04,0.3);
		drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
		
	}

	var uobj=gl.getUniformLocation(gl.program, 'obj');
	gl.uniform1f(uobj,0.0);
}

function drawTexture(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){
	initBufferForTexture(gl);
	initTextures(gl) ;
}

function initBufferForTexture(gl) {//assign texture attribute to each vertex

	var tt=[];
	tt=tt.concat([0,0,0,1,1,1,1,1,1,0,0,0,]);
	tt=tt.concat([0,0,0,1,1,1,1,1,1,0,0,0,]);
	tt=tt.concat([1,0,1,1,0,1,1,0,0,0,0,1,]);
	tt=tt.concat([1,0,1,1,0,1,1,0,0,0,0,1,]);
	tt=tt.concat([0,1,1,1,0,0,1,1,0,0,1,0,]);
	tt=tt.concat([0,1,1,1,0,0,1,1,0,0,1,0,]);
	for(i=0;i<300;i++){//attribute need to be assigned to each vertex
		//tt=tt.concat([0,1,0,0,1,1,1,0,]);
		tt=tt.concat([0,0,0,1,1,1,1,1,1,0,0,0,]);
		//tt=tt.concat([0,0,0,0,]);
	}
	var verticesTexCoords = new Float32Array(tt);
	
	var n = 4; // The number of vertices

	// Create the buffer object
	var vertexTexCoordBuffer = gl.createBuffer();
	if (!vertexTexCoordBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);


	var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
	//Get the storage location of a_Position, assign and enable buffer


	// Get the storage location of a_TexCoord
	var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	if (a_TexCoord < 0) {
		console.log('Failed to get the storage location of a_TexCoord');
		return -1;
	}
	// Assign the buffer object to a_TexCoord variable
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 2, 0);
	gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

}

function initTextures(gl) {
	var texture = gl.createTexture();   // Create a texture object
	if (!texture) {
		console.log('Failed to create the texture object');
		return false;
	}

	// Get the storage location of u_Sampler
	var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
	if (!u_Sampler) {
		console.log('Failed to get the storage location of u_Sampler');
		return false;
	}
	var image = new Image();  // Create the image object
	if (!image) {
		console.log('Failed to create the image object');
		return false;
	}
	// Register the event handler to be called on loading an image
	image.onload = function(){ loadTexture(gl, texture, u_Sampler, image); };
	// Tell the browser to load an image
	image.src = 'data:image/jpeg;base64,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';

	return true;
}

function loadTexture(gl,  texture, u_Sampler, image) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable texture unit0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler, 0);

	gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Draw the rectangle
}


// Last time that this function was called:  (used for animation timing)
var g_last = Date.now();

function animate(angle) {
	//==============================================================================
	// Calculate the elapsed time
	var now = Date.now();
	var elapsed = now - g_last;
	g_last = now;

	// Update the current rotation angle (adjusted by the elapsed time)
	//  limit the angle to move smoothly between +20 and -85 degrees:
	//  if(angle >  120.0 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
	//  if(angle < -120.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;

	var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	if(newAngle > 180.0) newAngle = newAngle - 360.0;
	if(newAngle <-180.0) newAngle = newAngle + 360.0;
	return newAngle;
}

//==================HTML Button Callbacks======================

function angleSubmit() {
	// Called when user presses 'Submit' button on our webpage
	//		HOW? Look in HTML file (e.g. ControlMulti.html) to find
	//	the HTML 'input' element with id='usrAngle'.  Within that
	//	element you'll find a 'button' element that calls this fcn.

	// Read HTML edit-box contents:
	var UsrTxt=document.getElementById('usrAngle').value;	
	// Display what we read from the edit-box: use it to fill up
	// the HTML 'div' element with id='Result':
	//document.getElementById('Result').innerHTML ='You Typed: '+UsrTxt;
};

function clearDrag() {
	// Called when user presses 'Clear' button in our webpage
	xMdragTot = 0.0;
	yMdragTot = 0.0;
}

function spinUp() {
	// Called when user presses the 'Spin >>' button on our webpage.
	// ?HOW? Look in the HTML file (e.g. ControlMulti.html) to find
	// the HTML 'button' element with onclick='spinUp()'.
	ANGLE_STEP += 25; 
}

function spinDown() {
	// Called when user presses the 'Spin <<' button
	ANGLE_STEP -= 25; 
}

function runStop() {
	// Called when user presses the 'Run/Stop' button
	if(ANGLE_STEP*ANGLE_STEP > 1) {
		myTmp = ANGLE_STEP;
		ANGLE_STEP = 0;
	}
	else {
		ANGLE_STEP = myTmp;
	}
}

function ambSubmit(){
	ambR=document.getElementById('ambR').value;
	ambG=document.getElementById('ambG').value;	
	ambB=document.getElementById('ambB').value;	
}
function difSubmit(){
	difR=document.getElementById('difR').value;
	difG=document.getElementById('difG').value;	
	difB=document.getElementById('difB').value;	
}
function speSubmit(){
	speR=document.getElementById('speR').value;
	speG=document.getElementById('speG').value;	
	speB=document.getElementById('speB').value;	
}
function clearLight(){
	ambR=0.4;
	ambG=0.4;
	ambB=0.4;
	difR=1.0;
	difG=1.0;
	difB=1.0;
	speR=1.0;
	speG=1.0;
	speB=1.0;
}


//===================Mouse and Keyboard event-handling Callbacks

function myMouseDown(ev, gl, canvas) {
	//==============================================================================
	// Called when user PRESSES down any mouse button;
	// 									(Which button?    console.log('ev.button='+ev.button);   )
	// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
	//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

	// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
	var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
	var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
	//  console.log('myMouseDown(pixel coords): xp,yp=\t',xp,',\t',yp);

	// Convert to Canonical View Volume (CVV) coordinates too:
	var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
		(canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
	(canvas.height/2);
	//	console.log('myMouseDown(CVV coords  ):  x, y=\t',x,',\t',y);

	isDown = true;											// set our mouse-dragging flag
	xMclik = x;													// record where mouse-dragging began
	yMclik = y;
};


function myMouseMove(ev, gl, canvas) {
	//==============================================================================
	// Called when user MOVES the mouse with a button already pressed down.
	// 									(Which button?   console.log('ev.button='+ev.button);    )
	// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
	//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  
	
	if(isDown==false) return;				// IGNORE all mouse-moves except 'dragging'
	isMove=true;
	// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
	var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
	var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
	//  console.log('myMouseMove(pixel coords): xp,yp=\t',xp,',\t',yp);

	// Convert to Canonical View Volume (CVV) coordinates too:
	var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
		(canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
	(canvas.height/2);
	//	console.log('myMouseMove(CVV coords  ):  x, y=\t',x,',\t',y);

	// find how far we dragged the mouse:
	xMdragTot += (x - xMclik);					// Accumulate change-in-mouse-position,&
	yMdragTot += (y - yMclik);

	dragQuat(x - xMclik, y - yMclik);

	xMclik = x;													// Make next drag-measurement from here.
	yMclik = y;
};

function myMouseUp(ev, gl, canvas) {
	//==============================================================================
	// Called when user RELEASES mouse button pressed previously.
	// 									(Which button?   console.log('ev.button='+ev.button);    )
	// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
	//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

	// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
	if(isDown==true){
		var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
		var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
		var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
	//  console.log('myMouseUp  (pixel coords): xp,yp=\t',xp,',\t',yp);

	// Convert to Canonical View Volume (CVV) coordinates too:
		var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
			(canvas.width/2);			// normalize canvas to -1 <= x < +1,
		var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
		(canvas.height/2);
		if(isMove==false){
			xt=x;
			yt=y;
		}		
		console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);
		isMove = false;
		isDown = false;											// CLEAR our mouse-dragging flag, and
	// accumulate any final bit of mouse-dragging we did:
	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);

	dragQuat(x - xMclik, y - yMclik);

	console.log('myMouseUp: xMdragTot,yMdragTot =',xMdragTot,',\t',yMdragTot);
	}
	else{
	}
};


function myKeyDown(ev) {
	//===============================================================================
	// Called when user presses down ANY key on the keyboard, and captures the 
	// keyboard's scancode or keycode(varies for different countries and alphabets).
	//  CAUTION: You may wish to avoid 'keydown' and 'keyup' events: if you DON'T 
	// need to sense non-ASCII keys (arrow keys, function keys, pgUp, pgDn, Ins, 
	// Del, etc), then just use the 'keypress' event instead.
	//	 The 'keypress' event captures the combined effects of alphanumeric keys and // the SHIFT, ALT, and CTRL modifiers.  It translates pressed keys into ordinary
	// ASCII codes; you'll get the ASCII code for uppercase 'S' if you hold shift 
	// and press the 's' key.
	// For a light, easy explanation of keyboard events in JavaScript,
	// see:    http://www.kirupa.com/html5/keyboard_events_in_javascript.htm
	// For a thorough explanation of the messy way JavaScript handles keyboard events
	// see:    http://javascript.info/tutorial/keyboard-events
	//

	switch(ev.keyCode) {			// keycodes !=ASCII, but are very consistent for 
		//	nearly all non-alphanumeric keys for nearly all keyboards in all countries.
		case 84://t is used as shift
			stag=1;
			break;
		case 74:		
			// print in console:
			if(stag==0){
				cal=cal-0.5;
			}
			else
				cal=cal+0.5;
			break;
		case 73:		
			cau=!cau;
			break;
		case 76:	
			if(stag==0){
				car=car-0.5;
			}
			else 
				car=car+0.5;
			break;
		case 75:		
			if(stag==0){
				cad=cad-0.5;
			}
			else
				cad=cad+0.5;
			break;
		case 85:		
			can=!(can);
			break;
		case 79:		
			caf=!(caf);
			break;

		case 65:
		ll=ll+1;
		break;
		case 68:
		ll=ll-1;
		break;
		case 83:
		rl+=1;
		break;
		case 87:
		rl-=1;
		break;
		case 81:
		st+=0.02;
		break;
		case 69:
		st-=0.02;
		break;
		case 82:
		ct+=0.02;
		break;
		case 70:
		ct-=0.02;
		break;
		//project B
		case  37:
			epx=epx-0.02*(-aa.z);
			epz=epz-0.02*(aa.x);
			break;
		case 39:
			epx=epx+0.02*(-aa.z);
			epz=epz+0.02*(aa.x);
			break;
		case 38:
			ev.preventDefault();
			epy=epy+0.02*(-aa.z);
			epz=epz+0.02*(aa.y);
			break;
		case 40:
			ev.preventDefault();
			epy=epy-0.02*(-aa.z);
			epz=epz-0.02*(aa.y);
			break;
		case 71:
			test=1;
			break;
		case 72:
			if(sto==0)
				sto=1;
			break;
		case 90:
			epx=epx+(voc)*aa.x;
			epy=epy+(voc)*aa.y;
			epz=epz+(voc)*aa.z;
			break;
		case 88:
			epx=epx-(voc)*aa.x;
			epy=epy-(voc)*aa.y;
			epz=epz-(voc)*aa.z;
			break;
		case 67:
			if(stag==0){
				if(voc>0.011)
					voc-=0.01;				
				console.log("velocity:"+voc);
			}
			else{
				voc+=0.01;
				console.log("velocity:"+voc);				
			}
			break;
		case 86:
			if(stag==0){
				roll-=0.01;
			}
			else{
				roll+=0.01;
			}

			break;
		case 66:
			lab=!(lab);
			break;
		case 78:			
			lan=!(lan);
			break;
		case 77:			
			lam=!(lam);
			break;
		case 80:
			if(stag==0)
				jo2+=0.01;
			else
				jo2-=0.01;
			break;
		case 89:
			if(stag==0)
				jo3+=0.01;
			else
				jo3-=0.01;
			break;
		case 49:
			mode=1.0;
			break;
		case 50:
			mode=2.0;
			break;
		case 51:
			mode=3.0;
			break;
		case 52:
			mode=4.0;
			break;
		case 53:
			mode=5.0;
			break;
		case 54:
			mode=6.0;
			break;
		case 55:
			mode=7.0;
			break;
		case 56:
			mode=8.0;
			break;
		case 57:
			mode=9.0;
			break;
		case 48:
			mode=0.0;
			break;

		default:
		console.log('myKeyDown()--keycode=', ev.keyCode, ', charCode=', ev.charCode);
		break;
	}
}

function myKeyUp(ev) {
	//===============================================================================
	switch(ev.keyCode){
		case 84:
			stag=0;
			break;
		case 72:
			sto=0;
			qTot.copy(qsav);
			break;

	}


	console.log('myKeyUp()--keyCode='+ev.keyCode+' released.');
}

function myKeyPress(ev) {
	//===============================================================================
	// Best for capturing alphanumeric keys and key-combinations such as 
	// CTRL-C, alt-F, SHIFT-4, etc.
	// console.log('myKeyPress():keyCode='+ev.keyCode  +', charCode=' +ev.charCode+
	// 	', shift='    +ev.shiftKey + ', ctrl='    +ev.ctrlKey +
	// 	', altKey='   +ev.altKey   +
	// 	', metaKey(Command key or Windows key)='+ev.metaKey);
}

function resizeCanvas() {
	var width = canvas.clientWidth;
	var height = canvas.clientHeight;
	if (canvas.width != width ||canvas.height != height) {
		 canvas.width = width;
		 canvas.height = height;
	   }
}

function dragQuat(xdrag, ydrag) {
	var res = 5;
	var qTmp = new Quaternion(0,0,0,1);
	var dist = Math.sqrt(xdrag*xdrag + ydrag*ydrag);
	aa.x=taa1;
	aa.y=taa2;
	aa.z=taa3;
	qTot.multiplyVector3(aa);
	//console.log(aa);
	qNew.setFromAxisAngle(-ydrag + 0.0001, xdrag + 0.0001, 0.0, dist*50.0);
	//qNew.setFromAxisAngle( -ydrag + 0.0001, 0, xdrag + 0.0001, dist*50.0);
	//qNew.setFromAxisAngle(-ydrag*aa.z + 0.0001, +xdrag*aa.z+0.0001 , (aa.x*ydrag-aa.y*xdrag)+0.0001, dist*50.0);	

	qTmp.multiply(qNew,qTot);			// apply new rotation to current rotation. gg
	qTot.copy(qTmp);
};

function drawPre(gl, n, currentAngle, modelMatrix, mvpMatrix, u_ModelMatrix,u_MvpMatrix,u_NormalMatrix){
	var normalMatrix=new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
}

function shaderMode(gl,mode){
	uLoc_eyePosWorld = gl.getUniformLocation(gl.program, 'u_eyePosWorld');

	uangle = gl.getUniformLocation(gl.program, 'angle');
	var d=new Date();
	gl.uniform1f(uangle, d.getTime()%10000);

			//add Lamp struct and transfer lightsources to shader
			function Lamp(pos,amb,dif,spe){
				this.pos=pos;
				this.amb=amb;
				this.dif=dif;
				this.spe=spe;
			}
			var lights=new Array();

			var am,di,sp;
			if(can)
				am=[1.0, 1.0, 1.0];
			else
				am=[0.0,0.0,0.0];
			if(cau)
				di=[1.0, 1.0, 1.0];
			else
				di=[0.0,0.0,0.0];
			if(caf)
				sp=[1.0, 1.0, 1.0];
			else
				sp=[0.0,0.0,0.0];

			lights.push(new Lamp([epx, epy, epz],am,di,sp));

			if(lab)
				am=[ambR, ambG, ambB];
			else
				am=[0.0,0.0,0.0];
			if(lan)
				di=[difR, difG, difB];
			else
				di=[0.0,0.0,0.0];
			if(lam)
				sp=[speR,speG,speB];
			else
				sp=[0.0,0.0,0.0];



			lights.push(new Lamp([0.0+cal, 10.0+cad, 0.0+car],am,di,sp));

			var cc;
			if(mode==1.0||mode==2.0){
				cc=1;
			}
			if(mode==3.0||mode==4.0||mode==5.0||mode==6.0||mode==7.0||mode==8.0||mode==9.0||mode==0.0){
				cc=2;
			}
			for(i=0;i<2;i++){
				var ularray_pos=gl.getUniformLocation(gl.program, 	'larray'+cc+'['+i+'].pos');
				var ularray_amb=gl.getUniformLocation(gl.program, 'larray'+cc+'['+i+'].amb');
				var ularray_dif=gl.getUniformLocation(gl.program, 	'larray'+cc+'['+i+'].dif');
				var ularray_spe=gl.getUniformLocation(gl.program, 	'larray'+cc+'['+i+'].spe');
				gl.uniform3fv(ularray_pos, lights[i].pos); 
				gl.uniform3fv(ularray_amb, lights[i].amb); 
				gl.uniform3fv(ularray_dif, lights[i].dif); 
				gl.uniform3fv(ularray_spe, lights[i].spe); 
			}




			// ... for Phong material/reflectance:



			function Material(amb,dif,spe,emi,shi){
				this.amb=amb;
				this.dif=dif;
				this.spe=spe;
				this.emi=emi;
				this.shi=shi;
			}
			var mate=new Array();
			mate.push(new Material([0.25, 0.25, 0.25],[0.4, 0.4, 0.4],[0.774597, 0.774597, 0.774597],[0.0, 0.0, 0.0],76.8));	
			mate.push(new Material([0.05,    0.05,   0.05],[0.0,     0.6,    0.0],[0.2,     0.2,    0.2],[0.0, 0.0, 0.0],60));
			//mate.push(new Material([0.135,    0.2225,   0.1575],[0.54,     0.89,     0.63],[0.316228, 0.316228, 0.316228],[0.0, 0.0, 0.0],12.8));
			mate.push(new Material([0.105882, 0.058824, 0.113725],[0.427451, 0.470588, 0.541176],[0.333333, 0.333333, 0.521569],[0.0, 0.0, 0.0],9.84615));
			mate.push(new Material([0.1745,   0.01175,  0.01175],[0.61424,  0.04136,  0.04136],[0.727811, 0.626959, 0.626959],[0.0, 0.0, 0.0],12.8));
			mate.push(new Material([0.1,      0.18725,  0.1745],[0.396,    0.74151,  0.69102],[0.297254, 0.30829,  0.306678],[0.0, 0.0, 0.0],12.8));
			//mate.push(new Material([0.02,    0.02,   0.02],[0.01,    0.01,   0.01],[0.4,     0.4,    0.4],[0.0, 0.0, 0.0],10.0));	
			//mate.push(new Material([0.135,    0.2225,   0.1575],[0.54,     0.89,     0.63],[0.316228, 0.316228, 0.316228],[0.0, 0.0, 0.0],12.8));
			mate.push(new Material([0.2125,   0.1275,   0.054],[0.714,    0.4284,   0.18144],[0.393548, 0.271906, 0.166721],[0.0, 0.0, 0.0],25.6));
			for(i=0;i<6;i++){
				var umat_amb=gl.getUniformLocation(gl.program, 'mate'+cc+'['+i+'].amb');
				var umat_dif=gl.getUniformLocation(gl.program, 'mate'+cc+'['+i+'].dif');
				var umat_spe=gl.getUniformLocation(gl.program, 'mate'+cc+'['+i+'].spe');
				var umat_emi=gl.getUniformLocation(gl.program, 'mate'+cc+'['+i+'].emi');
				var umat_shi=gl.getUniformLocation(gl.program, 'mate'+cc+'['+i+'].shi');
				gl.uniform3fv(umat_amb, mate[i].amb); 
				gl.uniform3fv(umat_dif, mate[i].dif); 
				gl.uniform3fv(umat_spe, mate[i].spe); 
				gl.uniform3fv(umat_emi, mate[i].emi); 
				gl.uniform1f(umat_shi, mate[i].shi); 
			}



			eyePosWorld.set([epx, epy, epz]);
			gl.uniform3fv(uLoc_eyePosWorld, eyePosWorld);// use it to set our uniform
			// (Note: uniform4fv() expects 4-element float32Array as its 2nd argument)
			var uobj=gl.getUniformLocation(gl.program, 'obj');
			gl.uniform1f(uobj,0.0);

			var umode=gl.getUniformLocation(gl.program, 'mode');
			gl.uniform1f(umode,mode);
}

