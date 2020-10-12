class MouseInterpreter {
    constructor() {
        this.mouseClicked = false;
        this.mousein = false;
        
        this.canvas = null;
        this.scene = null;
        this.helper = null;

        this.canvasPosition = null;
    }
    setCanvas(canvas) {
        let self = this;
        let jquery = canvas.jquery;
        jquery.mouseover(e => self.mousein = true);
        jquery.mouseleave(e => self.mousein = false);
        jquery.mousedown(e => {
            this.canvasPosition = {
                top: e.pageY - e.offsetY,
                left: e.pageX - e.offsetX
            };

            this.mouseClicked = true;
            self.onMouseClicked(e.offsetX, e.offsetY)
        });
        $(document).mouseup(e => {
            if(!this.mouseClicked)
                return false;
            let pos = this.canvasPosition;
            let x = e.pageX - pos.left;
            let y = e.pageY - pos.top;
            this.mouseClicked = false;
            self.onMouseReleased(x, y);
        });
        $(document).mousemove(e => {
            if(!this.mouseClicked)
                return false;
            let pos = this.canvasPosition;
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
}


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