'use client';

import { useEffect, useRef } from 'react';

interface Props {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
}

export default function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1024,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  RAINBOW_MODE = false,
  COLOR = '#C3ED00',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let isActive = true;
    let rafId = 0;

    // ─── WebGL context ────────────────────────────────────────────────
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false, premultipliedAlpha: false };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gl: any = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    if (!gl) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let halfFloat: any, supportLinearFiltering: any;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }
    gl.clearColor(0, 0, 0, 0);
    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function supportRenderTextureFormat(iF: number, f: number, t: number): boolean {
      const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, iF, 4, 4, 0, f, t, null);
      const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getSupportedFormat(iF: number, f: number, t: number): any {
      if (!supportRenderTextureFormat(iF, f, t)) {
        if (iF === gl.R16F)  return getSupportedFormat(gl.RG16F, gl.RG, t);
        if (iF === gl.RG16F) return getSupportedFormat(gl.RGBA16F, gl.RGBA, t);
        return null;
      }
      return { internalFormat: iF, format: f };
    }

    let formatRGBA, formatRG, formatR;
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG   = getSupportedFormat(gl.RG16F,   gl.RG,   halfFloatTexType);
      formatR    = getSupportedFormat(gl.R16F,    gl.RED,  halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG   = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR    = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    let shading = SHADING;
    if (!supportLinearFiltering) { shading = false; }
    if (!formatRGBA || !formatRG || !formatR) return; // device not supported

    // ─── Shaders ─────────────────────────────────────────────────────
    function compileShader(type: number, src: string, kw?: string[] | null) {
      let s = src;
      if (kw) s = kw.map(k => `#define ${k}\n`).join('') + s;
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, s); gl.compileShader(sh);
      return sh;
    }
    function createProg(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
      const p = gl.createProgram()!;
      gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p); return p;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getUniforms(prog: WebGLProgram): Record<string, WebGLUniformLocation> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const u: any = {};
      const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(prog, i)!.name; u[nm] = gl.getUniformLocation(prog, nm); }
      return u;
    }

    const baseVS = compileShader(gl.VERTEX_SHADER, `precision highp float;attribute vec2 aPosition;varying vec2 vUv,vL,vR,vT,vB;uniform vec2 texelSize;void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`);

    const makeProg = (fsSrc: string, kw?: string[] | null) => {
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc, kw);
      const prog = createProg(baseVS, fs);
      return { prog, u: getUniforms(prog), bind() { gl.useProgram(prog); } };
    };

    const copyP   = makeProg(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
    const clearP  = makeProg(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
    const splatP  = makeProg(`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1.);}`);
    const advP    = makeProg(`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize,dyeTexelSize;uniform float dt,dissipation;vec4 bilerp(sampler2D s,vec2 uv,vec2 ts){vec2 st=uv/ts-.5;vec2 iuv=floor(st);vec2 fuv=fract(st);vec4 a=texture2D(s,(iuv+vec2(.5,.5))*ts);vec4 b=texture2D(s,(iuv+vec2(1.5,.5))*ts);vec4 c=texture2D(s,(iuv+vec2(.5,1.5))*ts);vec4 d=texture2D(s,(iuv+vec2(1.5,1.5))*ts);return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);}void main(){#ifdef MANUAL_FILTERING\nvec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;vec4 result=bilerp(uSource,coord,dyeTexelSize);#else\nvec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;vec4 result=texture2D(uSource,coord);#endif\nfloat decay=1.+dissipation*dt;gl_FragColor=result/decay;}`, supportLinearFiltering ? null : ['MANUAL_FILTERING']);
    const divP    = makeProg(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`);
    const curlP   = makeProg(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y,R=texture2D(uVelocity,vR).y,T=texture2D(uVelocity,vT).x,B=texture2D(uVelocity,vB).x;gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);}`);
    const vortP   = makeProg(`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+.0001;force*=curl*C;force.y*=-1.;vec2 vel=texture2D(uVelocity,vUv).xy+force*dt;vel=min(max(vel,-1000.),1000.);gl_FragColor=vec4(vel,0.,1.);}`);
    const pressP  = makeProg(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x,div=texture2D(uDivergence,vUv).x;gl_FragColor=vec4((L+R+B+T-div)*.25,0.,0.,1.);}`);
    const gradP   = makeProg(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;vec2 vel=texture2D(uVelocity,vUv).xy;vel.xy-=vec2(R-L,T-B);gl_FragColor=vec4(vel,0.,1.);}`);

    // Display material with optional SHADING keyword
    const displaySrc = `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform vec2 texelSize;void main(){vec3 c=texture2D(uTexture,vUv).rgb;#ifdef SHADING\nvec3 lc=texture2D(uTexture,vL).rgb,rc=texture2D(uTexture,vR).rgb,tc=texture2D(uTexture,vT).rgb,bc=texture2D(uTexture,vB).rgb;float dx=length(rc)-length(lc),dy=length(tc)-length(bc);vec3 n=normalize(vec3(dx,dy,length(texelSize)));float d=clamp(dot(n,vec3(0.,0.,1.))+.7,.7,1.);c*=d;#endif\nfloat a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*a,a);}`;
    const displayKw = shading ? ['SHADING'] : [];
    const displayP = makeProg(displaySrc, displayKw);

    // ─── Quad blit ────────────────────────────────────────────────────
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function blit(target: any, clear = false) {
      if (!target) { gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
      else { gl.viewport(0,0,target.width,target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
      if (clear) { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    // ─── FBO helpers ──────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function createFBO(w: number, h: number, iF: number, f: number, t: number, p: number): any {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, p);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, p);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, iF, w, h, 0, f, t, null);
      const fbo = gl.createFramebuffer()!; gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
      const tsX = 1/w, tsY = 1/h;
      return { texture: tex, fbo, width: w, height: h, texelSizeX: tsX, texelSizeY: tsY,
        attach(id: number) { gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function createDoubleFBO(w: number, h: number, iF: number, f: number, t: number, p: number): any {
      let f1 = createFBO(w,h,iF,f,t,p), f2 = createFBO(w,h,iF,f,t,p);
      return { width:w, height:h, texelSizeX:f1.texelSizeX, texelSizeY:f1.texelSizeY,
        get read(){return f1;}, set read(v){f1=v;}, get write(){return f2;}, set write(v){f2=v;},
        swap(){const tmp=f1;f1=f2;f2=tmp;} };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function resizeFBO(target: any, w: number, h: number, iF: number, f: number, t: number, p: number) {
      const n = createFBO(w,h,iF,f,t,p);
      copyP.bind(); gl.uniform1i(copyP.u.uTexture, target.attach(0)); blit(n); return n;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function resizeDoubleFBO(target: any, w: number, h: number, iF: number, f: number, t: number, p: number) {
      if (target.width===w && target.height===h) return target;
      target.read = resizeFBO(target.read,w,h,iF,f,t,p);
      target.write = createFBO(w,h,iF,f,t,p);
      target.width=w; target.height=h; target.texelSizeX=1/w; target.texelSizeY=1/h; return target;
    }

    function getResolution(res: number) {
      let ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ar < 1) ar = 1/ar;
      const min = Math.round(res), max = Math.round(res*ar);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? {width:max,height:min} : {width:min,height:max};
    }
    function scaleByPixelRatio(v: number) { return Math.floor(v*(window.devicePixelRatio||1)); }

    // ─── FBO state ────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dye: any = null, velocity: any = null, divergence: any = null, curlFBO: any = null, pressure: any = null;
    const tt = halfFloatTexType;
    const filt = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    function initFramebuffers() {
      const simRes = getResolution(SIM_RESOLUTION), dyeRes = getResolution(DYE_RESOLUTION);
      gl.disable(gl.BLEND);
      dye       = dye       ? resizeDoubleFBO(dye,      dyeRes.width, dyeRes.height, formatRGBA!.internalFormat, formatRGBA!.format, tt, filt) : createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA!.internalFormat, formatRGBA!.format, tt, filt);
      velocity  = velocity  ? resizeDoubleFBO(velocity, simRes.width, simRes.height, formatRG!.internalFormat,   formatRG!.format,   tt, filt) : createDoubleFBO(simRes.width, simRes.height, formatRG!.internalFormat,   formatRG!.format,   tt, filt);
      divergence = createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, tt, gl.NEAREST);
      curlFBO    = createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, tt, gl.NEAREST);
      pressure   = createDoubleFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, tt, gl.NEAREST);
    }
    initFramebuffers(); // init BEFORE any event listeners fire

    // ─── Color utils ─────────────────────────────────────────────────
    function HSVtoRGB(h: number, s: number, v: number) {
      const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
      const cases=[[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]];
      const [r,g,b]=cases[i%6]; return {r,g,b};
    }
    function hexToRGB(hex: string) {
      let val=hex.replace('#',''); if(val.length===3) val=val[0]+val[0]+val[1]+val[1]+val[2]+val[2];
      return {r:parseInt(val.slice(0,2),16)/255*.15, g:parseInt(val.slice(2,4),16)/255*.15, b:parseInt(val.slice(4,6),16)/255*.15};
    }
    function generateColor() {
      if (!RAINBOW_MODE) return hexToRGB(COLOR!);
      const c=HSVtoRGB(Math.random(),1,1); return {r:c.r*.15,g:c.g*.15,b:c.b*.15};
    }
    function correctRadius(r: number) { const ar=canvas!.width/canvas!.height; return ar>1?r*ar:r; }
    function correctDeltaX(d: number) { const ar=canvas!.width/canvas!.height; return ar<1?d*ar:d; }
    function correctDeltaY(d: number) { const ar=canvas!.width/canvas!.height; return ar>1?d/ar:d; }

    // ─── Fluid ops ────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function splat(x: number, y: number, dx: number, dy: number, color: any) {
      splatP.bind();
      gl.uniform1i(splatP.u.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatP.u.aspectRatio, canvas!.width/canvas!.height);
      gl.uniform2f(splatP.u.point, x, y);
      gl.uniform3f(splatP.u.color, dx, dy, 0);
      gl.uniform1f(splatP.u.radius, correctRadius(SPLAT_RADIUS/100));
      blit(velocity.write); velocity.swap();
      gl.uniform1i(splatP.u.uTarget, dye.read.attach(0));
      gl.uniform3f(splatP.u.color, color.r, color.g, color.b);
      blit(dye.write); dye.swap();
    }

    function step(dt: number) {
      gl.disable(gl.BLEND);
      curlP.bind(); gl.uniform2f(curlP.u.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(curlP.u.uVelocity, velocity.read.attach(0)); blit(curlFBO);
      vortP.bind(); gl.uniform2f(vortP.u.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(vortP.u.uVelocity, velocity.read.attach(0)); gl.uniform1i(vortP.u.uCurl, curlFBO.attach(1)); gl.uniform1f(vortP.u.curl, CURL); gl.uniform1f(vortP.u.dt, dt); blit(velocity.write); velocity.swap();
      divP.bind(); gl.uniform2f(divP.u.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(divP.u.uVelocity, velocity.read.attach(0)); blit(divergence);
      clearP.bind(); gl.uniform1i(clearP.u.uTexture, pressure.read.attach(0)); gl.uniform1f(clearP.u.value, PRESSURE); blit(pressure.write); pressure.swap();
      pressP.bind(); gl.uniform2f(pressP.u.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(pressP.u.uDivergence, divergence.attach(0));
      for (let i=0;i<PRESSURE_ITERATIONS;i++) { gl.uniform1i(pressP.u.uPressure, pressure.read.attach(1)); blit(pressure.write); pressure.swap(); }
      gradP.bind(); gl.uniform2f(gradP.u.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(gradP.u.uPressure, pressure.read.attach(0)); gl.uniform1i(gradP.u.uVelocity, velocity.read.attach(1)); blit(velocity.write); velocity.swap();
      advP.bind(); gl.uniform2f(advP.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinearFiltering) gl.uniform2f(advP.u.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      const vId=velocity.read.attach(0); gl.uniform1i(advP.u.uVelocity, vId); gl.uniform1i(advP.u.uSource, vId); gl.uniform1f(advP.u.dt, dt); gl.uniform1f(advP.u.dissipation, VELOCITY_DISSIPATION); blit(velocity.write); velocity.swap();
      if (!supportLinearFiltering) gl.uniform2f(advP.u.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advP.u.uVelocity, velocity.read.attach(0)); gl.uniform1i(advP.u.uSource, dye.read.attach(1)); gl.uniform1f(advP.u.dissipation, DENSITY_DISSIPATION); blit(dye.write); dye.swap();
    }

    function render() {
      // Clear to fully transparent before rendering
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      const w=gl.drawingBufferWidth, h=gl.drawingBufferHeight;
      displayP.bind();
      if (shading) gl.uniform2f(displayP.u.texelSize, 1/w, 1/h);
      gl.uniform1i(displayP.u.uTexture, dye.read.attach(0));
      blit(null);
    }

    function resizeCanvas() {
      const w=scaleByPixelRatio(canvas!.clientWidth), h=scaleByPixelRatio(canvas!.clientHeight);
      if (canvas!.width!==w||canvas!.height!==h) { canvas!.width=w; canvas!.height=h; return true; } return false;
    }

    // ─── Pointer state ────────────────────────────────────────────────
    const ptr = { texcoordX:0, texcoordY:0, prevX:0, prevY:0, deltaX:0, deltaY:0, color: generateColor() };
    let colorTimer = 0, lastTime = Date.now();

    // ─── RAF loop ─────────────────────────────────────────────────────
    function loop() {
      if (!isActive) return;
      const now=Date.now(), dt=Math.min((now-lastTime)/1000, 0.016666); lastTime=now;
      if (resizeCanvas()) initFramebuffers();
      colorTimer += dt*COLOR_UPDATE_SPEED;
      if (colorTimer>=1) { colorTimer=0; ptr.color=generateColor(); }
      step(dt); render();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    // ─── Event handlers (container-scoped) ───────────────────────────
    function getPos(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      return { x: scaleByPixelRatio(clientX-rect.left), y: scaleByPixelRatio(clientY-rect.top) };
    }

    function onMouseMove(e: MouseEvent) {
      const {x,y} = getPos(e.clientX, e.clientY);
      ptr.prevX=ptr.texcoordX; ptr.prevY=ptr.texcoordY;
      ptr.texcoordX=x/canvas!.width; ptr.texcoordY=1-(y/canvas!.height);
      ptr.deltaX=correctDeltaX(ptr.texcoordX-ptr.prevX);
      ptr.deltaY=correctDeltaY(ptr.texcoordY-ptr.prevY);
      if (Math.abs(ptr.deltaX)>0||Math.abs(ptr.deltaY)>0) {
        splat(ptr.texcoordX, ptr.texcoordY, ptr.deltaX*SPLAT_FORCE, ptr.deltaY*SPLAT_FORCE, ptr.color);
      }
    }

    function onMouseDown(e: MouseEvent) {
      const {x,y} = getPos(e.clientX, e.clientY);
      const c=generateColor(); c.r*=10; c.g*=10; c.b*=10;
      ptr.texcoordX=x/canvas!.width; ptr.texcoordY=1-(y/canvas!.height);
      splat(ptr.texcoordX, ptr.texcoordY, 10*(Math.random()-.5), 30*(Math.random()-.5), c);
    }

    function onTouchMove(e: TouchEvent) {
      const t=e.targetTouches[0];
      const {x,y} = getPos(t.clientX, t.clientY);
      ptr.prevX=ptr.texcoordX; ptr.prevY=ptr.texcoordY;
      ptr.texcoordX=x/canvas!.width; ptr.texcoordY=1-(y/canvas!.height);
      ptr.deltaX=correctDeltaX(ptr.texcoordX-ptr.prevX);
      ptr.deltaY=correctDeltaY(ptr.texcoordY-ptr.prevY);
      splat(ptr.texcoordX, ptr.texcoordY, ptr.deltaX*SPLAT_FORCE, ptr.deltaY*SPLAT_FORCE, ptr.color);
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      isActive = false;
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('touchmove', onTouchMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 rounded-2xl overflow-hidden" style={{ pointerEvents: 'auto', background: 'transparent' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
      />
    </div>
  );
}
