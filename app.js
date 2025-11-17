const symbols = ['BTC-USDT','ETH-USDT','SOL-USDT','BNB-USDT'];

function fetchTicker(symbol) {
  fetch(`https://www.okx.com/api/v5/market/ticker?instId=${symbol}`)
    .then(res => res.json())
    .then(data => {
      if(data.data && data.data[0]){
        const last = parseFloat(data.data[0].last);
        const open = parseFloat(data.data[0].open24h);
        const signal = last >= open ? '做多':'做空';
        updateUI(symbol, last, signal);
      }
    }).catch(err => console.log('获取行情失败', err));
}

function updateUI(symbol, price, signal){
  document.querySelector(`#${symbol} .price`).innerText = price.toFixed(2);
  document.querySelector(`#${symbol} .signal`).innerText = signal;

  if(Notification.permission === 'granted'){
    navigator.serviceWorker.getRegistration().then(reg=>{
      if(reg) reg.showNotification(`${symbol} 信号: ${signal}`, {body:`当前价格: ${price.toFixed(2)}`});
    });
  }
}

function startPolling() {
  symbols.forEach(sym => fetchTicker(sym));
  setTimeout(startPolling, 2000);
}

if(Notification.permission !== 'granted'){
  Notification.requestPermission().then(startPolling);
} else {
  startPolling();
}

function switchTheme() {
  document.body.style.background = document.body.style.background=='#071022' ? '#f0f0f0':'#071022';
  document.body.style.color = document.body.style.color=='#fff' ? '#000':'#fff';
}