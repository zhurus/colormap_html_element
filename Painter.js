class Painter {
    constructor(canvas) {
        this.canvas = canvas;
        this.painterOptions = null;
        this.coordinatesTransform = null;
        this.interpolate = new CtfInterpolate();
    }
    attachColormapPoints(points) {
        this.interpolate.attachColormapPoints(points)
    }
    drawPoint(point) {
        let width = this.painterOptions.pointOptions.outRectSize;
        let height = width;
        let x = this.coordinatesTransform.toScreenX(point.x) - width / 2;
        let y = this.coordinatesTransform.toScreenY(point.y) - height / 2;
        let rect;
        if(!point.selected) {
            let toFill = this.painterOptions.pointOptions.fillSelected;
            if(toFill)
                rect = new FilledRect(x, y, width, height);
            else
                rect = new StrokeRect(x, y, width, height);
            rect.color = this.painterOptions.pointOptions.normalColor;
        }
        else {
            let toFill = this.painterOptions.pointOptions.fillNormal;
            if(toFill)
                rect = new FilledRect(x, y, width, height);
            else
                rect = new StrokeRect(x, y, width, height);
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
            options
        );
    }
    clear() {
        if(this.canvas)
            this.canvas.clear();
    }
}
