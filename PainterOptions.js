class PainterOptions {
    constructor() {
        this.linesColor = new Rgb(0, 100, 0);
        this.pointOptions = {
            normalColor: new Rgb(0, 0, 0),
            selectedColor: new Rgb(0, 0, 0),
            outRectSize: 7,
            fillNormal: false,
            fillSelected: true
        };
        this.axles = {
            xAxleLength: 1.01,
            yAxleLength: 1.05,
            arrowEndSize: 10,
            labelsStepX: 0.2,
            labelsStepY: 0.25
        };
        this.nColormapRegions = 700;
        this.textOptions = new TextOptions();
    }
    setDominantColor(rgb) {
        this.linesColor = rgb;
        this.pointOptions.normalColor = rgb;
        this.pointOptions.selectedColor = rgb;
        this.textOptions.color = rgb;
    }
}