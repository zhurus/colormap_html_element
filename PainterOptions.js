class PainterOptions {
    constructor() {
        this.pointOptions = {
            normalColor: { r: 0, g: 0, b:0 },
            selectedColor: { r: 0, g: 100, b: 0 },
            outRectSize: 10
        };
        this.axles = {
            xAxleLength: 1.05,
            yAxleLength: 1.05,
            arrowEndSize: 10
        };
        this.textOptions = new TextOptions();
    }
}