class CanvasHelper {
    constructor() {
        this.coordinatesTransform = null;
        this.painterOptions = null;
    }
    isPointerOnPoint(pointerX, pointerY, point) {
        let w = this.painterOptions.pointOptions.outRectSize;
        let h = w;
        let x = this.coordinatesTransform.toScreenX(point.x) - w / 2;
        let y = this.coordinatesTransform.toScreenY(point.y) - h / 2;
        let rect = new Rect(x, y, w, h);
        return rect.contains(new Point(pointerX, pointerY));
    }
    fromScreenX(x) {
        return this.coordinatesTransform.fromScreenX(x);
    }
    fromScreenY(y) {
        return this.coordinatesTransform.fromScreenY(y);
    }
    toScreenY(y) {
        return this.coordinatesTransform.toScreenY(y);
    }
}