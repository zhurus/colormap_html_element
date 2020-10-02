class MouseInterpreter {
    constructor() {
        this.mouseClicked = false;
        this.mousein = false;
        this.canvas = null;
        this.scene = null;
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
        let p = this.scene.findPoint(x, y);
        if(!p) {
            p = new PointWithLimits(x, y);
            p.setMinX(0);
            p.setMaxX(1);
            p.setMinY(0);
            p.setMaxY(1);
            this.scene.addPoint(p);
        }
        this.selectedPoint = null;
        this.selectedPoint = p;
        p.selected = true;
        this.scene.repaint();
        this.draggedPoint = p;
        // TODO
    }
    onMouseMoved(x, y, dx, dy) {
        if(!this.draggedPoint)
            return;
        p.move(x, y);
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