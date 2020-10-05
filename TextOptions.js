class TextOptions {
    constructor() {
        this.size = 14;
        this.family = "Arial";
        this.color = "black";
        this.alignment = "center";
        this.baseline = "middle";
    }
    setSizeInPixels(size) {
        this.size = size;
    }
    setFontFamily(family) {
        this.family = family;
    }
    setColor(colorString) {
        this.color = colorString;
    }
    setAlignment(alignment) {
        this.alignment = alignment;
    }
    setBaseline(baseline) {
        this.baseline = baseline;
    }
    applyTo(context) {
        context.fillStyle = this.color;
        context.textAlign = this.alignment;
        context.textBaseline = this.baseline;
        context.font = `${this.size}px ${this.family}`;
    }
}