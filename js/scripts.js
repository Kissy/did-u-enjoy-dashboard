function formatClient(client) {
  if (!client) {
    return 'unknown';
  }
  return client.replace('Pool', '');
}

function formatDate(createAt) {
  const createAtDate = new Date(createAt);
  return createAtDate.getHours() + ':' + createAtDate.getMinutes();
}

function generateTypeCssClass(segments) {
  let typeCssClass = [];
  Object.keys(segments).map(function (key) {
    if (segments[key] === 't') {
      typeCssClass.push('type-' + key);
    }
  });
  return typeCssClass.join(" ");
}

function itemTemplate(result) {
  return `
    <li>
        <i class="rate rate-${result['attributes']['would_recommend']}"></i>
        <i class="type ${generateTypeCssClass(result['attributes']['segments'])}"></i>
        <span>${formatDate(result['attributes']['created_at'])}</span><br />
        <span class="client">${formatClient(result['attributes']['segments']['pool'])}</span>
    </li>
`;
}

let lastReceivedId = null;
const feedbackList = document.getElementById("feedback-list");
function updateData() {
  fetch('https://api.diduenjoy.com/api/v1/answer_sets?sort=-created_at', {
    method: 'GET',
    headers: new Headers({
      "Authorization": "Basic TODO"
    }),
    cache: 'default'
  }).then(response => response.text())
    .then(responseText => {
      const results = JSON.parse(responseText)['data'];
      lastReceivedId = results['id'];
      feedbackList.innerHTML = results.map(result => itemTemplate(result)).join("");
      setTimeout(updateData, 60000);
    });
}

 updateData();

