!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a129b7-2369-0000-b6af-fe63822fbcec";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="40c0f2be-f409-5649-999f-376ccca8ce01")}catch(e){}}();import{s as et}from"./message-uzVY4MmY.js";import{r as n}from"./chunk-35ZOQMXA-BWBy0Kll.js";import{M as at,N as rt,T as M,n as N}from"./chunk-OHNBJXQ2-CRzGLrAo.js";import{$ as it,C as nt,E as ot,J as st,Y as lt,b as ct,l as dt,m as gt,o as pt,x as ht}from"./chunk-KMA2NSDO-BQuQnxRu.js";import{t as ft}from"./chunk-X67BZSRO-ZeUwp1Ht.js";import{M as ut}from"./chunk-YOWFEKIV-EezRysrC.js";import"./chunk-445WJIJ4-D6ZTGu-o.js";import{h as mt,i as St}from"./chunk-TI7YOFXF-DFABchpd.js";var I=gt.pie,z={sections:new Map,showData:!1,config:I},v=z.sections,E=z.showData,xt=structuredClone(I),B={getConfig:n(()=>structuredClone(xt),"getConfig"),clear:n(()=>{v=new Map,E=z.showData,pt()},"clear"),setDiagramTitle:it,getDiagramTitle:ot,setAccTitle:lt,getAccTitle:ht,setAccDescription:st,getAccDescription:ct,addSection:n(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);v.has(t)||(v.set(t,a),M.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),getSections:n(()=>v,"getSections"),setShowData:n(t=>{E=t},"setShowData"),getShowData:n(()=>E,"getShowData")},vt=n((t,a)=>{ft(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),wt={parse:n(async t=>{const a=await ut("pie",t);M.debug(a),vt(a,B)},"parse")},Ct=n(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),$t=n(t=>{const a=[...t.values()].reduce((s,l)=>s+l,0),L=[...t.entries()].map(([s,l])=>({label:s,value:l})).filter(s=>s.value/a*100>=1);return rt().value(s=>s.value).sort(null)(L)},"createPieArcs"),Mt={parser:wt,db:B,renderer:{draw:n((t,a,L,s)=>{M.debug(`rendering pie chart
`+t);const l=s.db,W=nt(),c=St(l.getConfig(),W.pie),U=40,w=18,J=4,C=450,$=C,D=et(a),m=D.append("g");m.attr("transform","translate(225,225)");const{themeVariables:i}=W;let[F]=mt(i.pieOuterStrokeWidth);F??=2;const V=c.legendPosition,H=c.textPosition,X=c.donutHole>0&&c.donutHole<=.9?c.donutHole:0,p=Math.min($,C)/2-U,Y=N().innerRadius(X*p).outerRadius(p),Z=N().innerRadius(p*H).outerRadius(p*H),f=m.append("g");f.append("circle").attr("cx",0).attr("cy",0).attr("r",p+F/2).attr("class","pieOuterCircle");const S=l.getSections(),j=$t(S),q=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let y=0;S.forEach(e=>{y+=e});const O=j.filter(e=>(e.data.value/y*100).toFixed(0)!=="0"),T=at(q).domain([...S.keys()]);f.selectAll("mySlices").data(O).enter().append("path").attr("d",Y).attr("fill",e=>T(e.data.label)).attr("class",e=>{let r="pieCircle";return c.highlightSlice==="hover"?r+=" highlightedOnHover":c.highlightSlice===e.data.label&&(r+=" highlighted"),r}),f.selectAll("mySlices").data(O).enter().append("text").text(e=>(e.data.value/y*100).toFixed(0)+"%").attr("transform",e=>"translate("+Z.centroid(e)+")").style("text-anchor","middle").attr("class","slice");const K=m.append("text").text(l.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText"),u=[...S.entries()].map(([e,r])=>({label:e,value:r})),d=m.selectAll(".legend").data(u).enter().append("g").attr("class","legend");d.append("rect").attr("width",w).attr("height",w).style("fill",e=>T(e.label)).style("stroke",e=>T(e.label)),d.append("text").attr("x",22).attr("y",14).text(e=>l.getShowData()?`${e.label} [${e.value}]`:e.label);const h=Math.max(...d.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0));let x=C,b=490;const o=22,A=u.length*o;switch(V){case"center":d.attr("transform",(e,r)=>{const g=o*u.length/2,_=-h/2-22,k=r*o-g;return"translate("+_+","+k+")"});break;case"top":x+=A,d.attr("transform",(e,r)=>{const g=p;return`translate(${-h/2-22}, ${r*o-g})`}),f.attr("transform",()=>`translate(0, ${A+o})`);break;case"bottom":x+=A,d.attr("transform",(e,r)=>{const _=-h/2-22,k=r*o- -207;return"translate("+_+","+k+")"});break;case"left":b+=22+h,d.attr("transform",(e,r)=>{const g=o*u.length/2;return"translate(-207,"+(r*o-g)+")"}),f.attr("transform",()=>`translate(${h+w+J}, 0)`);break;default:b+=22+h,d.attr("transform",(e,r)=>{const g=o*u.length/2;return"translate(216,"+(r*o-g)+")"})}const P=K.node()?.getBoundingClientRect().width??0,Q=$/2-P/2,tt=$/2+P/2,R=Math.min(0,Q),G=Math.max(b,tt)-R;D.attr("viewBox",`${R} 0 ${G} ${x}`),dt(D,x,G,c.useMaxWidth)},"draw")},styles:Ct};export{Mt as diagram};

//# chunkId=40c0f2be-f409-5649-999f-376ccca8ce01