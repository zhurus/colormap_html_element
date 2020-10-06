class ColormapInput extends CtfElementInput {
    constructor() {
        super($("#ctf-colormap-canvas"));

        this.colormapPointsInfo = [];

        this.colorInput = $("#colormap-point-input");

        // this.colorPickerJQ = new NumberInput()
        this.colorPickerJQ = $("#ctf-colormap-color-input");

        $("#ctf-colormap-setDefault-btn").click(e => this.setDefault());
        $("#ctf-colormap-remove-btn").click(e => this.scene.removeSelected());

        this.scene.addEventListener("change", ()=>{
            this.dispatchEvent(new Event("change"))
        });
        this.scene.addEventListener("input", ()=>{
            let cmPts = [];
            this.scene.points.forEach(p => {
                
            });
            // TODO
            this.painter.attachColormapPoints(cmPts);
            this.scene.repaint();
            this.dispatchEvent(new Event("input"));
        });
    }
    setPoints(colormapPoints) {
        this.colormapPointsInfo = [];
        colormapPoints.forEach(p => {
            let sp = new PointWithLimits(
                p.relativeVal,
                0.5
            );
            this.colormapPointsInfo.push({
                scenePoint: sp,
                colormapPoint: p
            });
            sp.setFixedY(0.5);
            sp.setMinX(0);
            sp.setMaxX(1);
            this.scene.addPoint(sp);
        }, this);
        this.painter.attachColormapPoints(colormapPoints);
    }
    getPoints() {
        // TODO
    }
    setDefault() {
        this.scene.setDefault();
    }
    
    // private
    _makePainterOptions() {
        return new PainterOptions();
    }
    _makeCoordinateTransform(canvas) {
        let coordinatesTransform = new CoordinatesTransform();
        coordinatesTransform.adaptToCanvas(canvas);
        coordinatesTransform.setMarginBottom(25);
        coordinatesTransform.setMarginTop(10);
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