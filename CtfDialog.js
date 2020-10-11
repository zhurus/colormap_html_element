class CtfDialog extends objects.Dialog {
    constructor(id) {
        super(id);
        this.opacityInput = new OpacityInput();
        this.colormapInput = new ColormapInput();
        this._init();
    }
    setBackgroundColor(rgb) {
        this.opacityInput.setBackgroundColor(rgb);
        this.colormapInput.setBackgroundColor(rgb);
    }
    getCtf() {
        let opacityPoints = this.opacityInput
            .getPoints()
            .sort((op1, op2) => op1.relativeVal - op2.relativeVal);
        let colormapPoints = this.colormapInput
            .getPoints()
            .sort((cmPt1, cmPt2) => cmPt1.relativeVal - cmPt2.relativeVal);
        
        let ctf = new Ctf();
        ctf.colormapPoints = colormapPoints;
        ctf.opacityPoints = opacityPoints;
        return ctf;
    }
    setCtf(ctf) {
        this.opacityInput.attachColormapPoints(ctf.colormapPoints);
        this.colormapInput.setPoints(ctf.colormapPoints);
        this.opacityInput.setPoints(ctf.opacityPoints);
    }
    reset() {
        // TODO
    }

    // private
    _init() {
        let black = new Rgb(0, 0, 0);

        this.opacityInput.setDefault();
        this.colormapInput.setDefault();

        this.opacityInput.setBackgroundColor(black);
        this.colormapInput.setBackgroundColor(black);
        
        let ctf = new Ctf();
        ctf.setDefault();
        this.setCtf(ctf);
        
        let self = this;
        this.colormapInput.addEventListener("change", e => {
            let colormapPoints = self.colormapInput.getPoints();
            self.opacityInput.attachColormapPoints(colormapPoints);
        });
    }
}