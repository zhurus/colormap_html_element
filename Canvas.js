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
    setBackgroundColor(rgb) {
        let r = rgb.r;
        let g = rgb.g;
        let b = rgb.b;
        this.jquery.css("backgroundColor",`rgb(${r},${g},${b})`);
    }
    drawRect(rect) {
        if(rect instanceof FilledRect) {
            this.context.fillStyle = rect.color.toString();
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        } else if(rect instanceof StrokeRect) {
            this.context.strokeStyle = rect.color.toString();
            this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }
    }
    drawLine(line) {
        if(line instanceof GraphicsLine) {
            this.context.strokeStyle = line.color.toString();
            this.context.globalAlpha = line.opacity;
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
