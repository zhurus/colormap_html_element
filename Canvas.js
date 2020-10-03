class Canvas {
    constructor(jquery) {
        this.jquery = jquery;
        this.context = jquery[0].getContext('2d');
        this.width = jquery.width();
        this.height = jquery.height();

        this.jquery[0].width = this.width;
        this.jquery[0].height = this.height;

        this.helper = null; 
    }
    drawRect(rect) {
        if(rect instanceof FilledRect) {
            this.context.fillStyle = `rgb(${rect.color.r},${rect.color.g},${rect.color.b})`;
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        } else if(rect instanceof StrokeRect) {
            this.context.strokeStyle = `rgb(${rect.color.r},${rect.color.g},${rect.color.b})`;
            this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }
    }
    drawLine(line) {
        if(line instanceof GraphicsLine) {
            this.context.strokeStyle = `rgb(${line.color.r},${line.color.g},${line.color.b})`;
            this.context.beginPath();
            this.context.moveTo(line.point1.x, line.point1.y);
            this.context.lineTo(line.point2.x, line.point2.y);
            this.context.lineWidth = line.thickness;
            this.context.stroke();
        }
    }
    drawText(text, point, options) {
        if(options)
            options.applyTo(this.context);
        else
            options = new TextOptions();
        this.context.fillText(text, point.x, point.y);
    }
    clear() {
        let context = this.jquery[0].getContext("2d");
        context.clearRect(0, 0, this.width, this.height);
    }
}
