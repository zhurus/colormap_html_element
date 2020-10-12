class OpacityInput extends CtfElementInput {
    constructor() {
        super($("#ctf-opacity-canvas"));

        this.relvalNumbInp = new objects.NumberInput($("#ctf-opacity-selected-relval"), "");
        this.opacityNumbInp = new objects.NumberInput($("#ctf-opacity-selected-opacity"), "");
        this._init();
    }
    attachColormapPoints(colormapPoints) {
        this.painter.attachColormapPoints(colormapPoints);
        this.scene.repaint();
    }
    getPoints() {
        return this.scene.points.map(sp => new OpacityPoint(sp.x, sp.y));
    }
    setPoints(points) {
        this.scene.clear();
        points.forEach(p => {
            this.scene.addPoint(new PointWithLimits(p.relativeVal, p.opacity));
        });
        
        this.relvalNumbInp.reset();
        this.opacityNumbInp.reset();

        this.relvalNumbInp.disable();
        this.opacityNumbInp.disable();        
    }
    setDefault() {
        this.relvalNumbInp.reset();
        this.opacityNumbInp.reset();

        this.relvalNumbInp.disable();
        this.opacityNumbInp.disable();

        this.scene.setDefault();
        
        this.painter.attachOpacityPoints(this.getPoints());
        this.scene.repaint();
        this.dispatchEvent(new Event("change"));
    }

    //private
    _init() {
        this.relvalNumbInp.disable();
        this.opacityNumbInp.disable();

        this.scene.repaint();
        
        let self = this;
        $("#ctf-opacity-remove-btn").click(e => self.scene.removeSelected());
        $("#ctf-opacity-setDefault-btn").click(e => self.setDefault());

        this.scene.addEventListener("select_point", this._onSelectPoint.bind(this));
        this.scene.addEventListener("add_point", this._onAddPoint.bind(this));
        this.scene.addEventListener("move_selected", this._onMovePoint.bind(this));
        this.scene.addEventListener("remove_point", this._onRemovePoint.bind(this));
        this.scene.addEventListener("create_point", this._onCreatePoint.bind(this));

        this.relvalNumbInp.addEventListener("change", this._onAnyInputChanged.bind(this));
        this.opacityNumbInp.addEventListener("change", this._onAnyInputChanged.bind(this));
    }
    _makeCoordinateTransform(canvas) {
        let coodrdsTransform = super._makeCoordinateTransform(canvas);
        coodrdsTransform.setMarginTop(10);
        return coodrdsTransform;
    }
    _makeHelper(coordinatesTransform, painterOptions) {
        return super._makeHelper(coordinatesTransform, painterOptions);
    }
    _makePainterOptions() {
        let po = new PainterOptions();
        po.axles.yAxleLength = 1.01;
        // po.axles.
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
        let selectedPt = this.scene.getSelected();

        this.relvalNumbInp.setValue(selectedPt.x);
        this.opacityNumbInp.setValue(selectedPt.y);

        this.relvalNumbInp.enable();
        this.opacityNumbInp.enable();

        this.scene.repaint();
    }
    _onRemovePoint() {
        this.relvalNumbInp.reset();
        this.opacityNumbInp.reset();

        this.relvalNumbInp.disable();
        this.opacityNumbInp.disable();
        this.painter.attachOpacityPoints(this.getPoints());
        
        this.scene.repaint();

        this.dispatchEvent(new Event("change"));
    }
    _onAddPoint() {
        this.painter.attachOpacityPoints(this.getPoints());

        this.scene.repaint();
        this.dispatchEvent(new Event("change"));
    }
    _onMovePoint() {
        let selectedPt = this.scene.getSelected();
        this.opacityNumbInp.setValue(selectedPt.y);
        this.relvalNumbInp.setValue(selectedPt.x);
        this.painter.attachOpacityPoints(this.getPoints());
        this.scene.repaint();
    }
    _onCreatePoint() {
        this.painter.attachOpacityPoints(this.getPoints());
        this.scene.repaint();
    }
    _onAnyInputChanged() {
        let selectedPt = this.scene.getSelected();
        if(!this.relvalNumbInp.isCompleted()) {
            this.relvalNumbInp.setValue(selectedPt.x);
            return;
        }
        if(!this.opacityNumbInp.isCompleted()) {
            this.opacityNumbInp.setValue(selectedPt.y);
            return;
        }
        let x = this.relvalNumbInp.getValue();
        let y = this.opacityNumbInp.getValue();
        this.scene.moveSelected(x, y);
        
        this.relvalNumbInp.setValue(selectedPt.x);
        this.opacityNumbInp.setValue(selectedPt.y);
    }
}