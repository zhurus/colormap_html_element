class OpacityScene extends Scene {
    constructor() {
        super();
        
        this.fixedPnt1 = new PointWithLimits(0, 1);
        this.fixedPnt1.setFixedX(0);
        this.fixedPnt1.setMinY(0);
        this.fixedPnt1.setMaxY(1);
        this.addPoint(this.fixedPnt1);

        this.fixedPnt2 = new PointWithLimits(1, 1);
        this.fixedPnt2.setFixedX(1);
        this.fixedPnt2.setMinY(0);
        this.fixedPnt2.setMaxY(1);
        this.addPoint(this.fixedPnt2);
    }
    addPoint(point) {
        this._sort();
        if(point.x == 0)
        {
            if(this.points.length != 0 && this.points[0].x == 0)
                return;
            else
                point.setFixedX(0);
        }
        else if(point.x == 1) 
        {
            if(this.points.length != 0 && this.points[this.points.length-1].x == 1)
                return;
            else
                point.setFixedX(1);
        }
        else 
        {
            point.setMinX(0);
            point.setMaxX(1);
        }
        point.setMinY(0);
        point.setMaxY(1);
        super.addPoint(point)
    }
    createPoint(x, y) {
        if(x <= 0 || x >= 1)
            return;
        if(y < 0 || y > 1)
            return;
        let point = new PointWithLimits(x, y);
        point.setMinX(0);
        point.setMaxX(1);
        point.setMinY(0);
        point.setMaxY(1);
        
        this.points.push(point);
        this._sort();
        this.dispatchEvent(new Event("create_point"));
        this.setSelected(point);
        return point;
    }
    removeSelected() {
        if(this.selectedPointIdx != 0 && this.selectedPointIdx != this.points.length - 1)
            super.removeSelected();
    }
    setDefault() {
        this._sort();
        if(this.selectedPointIdx != -1) {
            this.points[this.selectedPointIdx].selected = false;
            this.selectedPointIdx = -1;
        }
        this.fixedPnt1.y = 1;
        this.fixedPnt2.y = 1;
        this.points.splice(1, this.points.length - 2);
        this.dispatchEvent(new Event("set_default"));
    }
    repaint() {
        this.painter.clear();
        this.painter.drawCoordinateSystem();
        this._sort();
        this.points.forEach((p, i, arr) => {
            if(i != 0) {
                let l = new GraphicsLine(arr[i-1], p);
                this.painter.drawLine(l);
            }
            this.painter.drawPoint(p);
        });
    }

    // private
    _sort() {
        this.points = this.points.sort((p1, p2) => {
            if(p1 == this.fixedPnt1)
                return -1;
            if(p2 == this.fixedPnt1)
                return 1;
            if(p1 == this.fixedPnt2)
                return 1;
            if(p2 == this.fixedPnt2)
                return -1;
            return p1.x - p2.x;
        });
    }
}