#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec3 aVertexColor;

out vec3 vColor;

void main(void){
    vColor = aVertexColor;
    gl_Position = vec4(aVertexPosition, 1.0);
}