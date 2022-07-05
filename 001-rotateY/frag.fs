#version 300 es
precision mediump float;

uniform float test;

in vec3 vColor;

out vec4 fragColor;

void main(void){

    fragColor = vec4(vColor*test, 1.0);
    
}