'use strict';

const oProgram = {
    
    loadShader(pathArray) {
        if(Array.isArray(pathArray) !== true) {
            throw new Error('invalid argment');
        }  

        const promises = pathArray.map((path) => {
            return fetch(path).then((response) => {return response.text();})
        });

        return Promise.all(promises);

    },

    createShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
    },

    createProgram(gl, vs, fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            return program;
        } else {
            alert(gl.getProgramInfoLog(program));
            return null;
        }

    }

};