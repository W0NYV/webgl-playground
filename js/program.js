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

    },

    getShader(gl, paths, attLocations, uniLocations) {

        return new Promise((resolve) => {
            oProgram.loadShader(paths)
            .then((shaders) => {
                const vs = oProgram.createShader(gl, shaders[0], gl.VERTEX_SHADER);
                const fs = oProgram.createShader(gl, shaders[1], gl.FRAGMENT_SHADER);
    
                const program = oProgram.createProgram(gl, vs, fs);
                program.attLocations = [];
                program.uniLocations = [];
                program.uniTypes = [];

                attLocations.forEach(attLocation => {
                    program.attLocations.push(gl.getAttribLocation(program, attLocation));
                });
                
                uniLocations.forEach(uniLocation => {
                    program.uniLocations.push(gl.getUniformLocation(program, uniLocation[0]));
                    program.uniTypes.push(uniLocation[1]);
                    
                });

                resolve(program);
    
            });
        });
    
    }

};