!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a12f58-5a54-0000-eb8b-48c4a59b8d81";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="90510f8e-866e-5587-8bbd-17a9dcf401c1")}catch(e){}}();import{s as $}from"./message-55xTxSwS.js";import{r as m}from"./chunk-35ZOQMXA-BWBy0Kll.js";import{T as b}from"./chunk-OHNBJXQ2-CRzGLrAo.js";import{$ as B,E as C,J as S,S as T,Y as D,b as E,l as P,m as z,o as F,x as A}from"./chunk-KMA2NSDO-BQuQnxRu.js";import{t as W}from"./chunk-X67BZSRO-ZeUwp1Ht.js";import{M as _}from"./chunk-YOWFEKIV-EezRysrC.js";import"./chunk-445WJIJ4-D6ZTGu-o.js";import{i as u}from"./chunk-TI7YOFXF-DFABchpd.js";var M=z.packet,w=class{constructor(){this.packet=[],this.setAccTitle=D,this.getAccTitle=A,this.setDiagramTitle=B,this.getDiagramTitle=C,this.getAccDescription=E,this.setAccDescription=S}static{m(this,"PacketDB")}getConfig(){const t=u({...M,...T().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){F(),this.packet=[]}},N=1e4,Y=m((t,e)=>{W(t,e);let r=-1,o=[],n=1;const{bitsPerRow:l}=e.getConfig();for(let{start:a,end:i,bits:d,label:c}of t.blocks){if(a!==void 0&&i!==void 0&&i<a)throw new Error(`Packet block ${a} - ${i} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${i??a} is not contiguous. It should start from ${r+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(i??=a+(d??1)-1,d??=i-a+1,r=i,b.debug(`Packet block ${a} - ${r} with label ${c}`);o.length<=l+1&&e.getPacket().length<N;){const[p,s]=L({start:a,end:i,bits:d,label:c},n,l);if(o.push(p),p.end+1===n*l&&(e.pushWord(o),o=[],n++),!s)break;({start:a,end:i,bits:d,label:c}=s)}}e.pushWord(o)},"populate"),L=m((t,e,r)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*r)return[t,void 0];const o=e*r-1,n=e*r;return[{start:t.start,end:o,label:t.label,bits:o-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),v={parser:{yy:void 0},parse:m(async t=>{const e=await _("packet",t),r=v.parser?.yy;if(!(r instanceof w))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");b.debug(e),Y(e,r)},"parse")},I=m((t,e,r,o)=>{const n=o.db,l=n.getConfig(),{rowHeight:a,paddingY:i,bitWidth:d,bitsPerRow:c}=l,p=n.getPacket(),s=n.getDiagramTitle(),h=a+i,g=h*(p.length+1)-(s?0:a),f=d*c+2,k=$(e);k.attr("viewBox",`0 0 ${f} ${g}`),P(k,g,f,l.useMaxWidth);for(const[x,y]of p.entries())O(k,y,x,l);k.append("text").text(s).attr("x",f/2).attr("y",g-h/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),O=m((t,e,r,{rowHeight:o,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:i,showBits:d})=>{const c=t.append("g"),p=r*(o+l)+l;for(const s of e){const h=s.start%i*a+1,g=(s.end-s.start+1)*a-n;if(c.append("rect").attr("x",h).attr("y",p).attr("width",g).attr("height",o).attr("class","packetBlock"),c.append("text").attr("x",h+g/2).attr("y",p+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(s.label),!d)continue;const f=s.end===s.start,k=p-2;c.append("text").attr("x",h+(f?g/2:0)).attr("y",k).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",f?"middle":"start").text(s.start),f||c.append("text").attr("x",h+g).attr("y",k).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(s.end)}},"drawWord"),j={draw:I},G={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},V={parser:v,get db(){return new w},renderer:j,styles:m(({packet:t}={})=>{const e=u(G,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles")};export{V as diagram};

//# chunkId=90510f8e-866e-5587-8bbd-17a9dcf401c1