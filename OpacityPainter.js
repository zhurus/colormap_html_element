class OpacityPainter {
    constructor() {
        this.canvas = null;
        this.width = 1.15;
        this.height = 1.15;
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        this.coordinatesHelper.screenWidth = canvas.width;
        this.coordinatesHelper.screenHeight = canvas.height;

        this.drawCoordinateSystem();
    }
    drawPoint(point) {
        let r = point.outlineRect();
        debugger
        let sr = this.coordinatesHelper.toScreenRect(r);
        this.canvas.drawRect(sr);
    }
    drawLine(line) {
        let l = this.coordinatesHelper.toScreenLine(line);
        this.canvas.drawLine(l);
    }
    drawText(text, point, options) {
        this.canvas.drawText(
            text,
            this.coordinatesHelper.toScreenPoint(point),
            options
        );
    }
    drawCoordinateSystem() {
        this._drawAxles();
        this._drawLabels();
        this._drawColormap();
    }
    setWidth(w) {
        this.width = w;
        this.coordinatesHelper.width = w;
    }
    setHeight(h) {
        this.width = h;
        this.coordinatesHelper.width = h;
    }
    clear() {
        if(this.canvas)
            this.canvas.clear();
    }

    // private
    _drawAxles() {        
        let origin = new Point(0,0);
        let xAxleEnd = new Point(this.width, 0);
        let yAxleEnd = new Point(0, this.height);
        this.drawLine(new GraphicsLine(origin, xAxleEnd));
        this.drawLine(new GraphicsLine(origin, yAxleEnd));
        
        let context = this.canvas.context;
        let x1, x2, y1, y2;

        // y-axle arrow
        yAxleEnd = this.coordinatesHelper.toScreenPoint(yAxleEnd);
        y1 = y2 = this.coordinatesHelper.toScreenY(this.height) + 10;
        x1 = this.coordinatesHelper.toScreenX(0) - 7/2;
        x2 = this.coordinatesHelper.toScreenX(0) + 7/2;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(yAxleEnd.x, yAxleEnd.y);
        context.closePath();
        context.fill();
    }
    _drawLabels() {
        let originTextOptions = new TextOptions();
        originTextOptions.setAlignment("right");
        originTextOptions.setBaseline("top");
        originTextOptions.setSizeInPixels(20);
        this.drawText("0", new Point(0,0), originTextOptions);

        let yAxleLabelsOptions = new TextOptions();
        yAxleLabelsOptions.setSizeInPixels(20);
        yAxleLabelsOptions.setBaseline("middle");
        yAxleLabelsOptions.setAlignment("right");
        
        let step = 0.2;
        let x1 = this.coordinatesHelper.toScreenX(0) - 5;
        let x2 = this.coordinatesHelper.toScreenX(0) + 5;
        let x1_ = this.coordinatesHelper.fromScreenX(x1 - 5);
        for(let i = 0.2; i < this.height; i += step) 
        {
            let y = this.coordinatesHelper.toScreenY(i);
            let p1 = new Point(x1, y);
            let p2 = new Point(x2, y);
            let l = new GraphicsLine(p1, p2);
            this.canvas.drawLine(l);

            this.drawText(
                Number(i).toFixed(1),
                new Point(x1_, i),
                yAxleLabelsOptions);
        }
    }
    _drawColormap() {
        // TODO
    }
} 