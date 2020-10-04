class OpacityInput extends CtfElementInput {
    constructor() {
        super($("#opacity-canvas"));

        let self = this;
        $("#delete-selected-btn").click(e => self.scene.removeSelected());
        $("#set-default-opacity-btn").click(e => self.scene.setDefault());

        this.scene.repaint();
    }
    attachColormapPoints(colormapPoints) {
        this.painter.attachColormapPoints(colormapPoints);
        this.scene.repaint();
    }
    getPoints() {
        return this.scene.points.map(sp => new OpacityPoint(sp.x, sp.y));
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
    setDefault() {
        this.scene.setDefault();
    }
    attachInterpolator(colormapPoints) {
        this.painter.attachColormapPoints(colormapPoints);
        this.scene.repaint();
    }

    //private
    _onChange() {
        this.opacityPoints = this.scene.points.map(p => new OpacityPoint(p.x, p.y));
        this.dispatchEvent(new Event("change"));
    }
    _makeCoordinateTransform(canvas) {
        return super._makeCoordinateTransform(canvas);
    }
    _makeHelper(coordinatesTransform, painterOptions) {
        return super._makeHelper(coordinatesTransform, painterOptions);
    }
    _makePainterOptions() {
        let po = new PainterOptions();
        po.axles.yAxleLength = 1.2;
        return po;
    }
    _makePainter(canvas, coordinatesTransform, painterOptions) {
        let painter = new OpacityPainter(canvas);
        painter.coordinatesTransform = coordinatesTransform;
        painter.painterOptions = painterOptions;
        return painter;
    }
    _makeScene(canvas, painter, helper) {
        let scene = new OpacityScene();
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