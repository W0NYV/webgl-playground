#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec3 aVertexColor;

uniform mat4 mvpMatrix;

out vec3 vColor;

void main(void){
    vColor = aVertexColor;
    gl_Position = mvpMatrix * vec4(aVertexPosition, 1.0);
}