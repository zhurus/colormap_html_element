class OpacityInput extends CtfElementInput {
    constructor() {
        super($("#ctf-opacity-canvas"));

        let self = this;

        this.relvalNumbInp = new objects.NumberInput($("#ctf-opacity-selected-relval"), "");
        this.relvalNumbInp.disable();
        this.opacityNumbInp = new objects.NumberInput($("#ctf-opacity-selected-opacity"), "");
        this.opacityNumbInp.disable();

        this.scene.repaint();
        $("#ctf-opacity-remove-btn").click(e => self.scene.removeSelected());
        $("#ctf-opacity-setDefault-btn").click(e => self.setDefault());

        this.scene.addEventListener("select_point", this._onSelectPoint.bind(this));
        this.scene.addEventListener("add_point", this._onAddPoint.bind(this));
        this.scene.addEventListener("move_point", this._onMovePoint.bind(this));
        this.scene.addEventListener("remove_point", this._onRemovePoint.bind(this));
        this.scene.addEventListener("create_point", this._onCreatePoint.bind(this));
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
        // TODO disable relative value and opacity text input
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

    // slots
    _onSelectPoint() {
        // TODO
        this.scene.repaint();
    }
    _onRemovePoint() {
        // TODO
        this.scene.repaint();
    }
    _onAddPoint() {
        // TODO
        this.scene.repaint();
    }
    _onMovePoint() {
        // TODO
        this.scene.repaint();
    }
    _onCreatePoint() {
        // TODO
        this.scene.repaint();
    }
}