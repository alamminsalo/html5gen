importScripts('gen.js', 'stackblur.js', 'tools.js');

onmessage = function(e) {
  switch(e.data){
      case "start":
          generate(e.data.root, e.data.canvas, e.data.options);
          postMessage({cmd:"done", root: e.data.root, canvas: e.data.canvas});
          break;
      case "stop":
          self.close();
          break;
  }
}
