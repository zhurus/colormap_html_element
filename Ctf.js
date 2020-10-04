class Ctf {
    constructor() {
        this.opacityPoints = [];
        this.colormapPoints = [];
    }
    makeDataToStore() {
        let data = {
            opacityPoints: this.opacityPoints,
            colormapPoints: this.colormapPoints
        };
        return data;
    }
    makeDataToSend() {
        let interpolator = new CtfInterpolate(this.opacityPoints, this.colormapPoints);
        this.opacityPoints = interpolator.opacityPoints;
        this.colormapPoints = interpolator.colormapPoints;
        let data = {};
        let id1 = 0;
        let id2 = 0;
        while(id1 != this.colormapPoints.length || id2 != this.opacityPoints.length) {
            let relVal1 = this.colormapPoints[id1].relativeVal;
            let relVal2 = this.opacityPoints[id2].relativeVal;
            if(relVal1 < relVal2) {
                let rgb = this.colormapPoints[id1].rgb;
                let opacity = interpolator.interpolateOpacity(relVal1);
                data[relVal1] = [rgb.r / 255, rgb.g / 255, rgb.b / 255, opacity];
                id1++;
            } else if(relVal1 > relVal2) {
                let rgb = interpolator.interpolateColor(relVal2);
                let opacity = this.opacityPoints[id2].opacity;
                data[relVal2] = [rgb.r / 255, rgb.g / 255, rgb.b / 255, opacity];
                id2++;
            } else {
                let rgb = interpolator.colormapPoints[id1].rgb;
                let opacity = this.opacityPoints[id2].opacity;
                data[relVal2] = [rgb.r / 255, rgb.g / 255, rgb.b / 255, opacity];
                id1++;
                id2++;
            }
        }
        return data;
    }
    static restore(data) {
        let ctf = new Ctf();
        ctf.opacityPoints = data.opacityPoints;
        ctf.colormapPoints = data.colormapPoints;
        return ctf;
    }
    setDefault() {
        this.opacityPoints = [];
        this.opacityPoints.push(new OpacityPoint(0, 1));
        this.opacityPoints.push(new OpacityPoint(1, 1));

        this.colormapPoints = [];
        this.colormapPoints.push(new ColormapPoint(0, new Rgb(255, 0, 0)));
        this.colormapPoints.push(new ColormapPoint(0.25, new Rgb(255, 255, 0)));
        this.colormapPoints.push(new ColormapPoint(0.5, new Rgb(0, 255, 0)));
        this.colormapPoints.push(new ColormapPoint(0.75, new Rgb(0, 255, 255)));
        this.colormapPoints.push(new ColormapPoint(1, new Rgb(0, 0, 255)));
    }
}