'use strict';

let render,
    beginTime,
    nowTime;

function draw(gl, vao, indicesLength, program) {

    let m = new matIV();
    let mMatrix = m.identity(m.create());
    let vMatrix = m.identity(m.create());
    let pMatrix = m.identity(m.create());
    let mvpMatrix = m.identity(m.create());

    let q = new qtnIV();
    let xQuaternion = q.identity(q.create());
    
    let camPosition = [0.0, 0.0, 10.0];
    let camUpDirection = [0.0, 1.0, 0.0];

    let rad2 = (200 * nowTime % 720) * Math.PI / 360;

    //クォータニオンに回転要素を持たせる
    //引数:角度、軸、回転要素を持たせるクォータニオン
    q.rotate(rad2, [1, 0, 0], xQuaternion);

    //任意のベクトルを、任意の回転要素を持つクォータニオンで回転させる
    //引数:回転させたいベクトル、回転要素を持つクォータニオン、計算結果が格納されたベクトル
    q.toVecIII([0.0, 0.0, 10.0], xQuaternion, camPosition);
    q.toVecIII([0.0, 1.0, 0.0], xQuaternion, camUpDirection);

    //クォータニオンによって計算されたカメラの位置とカメラの回転させる軸を使って、ビュー変換行列を生成
    m.lookAt(camPosition, [0, 0, 0], camUpDirection, vMatrix);

    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

    m.multiply(pMatrix, vMatrix, mvpMatrix);
    m.multiply(mvpMatrix, mMatrix, mvpMatrix);


    let uniValues = [[1.0], mvpMatrix];
    
    glMethods.setUniform(gl, uniValues, program.uniLocations, program.uniTypes);

    //深度テストの比較方法を指定
    gl.depthFunc(gl.LEQUAL);

    //カリングテストの有効化
    gl.enable(gl.CULL_FACE);

    //深度テストの有効化
    gl.enable(gl.DEPTH_TEST);

    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);

    gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}

function init() {

    beginTime = Date.now();

    let torusData = torus(32, 32, 1.0, 2.0);

    const vertAttributes = [[torusData.p, 3], [torusData.c, 3]];

    const indices = torusData.i;

    const attLocations = ['aVertexPosition',
                          'aVertexColor'];

    const uniLocations = [['test', 'uniform1fv'],
                          ['mvpMatrix', 'uniformMatrix4fv']];    

    const canvas = utils.getCanvas('webgl-canvas');
    utils.autoResizeCanvas(canvas);

    const gl = utils.getGLContext(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    glMethods.getShader(gl, ['./vert.vs', './frag.fs'], attLocations, uniLocations).then((program) => {

        const buffers = glMethods.createBuffers(gl, program, vertAttributes, indices);

        //キショコード
        function render() {
            requestAnimationFrame(render);
            nowTime = (Date.now() - beginTime) / 1000.0;
            draw(gl, buffers.vao, indices.length, program);
        }

        render();        
    })
    
}

window.onload = init;
