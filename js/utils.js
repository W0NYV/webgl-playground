// DOM関連

const oUtils = {
    getCanvas(id) {
        const canvas = document.getElementById(id);
        
        if (!canvas) {
            console.error(`There is no canvas with id ${id} on this page.`);
            return null;
        }
        
        return canvas;
    },
        
    getGLContext(canvas) {
        return canvas.getContext('webgl2') || console.error('WebGL2 is not available in your browser.');
    },

    autoResizeCanvas(canvas) {
        const expandFullScreen = () => {

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

        };

        expandFullScreen();

        window.addEventListener('resize', expandFullScreen);
    }
}