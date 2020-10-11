let ctf = new Ctf()   
ctf.setDefault();
let ctfInterpolator = new CtfInterpolate(ctf.colormapPoints, ctf.colormapPoints);

let opacityInput = new OpacityInput();
opacityInput.setPoints(ctf.opacityPoints)
opacityInput.attachColormapPoints(ctf.colormapPoints);

let colormapInput = new ColormapInput();
colormapInput.setPoints(ctf.colormapPoints);

colormapInput.addEventListener("change", e => {
    let colormapPoints = colormapInput.getPoints();
    opacityInput.attachColormapPoints(colormapPoints);
});