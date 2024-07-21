export function copyScriptElement(x) {
  const script = document.createElement("script");
  x.src && (script.src = x.src);
  x.innerHTML && (script.innerHTML = x.innerHTML);
  x.type && (script.type = x.type);
  x.async && (script.async = x.async);
  x.defer && (script.defer = x.defer);
  return script;
}
export function copyStyleElement(x) {
  const link = document.createElement("link");
  x.href && (link.href = x.href);
  x.innerHTML && (link.innerHTML = x.innerHTML);
  x.rel && (link.rel = x.rel);
  x.async && (link.async = x.async);
  x.defer && (link.defer = x.defer);
  x.type && (link.type = x.type);
  return link;
}

HTMLElement.prototype.clear = function(){
  while(this.firstChild){
    this.parentElement.removeChild(this.lastChild);
  }
}