class CtfElementInput extends EventTarget {
    constructor(canvasJquery) {
        super();
        this.canvas = new Canvas(canvasJquery);

        let coordinatesTransform = this._makeCoordinateTransform(this.canvas);
        let painterOptions = this._makePainterOptions();
        let helper = this._makeHelper(coordinatesTransform, painterOptions);
        this.painter = this._makePainter(this.canvas, coordinatesTransform, painterOptions);
        this.scene = this._makeScene(this.canvas, this.painter, helper);
        this.mouseInterpreter = this._makeMouseInterpreter(this.canvas, this.scene, helper);

        this.scene.addEventListener("change", this._onChange.bind(this));
    }

    _onChange() {}
    _makePainterOptions() {
        return new PainterOptions();
    }
    _makeCoordinateTransform(canvas) {
        let coordinatesTransform = new CoordinatesTransform();
        coordinatesTransform.adaptToCanvas(canvas);
        return coordinatesTransform;
    }
    _makeHelper(coordinatesTransform, painterOptions) {
        let helper = new CanvasHelper();
        helper.coordinatesTransform = coordinatesTransform;
        helper.painterOptions = painterOptions;
        return helper;
    }
    _makePainter(canvas, coordinatesTransform, painterOptions) {
        let painter = new PainterOptions(canvas);
        painter.coordinatesTransform = coordinatesTransform;
        painter.painterOptions = painterOptions;
        return painter;
    }
    _makeScene(canvas, painter, helper) {
        let scene = new Scene();
        scene.canvas = canvas;
        scene.painter = painter;
        scene.helper = helper;
        return scene;
    }
    _makeMouseInterpreter(canvas, scene, helper) {
        let mouseInterpreter = new MouseInterpreter();
        mouseInterpreter.setCanvas(canvas);
        mouseInterpreter.setScene(scene);
        mouseInterpreter.helper = helper;
        return mouseInterpreter;
    }
}