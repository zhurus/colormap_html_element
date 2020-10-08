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
            let sceneX = this.helper.coordinatesTransform.fromScreenX(x);
            let sceneY = this.helper.coordinatesTransform.fromScreenY(y);

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
        let x_ = this.helper.fromScreenX(x);
        let y_ = this.helper.fromScreenY(y);
        this.scene.moveSelected(x_, y_);
        this.scene.repaint();
    }
    onMouseReleased(x, y) { 
        if(this.draggedPoint) {
            this.draggedPoint = null;
            this.scene.dispatchEvent(new Event("change"));
        }
    }
}