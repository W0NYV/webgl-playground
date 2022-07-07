#version 300 es
precision mediump float;

in float vEnd;
in float vt;

uniform vec3 lightDirection;

out vec4 fragColor;

void main(void){

    vec4 destColor;

    if(vEnd == 0.0) {
        destColor = vec4(0.15, 0.95, 1, 1);
    } else {
        vec3 c = vec3(0.66, 0.15, 1);
        destColor = vec4(c, 1) * vt;
    }

    fragColor = destColor;
    
}