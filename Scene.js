class Scene extends EventTarget {
    constructor() {
        super();
        this.painter = null;
        this.canvas = null;
        this.helper = null
        this.points = [];
        this.selectedPointIdx = -1;
    }
    getSelected() {
        return this.selectedPointIdx == -1? null : this.points[this.selectedPointIdx];
    }
    setSelected(point) {
        this.selectedPointIdx = this.points.findIndex(p => point == p);
        point.selected = true;
        this.dispatchEvent(new Event("select_point"));
    }
    moveSelected(x, y) {
        if(this.selectedPointIdx == -1)
            return;
        let p = this.points[this.selectedPointIdx];
        let idx = this.selectedPointIdx;
        let idx1 = this.selectedPointIdx - 1;
        let idx2 = this.selectedPointIdx + 1;

        let oldX = p.x;
        let oldY = p.y;
        if(idx != 0 && idx != this.points.length - 1)
        {
            if(x > this.points[idx1].x && x < this.points[idx2].x)
                p.moveTo(x, y);
            else if(x <= this.points[idx1].x)
                p.moveTo(this.points[idx1].x, y);
            else
                p.moveTo(this.points[idx2].x, y);
        } 
        else if(idx == 0)
        {
            if(x < this.points[1].x)
                p.moveTo(x, y);
            else
                p.moveTo(this.points[1].x, y);
        } else {
            if(x > this.points[idx1].x)
                p.moveTo(x, y);
            else
                p.moveTo(this.points[idx1].x, y);
        }

        if(p.x != oldX || p.y != oldY)
            this.dispatchEvent(new Event("move_selected"));
    }
    addPoint(point) {
        this.points.push(point);
        this._sort();
        this.dispatchEvent(new Event("add_point"));
    }
    createPoint(x, y) {
        let point = new PointWithLimits(x, y);
        this.points.push(point);
        this._sort();
        this.dispatchEvent(new Event("create_point"));
        return point;
    }
    removeSelected() {
        if(this.selectedPointIdx != -1) {
            this.points.splice(this.selectedPointIdx, 1);
            this.selectedPointIdx = -1;
            this._sort();
            this.dispatchEvent(new Event("remove_point"));
        }
    }
    findByScreenCoordinates(x, y) {
        return this.points.find(p => this.helper.isPointerOnPoint(x, y, p), this);
    }
    find(predicate, thisArg) {
        return this.points.find(predicate, thisArg);
    }
    getSelectedPoint() {
        if(this.selectedPointIdx != -1)
            return this.points[this.selectedPointIdx];
    }
    contains(point) {
        return this.points.includes(point);
    } 
    repaint() {
        this.painter.clear();
        this.points.forEach(p => this.painter.drawPoint(p));
    }
    clear() {
        this.points = [];
        this.selectedPointIdx = -1;
    }

    // private
    _sort() {
        this.points = this.points.sort((p1, p2) => p1.x - p2.x);
    }
}