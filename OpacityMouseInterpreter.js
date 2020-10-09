class OpacityMouseInterpreter extends MouseInterpreter {
    constructor() {
        super();
        this.draggedPoint = null;
        this.selectedPoint = null;
    }
    onMouseClicked(x, y) {
        if(this.selectedPoint)
            this.selectedPoint.selected = false;
        this.selectedPoint = null;
        let p = this.scene.findByScreenCoordinates(x, y);
        if(!p) {
            let sceneX = this.helper.coordinatesTransform.fromScreenX(x);
            let sceneY = this.helper.coordinatesTransform.fromScreenY(y);
            // p = new PointWithLimits(
            //     this.helper.coordinatesTransform.fromScreenX(x),
            //     this.helper.coordinatesTransform.fromScreenY(y));
            // p.setMinX(0);
            // p.setMaxX(1);
            // p.setMinY(0);
            // p.setMaxY(1);
            // this.scene.addPoint(p);
            // this.scene.setSelected(p);            
            p = this.scene.createPoint(sceneX, sceneY);
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
        this.scene.moveSelected(
            this.helper.fromScreenX(x), 
            this.helper.fromScreenY(y));
        this.scene.repaint();
    }
    onMouseReleased(x, y) {
        if(this.draggedPoint) {
            this.draggedPoint = null;
            this.scene.dispatchEvent(new Event("change"));
        }
    }
}