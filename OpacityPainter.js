class OpacityPainter extends Painter {
    constructor(canvas) {
        super(canvas);

        this.interpolator = new CtfInterpolate(); 
    }
    attachColormapPoints(colormapPoints) {
        this.interpolator.attachColormapPoints(colormapPoints);
    }
    drawCoordinateSystem() {
        this._drawColormap();
        this._drawAxles();
        this._drawLabels();
    }

    // private
    _drawAxles() {
        let origin = new Point(0,0);
        let xAxleEnd = new Point(this.painterOptions.axles.xAxleLength, 0);
        let yAxleEnd = new Point(0, this.painterOptions.axles.yAxleLength);
        this.drawLine(new GraphicsLine(origin, xAxleEnd));
        this.drawLine(new GraphicsLine(origin, yAxleEnd));
        
        let context = this.canvas.context;
        let x1, x2, y1, y2;

        // y-axle arrow
        yAxleEnd = this.coordinatesTransform.toScreenPoint(yAxleEnd);
        y1 = y2 = yAxleEnd.y + this.painterOptions.axles.arrowEndSize;
        x1 = this.coordinatesTransform.toScreenX(0) - this.painterOptions.axles.arrowEndSize/3;
        x2 = this.coordinatesTransform.toScreenX(0) + this.painterOptions.axles.arrowEndSize/3;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(yAxleEnd.x, yAxleEnd.y);
        context.closePath();
        context.fillStyle = "black";
        context.fill();
    }
    _drawLabels() {
        let originTextOptions = this.painterOptions.textOptions;
        originTextOptions.setAlignment("right");
        originTextOptions.setBaseline("top");
        this.drawText("0", new Point(0,0), originTextOptions);

        // y-labels
        let yAxleLabelsOptions = this.painterOptions.textOptions;
        yAxleLabelsOptions.setBaseline("middle");
        yAxleLabelsOptions.setAlignment("right");
        
        let step = 0.2;
        let x1 = this.coordinatesTransform.toScreenX(0) - 5;
        let x2 = this.coordinatesTransform.toScreenX(0) + 5;
        let x1_ = this.coordinatesTransform.fromScreenX(x1 - 5);
        for(let i = 0.2; i < this.painterOptions.axles.yAxleLength; i += step) 
        {
            let y = this.coordinatesTransform.toScreenY(i);
            let p1 = new Point(x1, y);
            let p2 = new Point(x2, y);
            let l = new GraphicsLine(p1, p2);
            this.canvas.drawLine(l);

            this.drawText(
                Number(i).toPrecision(1),
                new Point(x1_, i),
                this.painterOptions.textOptions);
        }

        // x-labels
        let xAxleLabelsOptions = this.painterOptions.textOptions;
        xAxleLabelsOptions.setBaseline("top");
        xAxleLabelsOptions.setAlignment("center");
        
        step = 0.2;
        let y1 = this.coordinatesTransform.toScreenY(0) - 5;
        let y2 = this.coordinatesTransform.toScreenY(0) + 5;
        let y1_;
        if(this.coordinatesTransform.inverseY)
            y1_ = this.coordinatesTransform.fromScreenY(y2 + 5);
        else
            y1_ = this.coordinatesTransform.fromScreenY(y2 - 5);
        for(let i = 0.2; i < this.painterOptions.axles.xAxleLength; i += step) 
        {
            let x = this.coordinatesTransform.toScreenX(i);
            let p1 = new Point(x, y1);
            let p2 = new Point(x, y2);
            let l = new GraphicsLine(p1, p2);
            this.canvas.drawLine(l);

            this.drawText(
                Number(i).toPrecision(1),
                new Point(i, y1_),
                xAxleLabelsOptions);
        }
    }
    _drawColormap() {
        if(!this.interpolator.colormapPoints)
            return;
        let nRegions = this.painterOptions.nColormapRegions;
        let step = this.coordinatesTransform.width / nRegions;
        let x;
        for(x = 0 + step / 2; x < this.coordinatesTransform.width; x += step) {
            let l = new GraphicsLine(
                new Point(x, 0),
                new Point(x, 1)
            );
            l.thickness = this.coordinatesTransform.toScreenSizeX(step);
            l.color = this.interpolator.interpolateColor(
                x / this.coordinatesTransform.width);
            this.drawLine(l);
        }
    }
}