class OpacityPainter extends Painter {
    constructor(canvas) {
        super(canvas);
    }
    attachColormapPoints(colormapPoints) {
        this.interpolate.attachColormapPoints(colormapPoints);
    }
    attachOpacityPoints(opacityPoints) {
        this.interpolate.attachOpacityPoints(opacityPoints);
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
    }
    _drawLabels() {
        let originTextOptions = this.painterOptions.textOptions;
        originTextOptions.setAlignment("right");
        originTextOptions.setBaseline("top");
        this.drawText("0", new Point(0,0), originTextOptions);

        // y-labels
        {
            let yAxleLabelsOptions = this.painterOptions.textOptions;
            yAxleLabelsOptions.setBaseline("middle");
            yAxleLabelsOptions.setAlignment("right");
            
            let stepY = this.painterOptions.axles.labelsStepY;
            let x1 = -this.coordinatesTransform.fromScreenSizeX(5);
            let x2 = -x1;
            let x1_ = 2 * x1;
            for(let i = stepY; i < this.painterOptions.axles.yAxleLength; i += stepY) 
            {
                let y = i;
                let p1 = new Point(x1, y);
                let p2 = new Point(x2, y);
                let l = new GraphicsLine(p1, p2);
                this.drawLine(l);

                this.drawText(
                    Number(i).toPrecision(2),
                    new Point(x1_, i),
                    this.painterOptions.textOptions);
            }
        }

        // x-labels
        {
            let xAxleLabelsOptions = this.painterOptions.textOptions;
            xAxleLabelsOptions.setBaseline("top");
            xAxleLabelsOptions.setAlignment("center");
            
            let stepX = this.painterOptions.axles.labelsStepX;
            let y1 = this.coordinatesTransform.fromScreenSizeY(5);
            let y2 = -y1;
            let y1_ = - 2 * y1; 
            for(let i = stepX; i < this.painterOptions.axles.xAxleLength; i += stepX) 
            {
                let x = i;
                let p1 = new Point(x, y1);
                let p2 = new Point(x, y2);
                let l = new GraphicsLine(p1, p2);
                l.color = this.painterOptions.linesColor;
                this.drawLine(l);

                this.drawText(
                    Number(i).toPrecision(1),
                    new Point(i, y1_),
                    xAxleLabelsOptions);
            }
        }
    }
    _drawColormap() {
        if(!this.interpolate.colormapPoints)
            return;
        let nRegions = this.painterOptions.nColormapRegions;
        let step = this.coordinatesTransform.width / nRegions;
        let x;
        for(x = 0 + step / 2; x <= 1; x += step) {
            let y = this.interpolate.interpolateOpacity(x);
            let l = new GraphicsLine(
                new Point(x, 0),
                new Point(x, y)
            );
            l.thickness = this.coordinatesTransform.toScreenSizeX(step);
            l.opacity = y;
            l.color = this.interpolate.interpolateColor(
                x / this.coordinatesTransform.width);
            this.drawLine(l);
        }
    }
}