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
    removeSelected() {
        if(this.selectedPointIdx != 0 && this.selectedPointIdx != this.points.length - 1)
            super.removeSelected();
    }
    setDefault() {
        this._sort();
        this.fixedPnt1.y = 1;
        this.fixedPnt2.y = 1;
        this.points.splice(1, this.points.length - 2);
        this.dispatchEvent(new Event("change"));
        this.dispatchEvent(new Event("input"));
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