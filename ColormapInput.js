class Pair {
    constructor(scenePoint, colormapPoint) {
        this.scenePoint = scenePoint;
        this.colormapPoint = colormapPoint;
    }
    xChanged() {
        this.colormapPoint.relativeVal = this.scenePoint.x;
    }
    static fromColormapPoint(colormapPoint) {
        let scPt = new PointWithLimits(colormapPoint.relativeVal, 0.5);
        return new Pair(scPt, colormapPoint);
    }
}

class ColormapInput extends CtfElementInput {
    constructor() {
        super($("#ctf-colormap-canvas"));

        this.pairs = [];
        this.selectedPair = null;

        this.relValNumbInp = new objects.NumberInput("#ctf-colormap-relval-input");
        this.colorPickerJQ = $("#ctf-colormap-color-input");
        this._init();
    }
    setPoints(colormapPoints) {
        this.scene.clear();
        this.pairs = colormapPoints.map(cmPt => {
            let pair = Pair.fromColormapPoint(cmPt);
            this.scene.addPoint(pair.scenePoint);
            return pair;
        }, this);
        
        this.painter.attachColormapPoints(colormapPoints);
        this.selectedPair = null;
        this.scene.repaint();
    }
    getPoints() {
        return this.pairs.map(connection => connection.colormapPoint);
    }
    setDefault() {
        this.colorPickerJQ.attr("disabled", true);
        this.relValNumbInp.disable();

        let ctf = new Ctf();
        ctf.setDefault();
        this.setPoints(ctf.colormapPoints);
    }
    
    // private
    _init() {
        this.scene.repaint();
        this.relValNumbInp.disable();

        $("#ctf-colormap-setDefault-btn").click(e => this.setDefault());
        $("#ctf-colormap-remove-btn").click(e => this.scene.removeSelected());

        this.scene.addEventListener("select_point", this._onSelectPoint.bind(this));
        this.scene.addEventListener("add_point", this._onAddPoint.bind(this));
        this.scene.addEventListener("move_selected", this._onMovePoint.bind(this));
        this.scene.addEventListener("remove_point", this._onRemovePoint.bind(this));
        this.scene.addEventListener("create_point", this._onCreatePoint.bind(this));
        this.scene.addEventListener("select_point", this._onSelectPoint.bind(this));

        this.colorPickerJQ.change(this._onColorPickerChanged.bind(this));
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

    // slots
    _onSelectPoint() {
        this.colorPickerJQ.attr("disabled", false)
        this.relValNumbInp.enable();

        let scPt = this.scene.getSelected();

        this.selectedPair = this.pairs.find(pair => pair.scenePoint == scPt);

        let relVal = scPt.x;
        let rgb = this.selectedPair.colormapPoint.rgb;
        let rgbStr = rgb.toStringWithSharp();

        this.relValNumbInp.setValue(relVal);
        this.colorPickerJQ.val(rgbStr);

        this.scene.repaint();
    }
    _onRemovePoint() {
        let idx = this.pairs.indexOf(this.selectedPair);
        this.pairs.splice(idx, 1);
        this.painter.attachColormapPoints(this.getPoints());
        this.scene.repaint();
    }
    _onAddPoint() {
        this.scene.repaint();
    }
    _onMovePoint() {
        this.selectedPair.xChanged();
        this.scene.repaint();
    }
    _onCreatePoint() {
        let currColormapPts = this.getPoints();
        let interpolate = new CtfInterpolate(null, currColormapPts);

        this.pairs = this.pairs.sort((p1, p2) => p1.scenePoint.x - p2.scenePoint.x);
        let createdScPt = this.scene.points.find((scPt, idx) => {
            return scPt.x != this.pairs[idx].scenePoint.x;
        }, this);
        let rgb = interpolate.interpolateColor(createdScPt.x);
        let cmPt = new ColormapPoint(createdScPt.x, rgb);
        let pair = new Pair(createdScPt, cmPt);
        this.pairs.push(pair);

        this.painter.attachColormapPoints(this.getPoints());
        
        this.scene.repaint();
    }
    _onColorPickerChanged() {
        this.selectedPair.colormapPoint.rgb = Rgb.fromStringWithSharp(this.colorPickerJQ.val());
        this.scene.repaint();
    }
}