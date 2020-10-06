class OpacityInput extends CtfElementInput {
    constructor() {
        super($("#ctf-opacity-canvas"));

        let self = this;
        $("#ctf-opacity-remove-btn").click(e => self.scene.removeSelected());
        $("#ctf-opacity-setDefault-btn").click(e => self.setDefault());

        this.scene.repaint();

        this.scene.addEventListener("change", () => {
            console.log("opacity change");      // debug
            this.dispatchEvent(new Event("change"));
        });
        this.scene.addEventListener("input", () => {
            console.log("opacity input");       // debug
            this.dispatchEvent(new Event("input"));
            this.scene.repaint();
        });
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
    setDefault() {
        this.scene.setDefault();
    }
    attachInterpolator(colormapPoints) {
        this.painter.attachColormapPoints(colormapPoints);
        this.scene.repaint();
    }

    //private
    _makeCoordinateTransform(canvas) {
        let coodrdsTransform = super._makeCoordinateTransform(canvas);
        // coodrdsTransform.margin.right = 20;
        return coodrdsTransform;
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