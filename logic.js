let ctf = new Ctf()   
ctf.setDefault();
let ctfInterpolator = new CtfInterpolate(ctf.colormapPoints, ctf.colormapPoints);

let opacityInput = new OpacityInput();
opacityInput.attachColormapPoints(ctf.colormapPoints);

let colormapInput = new ColormapInput();
colormapInput.setPoints(ctf.colormapPoints);