class PainterOptions {
    constructor() {
        this.pointOptions = {
            normalColor: new Rgb(0, 0, 0),
            selectedColor: new Rgb(100, 0, 0),
            outRectSize: 10
        };
        this.axles = {
            xAxleLength: 1.05,
            yAxleLength: 1.05,
            arrowEndSize: 10
        };
        this.nColormapRegions = 900;
        this.textOptions = new TextOptions();
    }
}