class ColormapScene extends Scene {
    constructor() {
        super();
    }
    addPoint(point) {
        point.setFixedY(0.5);
        if(point.x == 0)
            point.setFixedX(0);
        else if(point.x == 1)
            point.setFixedX(1);
        super.addPoint(point);
    }
    removeSelected() {
        if(this.selectedPoint.x == 0 || this.selectedPoint.x == 1)
            return;
        super.removeSelected();
    }
    repaint() {
        this.painter.clear();
        this.painter.drawCoordinateSystem();
        this._sort();
        this.points.forEach(p => this.painter.drawPoint(p));
    }
}