class Rgb {
    constructor(r, g, b) {
        this.r = r? r : 0;
        this.g = g? g : 0;
        this.b = b? b : 0;
    }
    toString() {
        if(this.r && this.g && this.b)
            return `rgb(${this.r},${this.g},${this.b})`;
    }
}