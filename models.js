/* Modelos */

//
// Esfera
//

function Esfera(radio,latBands,longBands) {
  this.radio=radio;
  this.latBands=latBands;
  this.longBands=longBands;
  this.vertexArray=[];
  this.normalArray=[];
  this.facesArray=[];
  this.textureArray=[];
  this.vertex_and_texture=[];
  this.texturePath=false;
  this.webglTexture=false;
  this.imagen=false;

  //Construir cada uno de estos elementos
  // 1.- Vector de normales
  // 2.- Vector de coordenadas
  // 3.- Vector de texturas
  for(var latNumber=0;latNumber<=this.latBands;latNumber++) {
    var theta=latNumber*Math.PI / this.latBands;
    var sinTheta=Math.sin(theta);
    var cosTheta=Math.cos(theta);

    for(var longNumber=0;longNumber<=this.longBands;longNumber++) {
      var phi=longNumber*2*Math.PI/this.longBands;
      var sinPhi=Math.sin(phi);
      var cosPhi=Math.cos(phi);

      //Coordenadas
      var x=cosPhi*sinTheta;
      var y=cosTheta;
      var z=sinPhi*sinTheta;
      var u=1-(longNumber / this.longBands);
      var v=1-(latNumber / this.latBands);

      this.normalArray.push(x);
      this.normalArray.push(y);
      this.normalArray.push(z);
      this.textureArray.push(u);
      this.textureArray.push(v);
      this.vertexArray.push(this.radio*x);
      this.vertexArray.push(this.radio*y);
      this.vertexArray.push(this.radio*z);

      //Vertex y texture juntos
      this.vertex_and_texture.push(this.radio*x);
      this.vertex_and_texture.push(this.radio*y);
      this.vertex_and_texture.push(this.radio*z);
      this.vertex_and_texture.push(u);
      this.vertex_and_texture.push(v);
    }
  }

  // Caras de la esfera
  for(var latNumber=0;latNumber<this.latBands;latNumber++) {
    for(var longNumber=0;longNumber<this.longBands;longNumber++) {
      var first=(latNumber*(this.longBands+1))+longNumber;
      var second=first+this.longBands+1;
      this.facesArray.push(first);
      this.facesArray.push(second);
      this.facesArray.push(first+1);
      this.facesArray.push(second);
      this.facesArray.push(second+1);
      this.facesArray.push(first+1);
    }
  }

};

Esfera.prototype={
  constructor: Esfera,
  numberOfElements:function() {
    var number=(this.facesArray.length-3);
    return number;
  },
  traslate: function(x,y,z) {
    //Debemos de trasladar la posicion y luego reconstruir el vector
    //conjunto de texturas y arrays
    var posTexture=0;
    this.vertex_and_texture.length=0;
    for(var i=0;i<this.normalArray.length;i+=3) {
      this.vertexArray[i]=(this.normalArray[i]*this.radio)+x;
      this.vertexArray[i+1]=(this.normalArray[i+1]*this.radio)+y;
      this.vertexArray[i+2]=(this.normalArray[i+2]*this.radio)+z;
      this.vertex_and_texture.push(this.vertexArray[i]);
      this.vertex_and_texture.push(this.vertexArray[i+1]);
      this.vertex_and_texture.push(this.vertexArray[i+2]);
      this.vertex_and_texture.push(this.textureArray[posTexture++]);
      this.vertex_and_texture.push(this.textureArray[posTexture++]);
    }
  },
  loadTexture: function(texturePath,GL) {
    this.texturePath=texturePath;

    this.imagen=new Image();
    this.imagen.onload=function(e) {
      this.webglTexture=GL.createTexture();
      GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL,true);

      GL.bindTexture(GL.TEXTURE_2D,this.webglTexture); //Preparamos para asociar textura
      GL.texImage2D(GL.TEXTURE_2D,0,GL.RGBA,GL.RGBA,GL.UNSIGNED_BYTE,this.imagen);
      GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MAG_FILTER,GL.LINEAR);
      GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER,GL.LINEAR);

      GL.bindTexture(GL.TEXTURE_2D,null); //Liberar recursos
    }
    this.imagen.src=this.texturePath;
  }
};

//
// Cubo
//

function CuboExample() {
  this.vertexArray=[
      -1,-1,-1,

      0,0,0,

      1,-1,-1,

      1,0,0,

      1,1,-1,

      1,1,0,

      -1,1,-1,

      0,1,0,

      -1,-1,1,

      0,0,1,

      1,-1,1,

      1,0,1,

      1,1,1,

      1,1,1,

      -1,1,1,

      0,1,1
];
  this.normalArray=[];
  this.facesArray=[
      0,1,2,
      0,2,3,

      4,5,6,
      4,6,7,

      0,3,7,
      0,4,7,

      1,2,6,
      1,5,6,

      2,3,6,
      3,7,6,

      0,1,5,
      0,4,5
];
  this.textureArray=[];
};

CuboExample.prototype={
  constructor: CuboExample
};
