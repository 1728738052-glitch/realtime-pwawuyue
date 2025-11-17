const symbols = ['BTC-USDT','ETH-USDT','SOL-USDT','BNB-USDT'];

// 连接 OKX WebSocket 获取实时行情
const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');

ws.onopen = () => {
  ws.send(JSON.stringify({
    op: "subscribe",
    args: symbols.map(sym=>({channel:"ticker",instId:sym}))
  }));
};

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if(data.arg && data.data){
    const sym = data.arg.instId;
    const price = parseFloat(data.data[0].last);
    const signal = data.data[0].last >= data.data[0].open ? '做多':'做空';
    updateUI(sym, price, signal);
  }
};

function updateUI(symbol, price, signal){
  document.querySelector(`#${symbol} .price`).innerText = price.toFixed(2);
  document.querySelector(`#${symbol} .signal`).innerText = signal;

  if(Notification.permission === 'granted'){
    navigator.serviceWorker.getRegistration().then(reg=>{
      if(reg) reg.showNotification(`${symbol} 信号: ${signal}`, {body:`当前价格: ${price.toFixed(2)}`});
    });
  }
}

if(Notification.permission !== 'granted'){
  Notification.requestPermission();
}

function switchTheme() {
  document.body.style.background = document.body.style.background=='#071022' ? '#f0f0f0':'#071022';
  document.body.style.color = document.body.style.color=='#fff' ? '#000':'#fff';
}