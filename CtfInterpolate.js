class CtfInterpolate {
    constructor(opacityPoints, colormapPoints) {
        this.opacityPoints = null;
        this.colormapPoints = null;
        this.attachOpacityPoints(opacityPoints);
        this.attachColormapPoints(colormapPoints);
    }
    attachOpacityPoints(opacityPoints) {
        if(opacityPoints)
            this.opacityPoints = opacityPoints.sort((op1, op2) => op1.relativeVal - op2.relativeVal);
    }
    attachColormapPoints(colormapPoints) {
        if(colormapPoints)
            this.colormapPoints = colormapPoints.sort((cp1, cp2) => cp1.relativeVal - cp2.relativeVal);
    }
    interpolateOpacity(relVal) {
        if(this.opacityPoints.length == 1)
            return this.opacityPoints[0].opacity;
        
        if(relVal <= this.opacityPoints[0].relativeVal)
            return this.opacityPoints[0].opacity;
        else if(relVal >= this.opacityPoints[this.opacityPoints.length - 1].relativeVal)
            return this.opacityPoints[1].opacity;
        
        let idx = 0;    
        for(; this.opacityPoints[idx + 1].relativeVal < relVal; ++idx) {}
        let op1 = this.opacityPoints[idx].opacity;
        let op2 = this.opacityPoints[idx + 1].opacity;
        let relVal1 = this.opacityPoints[idx].relativeVal;
        let relVal2 = this.opacityPoints[idx + 1].relativeVal;
        return op1 + (op2 - op1) / (relVal2 - relVal1) * (relVal - relVal1);
    }
    interpolateColor(relVal) {
        if(this.colormapPoints.length == 1)
            return this.colormapPoints[0].rgb;

        if(relVal <= this.colormapPoints[0].relativeVal)
            return this.colormapPoints[0].rgb;
        else if(relVal >= this.colormapPoints[this.colormapPoints.length - 1].relativeVal)
            return this.colormapPoints[this.colormapPoints.length - 1].rgb;
        let idx = 0;
        for(; this.colormapPoints[idx + 1].relativeVal < relVal; ++idx) {}
        let rgb1 = this.colormapPoints[idx].rgb;
        let rgb2 = this.colormapPoints[idx + 1].rgb;
        let relVal1 = this.colormapPoints[idx].relativeVal;
        let relVal2 = this.colormapPoints[idx + 1].relativeVal;
        let r = rgb1.r + (rgb2.r - rgb1.r) * (relVal - relVal1) / (relVal2 - relVal1);
        let g = rgb1.g + (rgb2.g - rgb1.g) * (relVal - relVal1) / (relVal2 - relVal1);
        let b = rgb1.b + (rgb2.b - rgb1.b) * (relVal - relVal1) / (relVal2 - relVal1);
        return new Rgb(r, g, b);
    }
}