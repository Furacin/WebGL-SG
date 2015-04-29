
var main=function() {
  var CANVAS=document.getElementById("your_canvas");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  /*========================= GET WEBGL CONTEXT ========================= */
  var GL;
  try {
    GL = CANVAS.getContext("experimental-webgl", {antialias: true});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  /*========================= SHADERS ========================= */
  /*jshint multistr: true */

  var shader_vertex_source="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec3 color; //the color of the point\n\
varying vec3 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vColor=color;\n\
}";

  var shader_fragment_source="\n\
precision mediump float;\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}";

  var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
  var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
  var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);

  GL.useProgram(SHADER_PROGRAM);

  /*========================= THE CUBE ========================= */
  var luna=new Esfera(1/4,60,60);
  var tierra=new Esfera(1,60,60);

  //Prueba de traslate
  luna.traslate(-1-tierra.radio,0,0);

  var LUNA_VERTEX= GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, LUNA_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(luna.vertexArray),
    GL.STATIC_DRAW);

  var LUNA_FACES= GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LUNA_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(luna.facesArray),
    GL.STATIC_DRAW);

  var TIERRA_VERTEX= GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, TIERRA_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER,
                  new Float32Array(tierra.vertexArray),
    GL.STATIC_DRAW);

  var TIERRA_FACES= GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TIERRA_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(tierra.facesArray),
    GL.STATIC_DRAW);


  /*========================= MATRIX ========================= */

  var PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
  var MOVEMATRIX=LIBS.get_I4();
  var VIEWMATRIX=LIBS.get_I4();

  LIBS.translateZ(VIEWMATRIX, -6);

  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);

  var time_old=0;
  var animate=function(time) {
    var dt=time-time_old;
//    LIBS.rotateZ(MOVEMATRIX, dt*0.001);
    LIBS.rotateY(MOVEMATRIX, dt*0.002);
//    LIBS.rotateX(MOVEMATRIX, dt*0.003);
    time_old=time;

    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
    GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
    GL.bindBuffer(GL.ARRAY_BUFFER, LUNA_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false,0,0);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false,0,3*4);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LUNA_FACES);
    //GL.drawElements(GL.TRIANGLES, 6*2*3, GL.UNSIGNED_SHORT, 0);
    GL.drawElements(GL.TRIANGLES,luna.numberOfElements(),GL.UNSIGNED_SHORT,0);

    GL.flush();

    GL.bindBuffer(GL.ARRAY_BUFFER, TIERRA_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false,0,0);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false,0,3*4);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TIERRA_FACES);
    //GL.drawElements(GL.TRIANGLES, 6*2*3, GL.UNSIGNED_SHORT, 0);
    GL.drawElements(GL.TRIANGLES,tierra.numberOfElements(),GL.UNSIGNED_SHORT,0);

    GL.flush();
    window.requestAnimationFrame(animate);
  };
  animate(0);
};
