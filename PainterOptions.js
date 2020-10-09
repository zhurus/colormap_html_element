class PainterOptions {
    constructor() {
        this.pointOptions = {
            normalColor: new Rgb(0, 0, 255),
            selectedColor: new Rgb(255, 255, 255),
            outRectSize: 10,
            fillNormal: true,
            fillSelected: true
        };
        this.axles = {
            xAxleLength: 1.05,
            yAxleLength: 1.05,
            arrowEndSize: 10,
            labelsStepX: 0.2,
            labelsStepY: 0.25
        };
        this.nColormapRegions = 900;
        this.textOptions = new TextOptions();
    }
}