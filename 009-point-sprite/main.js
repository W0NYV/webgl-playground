'use strict';

let beginTime,
    nowTime;

function loadImg(gl, path) {

    return new Promise((resolve) => {
        const texture = gl.createTexture();
        const image = new Image();
        image.src = path;
    
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
            resolve(texture);
        }
    });
}

function draw(gl, vao, indicesLength, program, texture) {

    let m = new matIV();
    let mMatrix = m.identity(m.create());
    let vMatrix = m.identity(m.create());
    let pMatrix = m.identity(m.create());
    let mvpMatrix = m.identity(m.create());

    m.rotate(mMatrix, nowTime/6.0, [0, 1, 0], mMatrix);
    m.lookAt([0.0, -0.15, -0.4], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

    m.multiply(pMatrix, vMatrix, mvpMatrix);
    m.multiply(mvpMatrix, mMatrix, mvpMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    let uniValues = [[nowTime], 
                     mvpMatrix,
                     0];
    
    glMethods.setUniform(gl, uniValues, program.uniLocations, program.uniTypes);

    //深度テストの比較方法を指定
    gl.depthFunc(gl.LEQUAL);

    //カリングテストの有効化
    gl.enable(gl.CULL_FACE);

    //深度テストの有効化
    gl.enable(gl.DEPTH_TEST);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);

    gl.drawElements(gl.POINTS, indicesLength, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}

function init() {

    beginTime = Date.now();

    const sphereData = sphere(64, 64, 5.0);

    const vertAttributes = [[sphereData.p, 3], [sphereData.n, 3], [sphereData.t, 2], [sphereData.c, 3]];
    const indices = sphereData.i;

    const attLocations = ['aVertexPosition',
                          'aVertexNormal',                    
                          'aVertexTexCoord',
                          'aVertexColor'];

    const uniLocations = [['time', 'uniform1fv'],
                          ['mvpMatrix', 'uniformMatrix4fv'],
                          ['sampler', 'uniform1i']];    

    const canvas = utils.getCanvas('webgl-canvas');
    utils.autoResizeCanvas(canvas);

    const gl = utils.getGLContext(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    glMethods.getShader(gl, ['./vert.vs', './frag.fs'], attLocations, uniLocations).then((program) => {

        loadImg(gl, '../images/w0nyv.png').then(texture => {
            const buffers = glMethods.createBuffers(gl, program, vertAttributes, indices);
            
            //キショコード
            function render() {
                requestAnimationFrame(render);
                nowTime = (Date.now() - beginTime) / 1000.0;
                draw(gl, buffers.vao, buffers.indices.length, program, texture);
            }
    
            render();  
        });
    
    });
    
}

window.onload = init;
