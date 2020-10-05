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
        if(this.selectedPointIdx == -1)
            return;
        if(this.points[this.selectedPointIdx].x == 0 || this.points[this.selectedPointIdx].x == 1)
            return;
        super.removeSelected();
    }
    repaint() {
        this.painter.clear();
        this.painter.drawCoordinateSystem();
        this._sort();
        this.points.forEach(p => this.painter.drawPoint(p));
    }
    setDefault() {
        this.points = [];
        let ctf = new Ctf();
        ctf.setDefault();
        ctf.colormapPoints.forEach((point, idx, arr) => {
            let p = new PointWithLimits(point.relativeVal, 0.5);
            p.setFixedY(0.5);
            if(idx == 0)
                p.setFixedX(0);
            else if(idx == arr.length - 1)
                p.setFixedX(1);
            this.addPoint(p);
        }, this);
    }

    _sort() {
        this.points.sort((p1, p2) => p1.x - p2.x);
    }
}