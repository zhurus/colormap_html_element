class ColormapPainter extends Painter {
    constructor(canvas) {
        super(canvas);
    }
    drawCoordinateSystem() {
        this._drawColormap();
        this._drawAxles();
        this._drawLabels();
    }
    attachColormapPoints(colormapPoints) {
        this.interpolate.attachColormapPoints(colormapPoints);
    }

    // private
    _drawColormap() {
        if(!this.interpolate.colormapPoints)
            return;

        let nRegions = this.painterOptions.nColormapRegions;
        let step = this.coordinatesTransform.width / nRegions;
        let x;
        for(x = 0 + step / 2; x <= 1; x += step) {
            let l = new GraphicsLine(
                new Point(x, 0),
                new Point(x, 1)
            );
            l.thickness = this.coordinatesTransform.toScreenSizeX(step);
            l.color = this.interpolate.interpolateColor(
                x / this.coordinatesTransform.width);
            this.drawLine(l);
        }
    }
    _drawAxles() {
        let origin = new Point(0, 0);
        let axleEnd = new Point(1, 0);
        let l = new GraphicsLine(origin, axleEnd);
        l.thickness = 1;
        l.color = new Rgb(0, 0, 0);
        this.drawLine(l);
    }
    _drawLabels() {
        let step = 0.2;
        let x = 0;
        let labelTextOpts = new TextOptions();
        labelTextOpts.alignment = "center";
        labelTextOpts.baseline = "top";
        let arrowSize = this.painterOptions.axles.arrowEndSize;
        let y1 = this.coordinatesTransform.toScreenY(0) + arrowSize / 2;
        let y2 = this.coordinatesTransform.toScreenY(0) - arrowSize / 2;
        let y_ = y1 + arrowSize / 2;
        for(; x < this.painterOptions.axles.xAxleLength; x += step) {
            let x_ = this.coordinatesTransform.toScreenX(x);
            let p = new Point(x_, y_);
            this.canvas.drawText(
                Number(x).toPrecision(1),
                p,
                labelTextOpts
            );

            let labelLine = new GraphicsLine(
                new Point(x_, y1),
                new Point(x_, y2)
            );
            this.canvas.drawLine(labelLine);
        }
    }
}