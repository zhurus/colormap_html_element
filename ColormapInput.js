class ColormapInput extends CtfElementInput {
    constructor() {
        super($("#colormap-canvas"));

        this.colormapPoints = [];
        this.colorInput = $("#colormap-point-input");
    }
    setPoints(colormapPoints) {
        this.colormapPoints = colormapPoints;
        colormapPoints.forEach(p => {
            let sp = new PointWithLimits(
                p.relativeVal,
                0.5
            );
            sp.setFixedY(0.5);
            sp.setMinX(0);
            sp.setMaxX(1);
            this.scene.addPoint(sp);
        }, this);
        this.painter.attachColormapPoints(colormapPoints);
        this.scene.repaint();
    }
    getPoints() {
        
    }
    
    // private
    _onChange() {
        // TODO
        this.dispatchEvent(new Event("change"));
    }
    _makePainterOptions() {
        return new PainterOptions();
    }
    _makeCoordinateTransform(canvas) {
        let coordinatesTransform = new CoordinatesTransform();
        coordinatesTransform.adaptToCanvas(canvas);
        coordinatesTransform.setMarginBottom(30);
        coordinatesTransform.setMarginTop(30);
        return coordinatesTransform;
    }
    _makePainter(canvas, coordinatesTransform, painterOptions) {
        let painter = new ColormapPainter(canvas);
        painter.coordinatesTransform = coordinatesTransform;
        painter.painterOptions = painterOptions;
        return painter;
    }
    _makeMouseInterpreter(canvas, scene, helper) {
        let mouseInterpreter = new ColormapMouseInterpreter();
        mouseInterpreter.setCanvas(canvas);
        mouseInterpreter.setScene(scene);
        mouseInterpreter.helper = helper;
        return mouseInterpreter;
    }
    _makeScene(canvas, painter, helper) {
        let scene = new ColormapScene();
        scene.canvas = canvas;
        scene.painter = painter;
        scene.helper = helper;
        return scene;
    }
}