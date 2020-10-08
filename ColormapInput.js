class ColormapInput extends CtfElementInput {
    constructor() {
        super($("#ctf-colormap-canvas"));

        this.colormapPoints = [];

        this.colorInput = $("#colormap-point-input");

        // this.colorPickerJQ = new NumberInput()
        this.colorPickerJQ = $("#ctf-colormap-color-input");

        this.scene.repaint();

        $("#ctf-colormap-setDefault-btn").click(e => this.setDefault());
        $("#ctf-colormap-remove-btn").click(e => this.scene.removeSelected());

        this.scene.addEventListener("select_point", this._onSelectPoint.bind(this));
        this.scene.addEventListener("add_point", this._onAddPoint.bind(this));
        this.scene.addEventListener("move_point", this._onMovePoint.bind(this));
        this.scene.addEventListener("remove_point", this._onRemovePoint.bind(this));
        this.scene.addEventListener("create_point", this._onCreatePoint.bind(this));
    }
    setPoints(colormapPoints) {
        this.colormapPoints = colormapPoints;
        this.painter.attachColormapPoints(colormapPoints);
        colormapPoints.forEach(p => {
            let sp = new PointWithLimits(
                p.relativeVal,
                0.5
            );
            this.scene.addPoint(sp);
        }, this);
        this.painter.attachColormapPoints(colormapPoints);
        this.scene.repaint();
    }
    getPoints() {
        // TODO
    }
    setDefault() {
        this.scene.setDefault();
        // TODO
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

    // slots
    _onSelectPoint() {
        // TODO
        debugger
        this.scene.repaint();
    }
    _onRemovePoint() {
        // TODO
        debugger
        this.scene.repaint();
    }
    _onAddPoint() {
        // TODO
        // debugger
        this.scene.repaint();
    }
    _onMovePoint() {
        // TODO
        debugger
        this.scene.repaint();
    }
    _onCreatePoint() {
        let interpolate = new CtfInterpolate(null, this.colormapPoints);
        let sorted = this.colormapPoints.sort((cmPt1, cmPt2) => {
            return cmPt1.relativeVal - cmPt2.relativeVal; 
        });
        
        let scPoint = this.scene.points.find((sp, idx) => {
            return sp.x != sorted[idx].relativeVal;
        });
        let rgb = interpolate.interpolateColor(scPoint.x);
        // TODO attach relative val to relative value input
        // TODO attach color to color picker
        let cmPoint = new ColormapPoint(scPoint.x, rgb);
        sorted.push(cmPoint);
        sorted = sorted.sort((cmPt1, cmPt2) => {
            return cmPt1.relativeVal - cmPt2.relativeVal; 
        });
        for(let i = 0; i < this.colormapPoints.length; ++i)
            this.colormapPoints[i] = sorted[i];

        this.scene.repaint();
    }
}