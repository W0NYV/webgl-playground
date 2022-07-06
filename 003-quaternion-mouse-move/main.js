'use strict';

let render,
    beginTime,
    nowTime;

const q = new qtnIV();
const qt = q.identity(q.create());

function enableTestAndClear(gl) {
    //深度テストの比較方法を指定
    gl.depthFunc(gl.LEQUAL);

    //カリングテストの有効化
    gl.enable(gl.CULL_FACE);

    //深度テストの有効化
    gl.enable(gl.DEPTH_TEST);

    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function draw(gl, vao, indicesLength, program) {

    let m = new matIV();

    let qMatrix = m.identity(m.create());
    q.toMatIV(qt, qMatrix);

    let mMatrix = m.identity(m.create());
    let vMatrix = m.identity(m.create());
    let pMatrix = m.identity(m.create());
    let mvpMatrix = m.identity(m.create());

    m.multiply(mMatrix, qMatrix, mMatrix);

    m.lookAt([0.0, 1.0, 7.0], [0, 0, 0], [0, 1, 0], vMatrix);

    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

    m.multiply(pMatrix, vMatrix, mvpMatrix);
    m.multiply(mvpMatrix, mMatrix, mvpMatrix);

    let uniValues = [[1.0], mvpMatrix];
    
    glMethods.setUniform(gl, uniValues, program.uniLocations, program.uniTypes);

    enableTestAndClear(gl);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);

    gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}

function calculateAngleFromMouse(e) {

    //キャンバスの横幅
    let cw = window.innerWidth;
    
    //キャンバスの縦幅
    let ch = window.innerHeight;

    //キャンバスのノルム
    let wh = Math.sqrt(cw * cw + ch * ch);

    //マウス座標X -キャンバスの横幅/2 ~ キャンバスの横幅/2
    let x = e.clientX - cw * 0.5;

    //マウス座標Y -キャンバスの縦幅/2 ~ キャンバスの縦幅/2
    let y = e.clientY - ch * 0.5;

    //マウス座標のノルム
    let sq = Math.sqrt(x * x + y * y);
    
    //ラジアン
    let r = sq / wh;
    r *= 2.0 * Math.PI;
    
    //どういう軸で回転するかを決める
    if(sq != 1) {
        sq = 1 / sq;
        x *= sq;
        y *= sq;
    }
    q.rotate(r, [y, x, 0.0], qt);
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

        window.addEventListener('mousemove', calculateAngleFromMouse, true);

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
