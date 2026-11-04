// Small, dependency-free Chrome DevTools client used for local visual QA.
import { writeFile } from 'node:fs/promises';

export async function connect() {
  const target = await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const events = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) task?.reject(new Error(message.error.message));
      else task?.resolve(message.result);
    } else events.push(message);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  const wait = async (expression, timeout = 10000) => {
    const start = Date.now();
    while (!(await evaluate(expression))) {
      if (Date.now() - start > timeout) throw new Error('Timed out: ' + expression);
      await new Promise(resolve => setTimeout(resolve, 80));
    }
  };
  const viewport = (width, height = 1000) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const navigate = async url => {
    const token = 'qa-' + Date.now() + '-' + Math.random();
    await evaluate('window.__qaDocumentToken=' + JSON.stringify(token));
    const navigation = await send('Page.navigate', { url });
    await wait((navigation.loaderId ? 'window.__qaDocumentToken !== ' + JSON.stringify(token) + ' && ' : '') + "document.readyState === 'complete' && document.querySelector('h1') !== null");
  };
  const screenshot = async (path, full = false) => {
    await evaluate('Promise.all([...document.images].map(i => { i.loading="eager"; return Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,6000))]); }))');
    await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
    const dimensions = await evaluate('({width:innerWidth,height:document.documentElement.scrollHeight})');
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full,
      ...(full ? { clip: { x: 0, y: 0, width: dimensions.width, height: dimensions.height, scale: 1 } } : {}) });
    await writeFile(path, Buffer.from(result.data, 'base64'));
  };
  return { send, evaluate, wait, viewport, navigate, screenshot, events, close: async () => { await send('Page.close'); socket.close(); } };
}
