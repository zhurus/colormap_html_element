class Painter {
    constructor(canvas) {
        this.canvas = canvas;
        this.painterOptions = null;
        
        this.coordinatesTransform = null;
    }
    drawPoint(point) {
        let width = this.painterOptions.pointOptions.outRectSize;
        let height = width;
        let x = this.coordinatesTransform.toScreenX(point.x) - width / 2;
        let y = this.coordinatesTransform.toScreenY(point.y) - height / 2;
        let rect;
        if(!point.selected) {
            rect = new StrokeRect(x, y, width, height);
            rect.color = this.painterOptions.pointOptions.normalColor;
        }
        else {
            rect = new FilledRect(x, y, width, height);
            rect.color = this.painterOptions.pointOptions.selectedColor;
        }
        this.canvas.drawRect(rect);
    }
    drawLine(line) {
        let screenLine = this.coordinatesTransform.toScreenLine(line);
        this.canvas.drawLine(screenLine);
    }
    drawRect(rect) {
        let screenRect = this.coordinatesTransform.toScreenRect(rect);
        this.canvas.drawRect(screenRect);
    }
    drawText(text, point, options) {
        this.canvas.drawText(
            text,
            this.coordinatesTransform.toScreenPoint(point),
            this.painterOptions.textOptions
        );
    }
    clear() {
        if(this.canvas)
            this.canvas.clear();
    }
}


class OpacityPainter extends Painter {
    constructor(canvas) {
        super(canvas);
    }
    drawCoordinateSystem() {
        this._drawAxles();
        this._drawLabels();
        this._drawColormap();
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
        // TODO
    }
}