class ColormapMouseInterpreter extends MouseInterpreter {
    constructor() {
        super();
        this.selectedPoint = null;
        this.draggedPoint = null;
    }
    onMouseClicked(x, y) {
        if(this.selectedPoint)
            this.selectedPoint.selected = false;
        this.selectedPoint = null;
        let p = this.scene.findByScreenCoordinates(x, y);
        if(!p) {
            p = new PointWithLimits(
                this.helper.coordinatesTransform.fromScreenX(x),
                this.helper.coordinatesTransform.fromScreenY(y));
            p.setMinX(0);
            p.setMaxX(1);
            p.setFixedY(0.5);
            this.scene.setSelected(p);
            this.scene.addPoint(p);
        } else {
            this.scene.setSelected(p);
            this.scene.repaint();
        }
        this.selectedPoint = p;
        this.draggedPoint = p;
    }
    onMouseMoved(x, y, dx, dy) {
        if(!this.draggedPoint)
            return;
        let x_ = this.helper.fromScreenX(x);
        let y_ = this.helper.fromScreenY(y);
        this.draggedPoint.moveTo(x_, y_);
        this.scene.repaint();
    }
    onMouseReleased(x, y) {
        this.draggedPoint = null;
    }
}