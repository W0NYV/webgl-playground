#version 300 es
precision mediump float;

in vec3 vNormal;
in vec2 vTexCoord;
in vec3 vColor;

uniform sampler2D sampler;
uniform float time;

out vec4 fragColor;

void main(void){

    vec4 smpColor = texture(sampler, gl_PointCoord);

    if(smpColor.a == 0.0) {
        discard;
    } else {
        vec4 destColor = vec4(vColor.r, vColor.g, fract(time/3.0)*vColor.b, 1.0) * smpColor;
        fragColor = destColor;
    }

}