class Rgb {
    constructor(r, g, b) {
        this.r = r? r : 0;
        this.g = g? g : 0;
        this.b = b? b : 0;
    }
    toString() {
        return `rgb(${this.r},${this.g},${this.b})`;
    }
    toStringWithSharp() {
        let r = Math.round(this.r).toString(16);
        if(r.length == 1)   
            r = `0${r}`;

        let g = Math.round(this.g).toString(16);
        if(g.length == 1)   
            g = `0${g}`;

        let b = Math.round(this.b).toString(16);
        if(b.length == 1)   
            b = `0${b}`;
        return `#${r}${g}${b}`;
    }
    lengthTo(other) {
        return Math.sqrt(
            (other.r - this.r) * (other.r - this.r) + 
            (other.g - this.g) * (other.g - this.g) + 
            (other.b - this.b) * (other.b - this.b)
        );
    }
    static fromStringWithSharp(string) {
        let r = Number("0x" + string.slice(1,3));
        let g = Number("0x" + string.slice(3,5));
        let b = Number("0x" + string.slice(5,7));
        return new Rgb(r, g, b);
    }
}