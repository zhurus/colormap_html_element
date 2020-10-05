class ColormapInput extends CtfElementInput {
    constructor() {
        super($("#ctf-colormap-canvas"));

        this.colormapPoints = [];
        this.colorInput = $("#colormap-point-input");

        $("#ctf-colormap-setDefault-btn").click(e => this.setDefault());
        $("#ctf-colormap-remove-btn").click(e => this.scene.removeSelected());

        this.scene.addEventListener("change", ()=>{
            console.log("colormap change");     // debug
            this.dispatchEvent(new Event("change"))
        });
        this.scene.addEventListener("input", ()=>{
            console.log("colormap input");      // debug
            this.dispatchEvent(new Event("input"));
            this.scene.repaint();
        });      
    }
    setPoints(colormapPoints) {
        this.colormapPoints = colormapPoints;
        this.painter.attachColormapPoints(colormapPoints);
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
    }
    getPoints() {
        // TODO
    }
    setDefault() {
        this.scene.setDefault();
        // TODO
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