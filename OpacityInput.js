class OpacityInput extends EventTarget {
    constructor() {
        super();
        this.canvas = new Canvas($("#opacity-canvas"));

        let coordinatesTransform = new CoordinatesTransform();
        coordinatesTransform.adaptToCanvas(this.canvas);
        let painterOptions = new PainterOptions();

        let helper = this._makeHelper(coordinatesTransform, painterOptions);
        let painter = this._makePainter(this.canvas, coordinatesTransform, painterOptions);
        this.scene = this._makeScene(this.canvas, painter, helper);
        this.mouseInterpreter = this._makeMouseInterpreter(this.canvas, this.scene, helper);

        this.opacityPoints = [];

        this.scene.addEventListener("change", this._onChange.bind(this));
        this.scene.repaint();

        $("#delete-selected-btn").click(this.removeSelected.bind(this));
    }
    getPoints() {
        return this.opacityPoints;
    }
    setPoints(points) {
        this.opacityPoints = points;
        points.forEach(p => {
            this.scene.addPoint(new PointWithLimits(p.x, p.y));
        });
    }
    removeSelected() {
        this.scene.removeSelected();
    }

    //private
    _onChange() {
        this.opacityPoints = this.scene.points.map(p => new OpacityPoint(p.x, p.y));
        this.dispatchEvent(new Event("change"));
    }
    _makeHelper(coordinatesTransform, painterOptions) {
        let helper = new CanvasHelper();
        helper.coordinatesTransform = coordinatesTransform;
        helper.painterOptions = painterOptions;
        return helper;
    }
    _makePainter(canvas, coordinatesTransform, painterOptions) {
        let painter = new OpacityPainter(canvas);
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
        let mouseInterpreter = new OpacityMouseInterpreter();
        mouseInterpreter.setCanvas(canvas);
        mouseInterpreter.setScene(scene);
        mouseInterpreter.helper = helper;
        return mouseInterpreter;
    }
}