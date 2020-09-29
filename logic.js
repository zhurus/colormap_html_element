(function(){
    let opacityEditor = $("#opacity-editor");
    let opacityCtx = opacityEditor[0].getContext("2d");

    class GPoint {
        static width = 10;
        static height = 10;

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        draw(canvasCtx) {
            canvasCtx.strokeRect(
                this.x - GPoint.width/2,
                this.y - GPoint.height/2,
                GPoint.width,
                GPoint.height
            );
        }
    }

    let p = new GPoint(5,5);
    p.draw(opacityCtx);
})()