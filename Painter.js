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
    setBackgroundColor(rgb) {
        this.canvas.setBackgroundColor(rgb);
        let black = new Rgb(0, 0, 0);
        let white = new Rgb(255, 255, 255);
        let lengthWhite = rgb.lengthTo(black);
        let lengthBlack = rgb.lengthTo(white);
        this.painterOptions.setDominantColor(lengthBlack > lengthWhite? white : black);
    }
    drawPoint(point) {
        let width = this.painterOptions.pointOptions.outRectSize;
        let height = width;
        let x = this.coordinatesTransform.toScreenX(point.x) - width / 2;
        let y = this.coordinatesTransform.toScreenY(point.y) - height / 2;
        let rect;
        if(!point.selected) {
            let toFill = this.painterOptions.pointOptions.fillSelected;
            if(!toFill)
                rect = new FilledRect(x, y, width, height);
            else
                rect = new StrokeRect(x, y, width, height);
            rect.color = this.painterOptions.pointOptions.normalColor;
        }
        else {
            let toFill = this.painterOptions.pointOptions.fillNormal;
            if(!toFill)
                rect = new FilledRect(x, y, width, height);
            else
                rect = new StrokeRect(x, y, width, height);
            rect.color = this.painterOptions.pointOptions.selectedColor;
        }
        this.canvas.drawRect(rect);
    }
    drawLine(line) {
        let screenLine = this.coordinatesTransform.toScreenLine(line);
        if(!screenLine.color)
            screenLine.color = this.painterOptions.linesColor;
        this.canvas.drawLine(screenLine);
    }
    drawRect(rect) {
        let screenRect = this.coordinatesTransform.toScreenRect(rect);
        this.canvas.drawRect(screenRect);
    }
    drawText(text, point, options) {
        if(!options)
            options = this.painterOptions.textOptions;
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
