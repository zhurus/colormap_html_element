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