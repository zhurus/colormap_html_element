let ctf = new Ctf()   
ctf.setDefault();
let ctfInterpolator = new CtfInterpolate(ctf.colormapPoints, ctf.colormapPoints);

let black = new Rgb(0, 0, 0);

let opacityInput = new OpacityInput();
opacityInput.setBackgroundColor(black);
opacityInput.attachColormapPoints(ctf.colormapPoints);
opacityInput.setPoints(ctf.opacityPoints)

let colormapInput = new ColormapInput();
colormapInput.setBackgroundColor(black);
colormapInput.setPoints(ctf.colormapPoints);

colormapInput.addEventListener("change", e => {
    let colormapPoints = colormapInput.getPoints();
    opacityInput.attachColormapPoints(colormapPoints);
});