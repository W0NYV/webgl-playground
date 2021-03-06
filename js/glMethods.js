'use strict';

const glMethods = {
    
    //シェーダを別ファイルから読み込む
    loadShader(pathArray) {
        if(Array.isArray(pathArray) !== true) {
            throw new Error('invalid argment');
        }  

        const promises = pathArray.map((path) => {
            return fetch(path).then((response) => {return response.text();})
        });

        return Promise.all(promises);

    },

    //コンパイルしたシェーダを返す
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

    //プログラムオブジェクトを作る
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
            this.loadShader(paths)
            .then((shaders) => {
                const vs = this.createShader(gl, shaders[0], gl.VERTEX_SHADER);
                const fs = this.createShader(gl, shaders[1], gl.FRAGMENT_SHADER);
    
                const program = this.createProgram(gl, vs, fs);
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
    
    },

    //ユニフォームをセットする
    setUniform(gl, value, uniLocations, uniTypes) {

        value.forEach((v, index) => {
            
            const type = uniTypes[index];
            
            if(type.includes('Matrix') === true) {
                gl[type](uniLocations[index], false, v);
            } else {
                gl[type](uniLocations[index], v);
            }
            
        });
    
    },

    //頂点バッファ、インデックスバッファの作成
    createBuffers(gl, program, vertAttributes, indices) {

        let buffers = {};

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
    
        const vertexBuffers = [];
    
        for(let i = 0; i < vertAttributes.length; i++) {
            vertexBuffers.push(gl.createBuffer());
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertAttributes[i][0]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.attLocations[i]);
            gl.vertexAttribPointer(program.attLocations[i], vertAttributes[i][1], gl.FLOAT, false, 0, 0);
        }
    
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
        buffers.vao = vao;
        buffers.indexBuffer = indexBuffer;
        buffers.indices = indices;
    
        return buffers;
    
    },

    createBuffers4Json(gl, program, filePath) {
        return fetch(filePath)
        .then(res => res.json())
        .then(data => {

            let vertAttributes = [];
            vertAttributes.push([data.position, 3]);

            const normal = utils.calculateNormals(data.position, data.index);
            vertAttributes.push([normal, 3]);

            vertAttributes.push([data.texCoord, 2]);

            let buffers = {};
    
            const vao = gl.createVertexArray();
            gl.bindVertexArray(vao);
        
            const vertexBuffers = [];
            for(let i = 0; i < vertAttributes.length; i++) {
                vertexBuffers.push(gl.createBuffer());
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertAttributes[i][0]), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(program.attLocations[i]);
                gl.vertexAttribPointer(program.attLocations[i], vertAttributes[i][1], gl.FLOAT, false, 0, 0);
            }
        
            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.index), gl.STATIC_DRAW);
        
            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
            buffers.vao = vao;
            buffers.indexBuffer = indexBuffer;
            buffers.indices = data.index;
            buffers.vertAttributes = vertAttributes;
            
            return buffers; 

        });
    },

    getNormalVectors(position, normal, length) {
        let norVecs = {};
        norVecs.p = [];
        norVecs.i = [];

        // console.log(position);
        // console.log(normal);

        if(position.length === normal.length) {
            for(let i = 0; i < position.length; i+=3) {
                norVecs.p.push(position[i]);
                norVecs.p.push(position[i+1]);
                norVecs.p.push(position[i+2]);
                
                norVecs.p.push(position[i]+normal[i]*length);
                norVecs.p.push(position[i+1]+normal[i+1]*length);
                norVecs.p.push(position[i+2]+normal[i+2]*length);

                norVecs.i.push(i);
                norVecs.i.push(i+1);
                norVecs.i.push(i+2);
            }
        }

        return norVecs;

    },

    getNormalVectors4Json(filePath, length) {
        return fetch(filePath)
        .then(res => res.json())
        .then(data => {
            let norVecs = {};
            norVecs.p = [];
            norVecs.i = []; 
            norVecs.e = [];
            norVecs.n = [];
        
            const position = data.position;
            const normal = utils.calculateNormals(data.position, data.index);
    
            if(position.length === normal.length) {
                for(let i = 0; i < position.length; i+=3) {
                    norVecs.p.push(position[i]);
                    norVecs.p.push(position[i+1]);
                    norVecs.p.push(position[i+2]);
                    
                    norVecs.p.push(position[i]+normal[i]*length);
                    norVecs.p.push(position[i+1]+normal[i+1]*length);
                    norVecs.p.push(position[i+2]+normal[i+2]*length);
    
                    norVecs.i.push(i);
                    norVecs.i.push(i+1);
                    norVecs.i.push(i+2);
                    
                }

                for(let i = 0; i < norVecs.p.length; i+=6) {
                    norVecs.e.push([1.0]);
                    norVecs.e.push([1.0]);
                    norVecs.e.push([1.0]);
                    norVecs.e.push([0.0]);
                    norVecs.e.push([0.0]);
                    norVecs.e.push([0.0]);
                }

                for(let i = 0; i < norVecs.p.length; i++) {
                    norVecs.n.push([i]);
                }

            }
            
            return norVecs;

        })

    }

};