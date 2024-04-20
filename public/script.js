function makeRequest(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const log = document.querySelector('#log tbody');
            // Handle both single object and array responses
            if (Array.isArray(data)) {
                // Handle an array of responses (from simulate server status)
                data.forEach(item => appendRow(item, log));
            } else {
                // Handle a single response (from other menu actions)
                appendRow(data, log);
            }
            // Update the status message after processing
            updateStatusMessage('Latest activity updated below.');
        })
        .catch(err => {
            console.error('Request failed:', err);
            updateStatusMessage('Failed to update due to an error.');
        });
}

function appendRow(data, logElement) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${data.action || data.path}</td>
                             <td>${data.sent}</td>
                             <td>${data.status || 'N/A'}</td>
                             <td>${data.statusText || 'No status text'}</td>
                             <td>${data.message || 'No message provided'}</td>`;
    logElement.appendChild(row);
}

function updateStatusMessage(message) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
}
