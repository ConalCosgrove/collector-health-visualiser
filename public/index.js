const params = (new URL(document.location)).searchParams;
const token = params.get('token');

const xhr = new XMLHttpRequest();

function getCollectorStatus() {
  xhr.open('GET', '/collectors');
  xhr.send();
}

xhr.onload = () => {
  // Process our return data
  if (xhr.status >= 200 && xhr.status < 300) {
    buildCollectors(JSON.parse(xhr.response));
  } else {
    console.log(xhr.status)
  }
};

function buildCollectors(data) {
  document.getElementById('collectors').innerHTML = '';
  data.forEach((collector) => {
    let newCollectorDiv = document.createElement('div');
    newCollectorDiv = setCollectorColor(newCollectorDiv, collector);
    const newCollectorText = document.createElement('p');
    newCollectorText.id = `collectortext`;
    newCollectorText.innerHTML = collector.name;
    newCollectorDiv.appendChild(newCollectorText);
    const statusText = document.createElement('p');
    statusText.innerHTML = collector.status;
    newCollectorDiv.appendChild(statusText);
    document.getElementById('collectors').appendChild(newCollectorDiv);
  });
}

function setCollectorColor(div, collector) {
  switch (collector.status) {
    case 'Running':
      div.id = 'collectorActive';
      break;
    case 'MissedHeartbeat':
      div.id = 'collectorMissedHb';
      break;
    default:
      div.id = 'collectorUndefined';
  }
  return div;
}
getCollectorStatus();
setInterval(getCollectorStatus, 10000);