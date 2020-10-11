class PainterOptions {
    constructor() {
        // this.backgroundColor = new Rgb(255, 255, 255);
        this.pointOptions = {
            normalColor: new Rgb(0, 0, 0),
            selectedColor: new Rgb(0, 0, 0),
            outRectSize: 7,
            fillNormal: false,
            fillSelected: true
        };
        this.axles = {
            xAxleLength: 1.05,
            yAxleLength: 1.05,
            arrowEndSize: 10,
            labelsStepX: 0.2,
            labelsStepY: 0.25
        };
        this.nColormapRegions = 700;
        this.textOptions = new TextOptions();
    }
}