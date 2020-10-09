class ColormapScene extends Scene {
    constructor() {
        super();
    }
    addPoint(point) {
        this._sort();
        point.setFixedY(0.5);
        if(point.x == 0) {
            if(this.points.length != 0 && this.points[0].x == 0)
                return;
            else
                point.setFixedX(0);
        }
        else if(point.x == 1) {
            if(this.points.length != 0 && this.points[this.points.length-1].x == 1)
                return;
            else
                point.setFixedX(1);
        }
        else {
            point.setMinX(0);
            point.setMaxX(1);
        }
        super.addPoint(point);
    }
    removeSelected() {
        if(this.selectedPointIdx == -1)
            return;
        if(this.points[this.selectedPointIdx].x == 0 || this.points[this.selectedPointIdx].x == 1)
            return;
        super.removeSelected();
    }
    createPoint(x, y) {
        if(x <= 0 || x >= 1)
            return;
        if(y < 0 || y > 1)
            return;
        let p = new PointWithLimits(x, y);
        this.points.push(p);
        this._sort();
        p.setMinX(0);
        p.setMaxX(1);
        p.setFixedY(0.5);

        this.dispatchEvent(new Event("create_point"));
        // this.selectedPointIdx = this.points.findIndex(point => point == p);
        // p.selected = true;
        this.setSelected(p);
        return p;
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
        this.dispatchEvent(new Event("set_default"));
    }

    _sort() {
        this.points.sort((p1, p2) => p1.x - p2.x);
    }
}