class OpacityScene {
    constructor() {
        this.painter = new OpacityPainter();
        this.canvas = null;
        
        this.points = [];
    }
    addPoint(point) {
        this.points.push(point);
        // TODO
    }
    findPoint(x, y) {
        return this.points.find(p => p.isHovered(x, y));
    }
    findPointByX(x) {
        return this.points.find(p => {
            let rect = p.outlineRect();
            if(x < rect.x)
                return false;
            if(x > rect.x + rect.width)
                return false;
            return true;
        });
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        this.painter.setCanvas(canvas);
        // TODO
    }
    repaint() {
        this.painter.clear();
        this.painter.drawCoordinateSystem();
        this.points.forEach((p, i, arr) => {
            if(i != 0) {
                let l = new GraphicsLine(arr[i-1], p);
                this.painter.drawLine(l);
            }
            this.painter.drawPoint(p);
        });
    }
}