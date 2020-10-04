class Scene extends EventTarget {
    constructor() {
        super();
        this.painter = null;
        this.canvas = null;
        this.helper = null
        this.points = [];
        this.selectedPoint = null;
    }
    setSelected(point) {
        this.selectedPoint = point;
        point.selected = true;
        this.dispatchEvent(new Event("change"));
    }
    addPoint(point) {
        this.points.push(point);
        this.repaint();
        this.dispatchEvent(new Event("change"));
    }
    removeSelected() {
        if(this.selectedPoint) {
            let idx = this.points.findIndex(p => p == this.selectedPoint, this);
            if(idx != -1) {
                this.points.splice(idx, 1);
            }
        }
        this.selectedPoint = null;
        this.repaint();
        this.dispatchEvent(new Event("change"));
    }
    findByScreenCoordinates(x, y) {
        return this.points.find(p => this.helper.isPointerOnPoint(x, y, p), this);
    }
    repaint() {
        this.painter.clear();
        this.points.forEach(p => this.painter.drawPoint(p));
    }
    setDefault() {
        this.points = [];
        this.repaint();
    }

    // private
    _addPointNoRepaint(point) {
        this.points.push(point);
        this.dispatchEvent(new Event("change"));
    }
    _sort() {
        this.points = this.points.sort((p1, p2) => p1.x - p2.x);
    }
}

class OpacityScene extends Scene {
    constructor() {
        super();
        
        this.fixedPnt1 = new PointWithLimits(0, 1);
        this.fixedPnt1.setFixedX(0);
        this.fixedPnt1.setMinY(0);
        this.fixedPnt1.setMaxY(1);
        this._addPointNoRepaint(this.fixedPnt1);

        this.fixedPnt2 = new PointWithLimits(1, 1);
        this.fixedPnt2.setFixedX(1);
        this.fixedPnt2.setMinY(0);
        this.fixedPnt2.setMaxY(1);
        this._addPointNoRepaint(this.fixedPnt2);
    }
    removeSelected() {
        if(this.selectedPoint != this.fixedPnt1 && this.selectedPoint != this.fixedPnt2)
            super.removeSelected(this.selectedPoint);
    }
    setDefault() {
        this._sort();
        this.fixedPnt1.y = 1;
        this.fixedPnt2.y = 1;
        this.points.splice(1, this.points.length - 2);
        this.repaint();
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