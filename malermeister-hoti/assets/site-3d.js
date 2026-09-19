/* A geometric 3D scene. The same geometry, shaders and camera path drive the site and preview. */
(function (scope, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else scope.Nera3D = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const PI = Math.PI;
  const clamp = (x, a=0, b=1) => Math.max(a,Math.min(b,x));
  const mix = (a,b,t) => a+(b-a)*t;
  const ease = (a,b,x) => { const t=clamp((x-a)/(b-a));return t*t*(3-2*t); };
  const norm = a => { const d=Math.hypot(...a)||1;return a.map(v=>v/d); };
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot = (a,b) => a.reduce((s,v,i)=>s+v*b[i],0);
  const identity = () => [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
  function multiply(a,b) {
    const out=new Array(16).fill(0);
    for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)out[col*4+row]+=a[k*4+row]*b[col*4+k];
    return out;
  }
  function matrix(x=0,y=0,z=0,rx=0,ry=0,rz=0,s=1) {
    const a=identity();a[12]=x;a[13]=y;a[14]=z;
    const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz);
    const mx=[1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1];
    const my=[cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1];
    const mz=[cz,sz,0,0,-sz,cz,0,0,0,0,1,0,0,0,0,1];
    const m=multiply(a,multiply(mz,multiply(my,mx)));
    for(let c=0;c<3;c++)for(let r=0;r<3;r++)m[c*4+r]*=s;
    return m;
  }
  function view(eye, target) {
    const z=norm(eye.map((v,i)=>v-target[i])),x=norm(cross([0,1,0],z)),y=cross(z,x);
    return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  }
  function projection(aspect, fov=41) {
    const f=1/Math.tan(fov*PI/360),n=.08,far=65;
    return [f/aspect,0,0,0,0,f,0,0,0,0,(far+n)/(n-far),-1,0,0,2*far*n/(n-far),0];
  }
  function surface(uCount,vCount,sample) {
    const data=[];
    for(let u=0;u<uCount;u++)for(let v=0;v<vCount;v++) {
      const a=sample(u/uCount,v/vCount),b=sample((u+1)/uCount,v/vCount),c=sample((u+1)/uCount,(v+1)/vCount),d=sample(u/uCount,(v+1)/vCount);
      data.push(...a,...b,...d,...b,...c,...d);
    }
    return data;
  }
  const torus=(r,t)=>surface(80,20,(u,v)=>{
    const a=u*PI*2,b=v*PI*2,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
    return [(r+t*cb)*ca,(r+t*cb)*sa,t*sb,ca*cb,sa*cb,sb];
  });
  const sphere=r=>surface(28,18,(u,v)=>{
    const a=u*PI*2,b=v*PI,n=[Math.cos(a)*Math.sin(b),Math.cos(b),Math.sin(a)*Math.sin(b)];return [...n.map(x=>x*r),...n];
  });
  const cylinder=(r,h)=>surface(40,2,(u,v)=>{const a=u*PI*2;return [r*Math.cos(a),(v-.5)*h,r*Math.sin(a),Math.cos(a),0,Math.sin(a)];});
  function roundedBox(w,h,d,r) {
    const half=[w/2,h/2,d/2],inner=half.map(x=>Math.max(0,x-r)),data=[];
    for(let axis=0;axis<3;axis++)for(const side of [-1,1]) {
      data.push(...surface(10,10,(u,v)=>{
        const p=[0,0,0];p[axis]=half[axis]*side;p[(axis+1)%3]=(u*2-1)*half[(axis+1)%3];p[(axis+2)%3]=(v*2-1)*half[(axis+2)%3];
        const q=p.map((x,i)=>clamp(x,-inner[i],inner[i])),n=norm(p.map((x,i)=>x-q[i]));return [...q.map((x,i)=>x+n[i]*r),...n];
      }));
    }
    return data;
  }
  // ---- Austauschbares 3D-Objekt -------------------------------------------
  // Wird aus assets/objekt-*.js geladen. Fehlt es, greift der Schluessel.
  const werkzeug = {torus, sphere, cylinder, roundedBox, PI};
  const umgebung = (typeof window === 'object') ? window : globalThis;
  const objekt = (typeof umgebung.SITE_3D_OBJEKT === 'object' && umgebung.SITE_3D_OBJEKT)
    ? umgebung.SITE_3D_OBJEKT
    : {
        farben: {haupt:[.92,.59,.20], hell:[1,.78,.39], akzent:[.02,.37,.18]},
        bauen: function (w) {
          const f = this.farben, haupt = f.haupt, hell = f.hell, akzent = f.akzent;
          return {
            formen: {
              bow:w.torus(.56,.145), detail:w.torus(.555,.021), neck:w.sphere(.165),
              stem:w.cylinder(.125,2.10), collar:w.torus(.145,.047),
              tip:w.roundedBox(.25,.38,.25,.055), toothA:w.roundedBox(.62,.24,.27,.048),
              toothB:w.roundedBox(.43,.23,.27,.046), gem:w.sphere(.07)
            },
            teile: [
              ['bow',0,.96,0,0,0,0,haupt], ['detail',0,.96,.139,0,0,0,hell], ['neck',0,.38,0,0,0,0,haupt],
              ['stem',0,-.61,0,0,0,0,haupt], ['collar',0,.23,0,w.PI/2,0,0,hell], ['collar',0,-.56,0,w.PI/2,0,0,hell],
              ['tip',0,-1.73,0,0,0,0,haupt], ['toothA',.21,-1.53,0,0,0,0,haupt],
              ['toothB',.14,-1.12,0,0,0,0,haupt], ['gem',0,1.53,.115,0,0,0,akzent]
            ]
          };
        }
      };
  const gold = objekt.farben.haupt, bright = objekt.farben.hell, emerald = objekt.farben.akzent;
  // Stimmung des Hintergrunds. Ein Objekt kann sie ueber "szene" ueberschreiben,
  // z.B. wenn die Markenfarbe nicht zu Gruen passt. Werte sind [r,g,b] von 0 bis 1.
  const szeneStandard = {
    grund:  [.006, .027, .017],   // Grundton der Flaeche
    schein: [.030, .340, .055],   // Lichtschein, Anfang der Fahrt
    teal:   [.018, .180, .140],   // Lichtschein, spaeter
    warm:   [.340, .105, .025],   // warmer Wechsel
    strahl: [.120, .300, .090],   // Lichtstreifen kalt
    strahlWarm: [.520, .270, .045]// Lichtstreifen warm
  };
  const szene = Object.assign({}, szeneStandard, objekt.szene || {});
  const v3 = a => 'vec3(' + a.map(n => n.toFixed(4)).join(',') + ')';
  const aufbau = objekt.bauen(werkzeug);
  const geometry = Object.assign({}, aufbau.formen, {
    vertical:roundedBox(.10,4.30,.22,.045), horizontal:roundedBox(2.95,.10,.22,.045), orbit:torus(2.32,.009)
  });
  const parts = aufbau.teile;
  // -------------------------------------------------------------------------
  let seed=21937;
  const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
  const particles=[];
  for(let i=0;i<1000;i++)particles.push((random()-.5)*18,(random()-.5)*12,-random()*28,random());

  function state(progress, time, aspect, pointerX=0, pointerY=0) {
    const p=clamp(progress,0,2),zoom=ease(.15,1.04,p),travel=ease(1.02,2,p),explode=ease(.95,1.48,p),models=[];
    const wide=aspect>1;
    const eye=[mix(-.12,wide?1.28:.12,travel)+pointerX*.10,mix(.10,.04,travel)+pointerY*.06,mix(mix(7.10,4.85,zoom),-2.6,travel)];
    const target=[mix(0,wide?1.15:.10,travel),mix(.12,0,travel),mix(0,-13,travel)];
    const keyX=mix(0,wide?1.25:.1,zoom),keyY=.22+Math.sin(time*.48)*.045;
    const keyModel=matrix(keyX,keyY,0,.09+pointerY*.035,.50+zoom*2.65+Math.sin(time*.27)*.12+pointerX*.1,-.23+zoom*.36,.94);
    const keyAlpha=1-ease(1.18,1.52,p);
    parts.forEach((part,i)=>{
      const [shape,x,y,z,rx,ry,rz,color]=part;
      const angle=i*2.39996;
      const local=matrix(x+Math.cos(angle)*explode*1.3,y+Math.sin(angle)*explode*.8,z+explode*(i%3-.6),rx+explode*.45,ry+explode*.6,rz+explode*.25);
      if(keyAlpha>.002)models.push({shape,model:multiply(keyModel,local),color,alpha:keyAlpha,emission:shape==='gem'?.12:0});
    });
    const portalAlpha=ease(.78,1.24,p),portalX=wide?1.20:.12;
    if(portalAlpha>.001)for(let i=0;i<5;i++) {
      const parent=matrix(portalX,0,-1.5-i*4.1,0,Math.sin(i*.65)*.035,Math.sin(time*.15+i*.6)*.028,1);
      const color=i%2===0?bright:[.28,.67,.43];
      for(const [shape,x,y] of [['vertical',-1.48,0],['vertical',1.48,0],['horizontal',0,-2.12],['horizontal',0,2.12]]) {
        models.push({shape,model:multiply(parent,matrix(x,y,0)),color,alpha:portalAlpha,emission:.20});
      }
    }
    const orbitAlpha=1-ease(.8,1.3,p);
    if(orbitAlpha>.001)models.push({shape:'orbit',model:matrix(0,.05,-.8,.72,.66,time*.045,1),color:bright,alpha:orbitAlpha,emission:.6});
    return {progress:p,time,eye,projection:projection(aspect,wide?41:51),view:view(eye,target),models};
  }

  const shaders={
    meshVertex:`precision highp float;
      attribute vec3 a_position;attribute vec3 a_normal;
      uniform mat4 u_model,u_view,u_projection;
      varying vec3 v_position;varying vec3 v_normal;
      void main(){vec4 world=u_model*vec4(a_position,1.0);v_position=world.xyz;v_normal=normalize(mat3(u_model)*a_normal);gl_Position=u_projection*u_view*world;}`,
    meshFragment:`precision highp float;
      uniform vec3 u_camera,u_color;uniform float u_alpha,u_emission,u_progress;
      varying vec3 v_position;varying vec3 v_normal;
      vec3 environment(vec3 r){
        vec3 base=mix(vec3(.028,.065,.042),vec3(.12,.057,.016),smoothstep(.25,.8,u_progress)*(1.0-smoothstep(.95,1.35,u_progress)));
        base+=vec3(.07,.13,.09)*max(r.y,0.0);
        float softbox=smoothstep(.70,.92,dot(r,normalize(vec3(-1.7,1.6,2.4))));
        float strip=pow(max(0.0,1.0-abs(r.x-.38)*3.8),22.0)*smoothstep(-.45,.05,r.y);
        float rim=pow(max(0.0,dot(r,normalize(vec3(1.7,.4,-1.5)))),22.0);
        return base+vec3(1.5,1.40,1.16)*softbox+vec3(2.4,2.15,1.65)*strip+vec3(.34,.9,.54)*rim;
      }
      void main(){
        vec3 n=normalize(v_normal),v=normalize(u_camera-v_position),r=reflect(-v,n);
        vec3 light=normalize(vec3(-2.3,3.2,4.0));
        float diffuse=max(dot(n,light),0.0),nv=max(dot(n,v),0.0);
        vec3 fresnel=u_color+(1.0-u_color)*pow(1.0-nv,5.0);
        float spec=pow(max(dot(n,normalize(light+v)),0.0),110.0);
        vec3 color=u_color*(.12+diffuse*.32)+environment(r)*fresnel*.85+vec3(1.5,1.25,.75)*spec*.7;
        color+=u_color*u_emission;
        float fog=1.0-exp(-max(length(u_camera-v_position)-8.0,0.0)*.058);
        color=mix(color,vec3(.007,.028,.017),fog);
        color=color/(color+vec3(.72));color=pow(color,vec3(.4545));
        if(u_color.r>u_color.g)color*=vec3(1.04,.97,.81);
        vec3 hash=fract(gl_FragCoord.xyx*.1031);
        hash+=dot(hash,hash.yzx+33.33);
        float dissolve=fract((hash.x+hash.y)*hash.z);
        if(dissolve>u_alpha)discard;
        gl_FragColor=vec4(color,1.0);
      }`,
    backgroundVertex:`attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,.999,1.0);}`,
    backgroundFragment:`precision highp float;varying vec2 v_uv;uniform float u_progress,u_time;uniform vec2 u_resolution;
      float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 uv=v_uv;float warm=smoothstep(.20,.85,u_progress)*(1.0-smoothstep(1.05,1.5,u_progress));float teal=smoothstep(1.1,1.8,u_progress);
        vec3 color=${v3(szene.grund)};
        vec2 light=vec2(.73,.78);float glow=exp(-dot((uv-light)*vec2(1.15,1.0),(uv-light)*vec2(1.15,1.0))*5.0);
        vec3 green=mix(${v3(szene.schein)},${v3(szene.teal)},teal);
        color+=mix(green,${v3(szene.warm)},warm)*glow;
        float beam=exp(-pow((uv.x+uv.y*.34-.93)*5.0,2.0))*.065;color+=mix(${v3(szene.strahl)},${v3(szene.strahlWarm)},warm)*beam;
        color*=.66+.34*smoothstep(0.0,.23,uv.y);
        color+=vec3((noise(gl_FragCoord.xy)-.5)*.008);
        gl_FragColor=vec4(color,1.0);
      }`,
    particleVertex:`precision highp float;attribute vec4 a_particle;uniform mat4 u_view,u_projection;uniform float u_time,u_dpr;varying float v_alpha,v_tone;
      void main(){vec3 p=a_particle.xyz;p.x+=sin(u_time*.13+a_particle.w*20.0)*.18;p.y+=sin(u_time*.18+a_particle.x)*.16;vec4 pos=u_projection*u_view*vec4(p,1.0);gl_Position=pos;gl_PointSize=clamp((1.5+a_particle.w*5.0)*5.0/max(pos.w,1.0)*u_dpr,1.0,11.0);v_alpha=.10+a_particle.w*.36;v_tone=a_particle.w;}`,
    particleFragment:`precision highp float;varying float v_alpha,v_tone;void main(){float d=length(gl_PointCoord-.5)*2.0;if(d>1.0)discard;vec3 color=mix(vec3(.9,.69,.28),vec3(.36,.85,.48),v_tone);gl_FragColor=vec4(color,exp(-d*d*4.0)*v_alpha);}`
  };

  function create(canvas) {
    const gl=canvas.getContext('webgl',{alpha:false,antialias:true,depth:true,stencil:false,powerPreference:'high-performance'});
    if(!gl)return null;
    const resources=[];
    function program(vertex,fragment,attributes,uniforms) {
      const p=gl.createProgram();if(!p)throw new Error('No program');
      for(const [type,text] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
        const shader=gl.createShader(type);gl.shaderSource(shader,text);gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);gl.deleteProgram(p);throw new Error('Shader unsupported');}
        gl.attachShader(p,shader);gl.deleteShader(shader);
      }
      gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('Program unsupported');resources.push(p);
      return {id:p,a:Object.fromEntries(attributes.map(n=>[n,gl.getAttribLocation(p,'a_'+n)])),u:Object.fromEntries(uniforms.map(n=>[n,gl.getUniformLocation(p,'u_'+n)]))};
    }
    const mesh=program(shaders.meshVertex,shaders.meshFragment,['position','normal'],['model','view','projection','camera','color','alpha','emission','progress']);
    const bg=program(shaders.backgroundVertex,shaders.backgroundFragment,['position'],['progress','time','resolution']);
    const dust=program(shaders.particleVertex,shaders.particleFragment,['particle'],['view','projection','time','dpr']);
    const buffers={};
    function buffer(data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b;}
    for(const [name,data] of Object.entries(geometry))buffers[name]=buffer(data);
    const backgroundBuffer=buffer([-1,-1,3,-1,-1,3]),particleBuffer=buffer(particles);
    let dpr=1;
    function attributes(program){for(let i=0;i<4;i++)gl.disableVertexAttribArray(i);gl.useProgram(program.id);for(const a of Object.values(program.a))if(a>=0)gl.enableVertexAttribArray(a);}
    function resize(){dpr=Math.min(devicePixelRatio||1,innerWidth<761?1:1.4);const scale=Math.min(1,1550/(innerWidth*dpr));canvas.width=Math.round(innerWidth*dpr*scale);canvas.height=Math.round(innerHeight*dpr*scale);gl.viewport(0,0,canvas.width,canvas.height);}
    resize();
    return {
      resize,
      draw(progress,time,x=0,y=0){
        if(gl.isContextLost())return;
        const frame=state(progress,time,canvas.width/canvas.height,x,y);
        gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);attributes(bg);gl.bindBuffer(gl.ARRAY_BUFFER,backgroundBuffer);gl.vertexAttribPointer(bg.a.position,2,gl.FLOAT,false,0,0);
        gl.uniform1f(bg.u.progress,progress);gl.uniform1f(bg.u.time,time);gl.uniform2f(bg.u.resolution,canvas.width,canvas.height);gl.drawArrays(gl.TRIANGLES,0,3);
        gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);attributes(mesh);
        gl.uniformMatrix4fv(mesh.u.view,false,new Float32Array(frame.view));gl.uniformMatrix4fv(mesh.u.projection,false,new Float32Array(frame.projection));gl.uniform3fv(mesh.u.camera,new Float32Array(frame.eye));gl.uniform1f(mesh.u.progress,progress);
        for(const object of frame.models){
          gl.bindBuffer(gl.ARRAY_BUFFER,buffers[object.shape]);gl.vertexAttribPointer(mesh.a.position,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(mesh.a.normal,3,gl.FLOAT,false,24,12);
          gl.uniformMatrix4fv(mesh.u.model,false,new Float32Array(object.model));gl.uniform3fv(mesh.u.color,new Float32Array(object.color));gl.uniform1f(mesh.u.alpha,object.alpha);gl.uniform1f(mesh.u.emission,object.emission);
          gl.drawArrays(gl.TRIANGLES,0,geometry[object.shape].length/6);
        }
        gl.depthMask(false);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);attributes(dust);gl.bindBuffer(gl.ARRAY_BUFFER,particleBuffer);gl.vertexAttribPointer(dust.a.particle,4,gl.FLOAT,false,0,0);
        gl.uniformMatrix4fv(dust.u.view,false,new Float32Array(frame.view));gl.uniformMatrix4fv(dust.u.projection,false,new Float32Array(frame.projection));gl.uniform1f(dust.u.time,time);gl.uniform1f(dust.u.dpr,dpr);
        gl.drawArrays(gl.POINTS,0,innerWidth<761?480:1000);gl.depthMask(true);
      }
    };
  }
  return {geometry,particles,shaders,state,create};
});
