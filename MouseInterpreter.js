class MouseInterpreter {
    constructor() {
        this.mouseClicked = false;
        this.mousein = false;
        
        this.canvas = null;
        this.scene = null;
        this.helper = null;
    }
    setCanvas(canvas) {
        let self = this;
        let jquery = canvas.jquery;
        jquery.mouseover(e => self.mousein = true);
        jquery.mouseleave(e => self.mousein = false);
        jquery.mousedown(e => {
            this.mouseClicked = true;
            self.onMouseClicked(e.offsetX, e.offsetY)
        });
        $(document).mouseup(e => {
            let pos = jquery.position();
            let x = e.pageX - pos.left;
            let y = e.pageY - pos.top;
            this.mouseClicked = false;
            self.onMouseReleased(x, y);
        });
        $(document).mousemove(e => {
            let pos = jquery.position();
            let x = e.pageX - pos.left;
            let y = e.pageY - pos.top;
            let dx = e.originalEvent.movementX;
            let dy = e.originalEvent.movementY;
            self.onMouseMoved(x, y, dx, dy);
        });

    }
    setScene(scene) {
        this.scene = scene;
    }
    attachHelper(helper) {
        this.helper = helper;
    }
    onMouseClicked(x, y) {}
    onMouseMoved(x, y, dx, dy) {}
    onMouseReleased(x, y) {}
}

class OpacityMouseInterpreter extends MouseInterpreter {
    constructor() {
        super();
        this.draggedPoint = null;
        this.selectedPoint = null;
        this.coordinatesTransform = null;
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
            p.setMinY(0);
            p.setMaxY(1);
            p.selected = true;
            this.scene.addPoint(p);
        } else {
            p.selected = true;
            this.scene.repaint();
        }
        this.selectedPoint = p;
        this.draggedPoint = p;
    }
    onMouseMoved(x, y, dx, dy) {
        if(!this.draggedPoint)
            return;
        this.draggedPoint.moveTo(
            this.helper.fromScreenX(x), 
            this.helper.fromScreenY(y));
        this.scene.repaint()
    }
    onMouseReleased(x, y) {
        this.draggedPoint = null;
    }
    setCanvas(canvas) {
        super.setCanvas(canvas);
        // TODO
    }
}