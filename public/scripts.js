function makeRequest(url) {
    // Display an alert to indicate the operation is in progress
    updateStatusMessage('Processing request...', 'warning');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const log = document.querySelector('#log tbody');
            // Handle both single object and array responses
            if (Array.isArray(data)) {
                data.forEach(item => appendRow(item, log));
            } else {
                appendRow(data, log);
            }
            // Update the status message after processing to indicate success
            updateStatusMessage('Latest activity updated below.', 'success');
        })
        .catch(err => {
            console.error('Request failed:', err);
            // Update the status message to indicate an error
            updateStatusMessage('Failed to update due to an error.', 'danger');
        });
}

function updateStatusMessage(message, alertType = 'primary') {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.className = `alert alert-${alertType}`;  // Update the alert type dynamically
    statusMessage.textContent = message;
}


function appendRow(data, logElement) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${data.operation || data.path}</td>
                     <td>${data.sent}</td>
                     <td>${data.status || 'N/A'}</td>
                     <td>${data.statusText || 'No status text'}</td>
                     <td>${data.message || 'No message provided'}</td>`;
    logElement.appendChild(row);
}


window.onload = function () {
    // Fetch the package version
    fetch('/package-version')
        .then(response => response.json())
        .then(data => {
            const versionInfo = document.getElementById('package-version-info');
            if (data.version) {
                versionInfo.textContent = `v${data.version}`;
            } else {
                versionInfo.textContent = 'Version not found';
            }
        })
        .catch(error => {
            console.error('Error fetching package version:', error);
            const versionInfo = document.getElementById('package-version-info');
            versionInfo.textContent = 'Error loading version';
        });

    // Fetch the demo server version
    fetch('/demo-server-version')
        .then(response => response.json())
        .then(data => {
            const demoVersionInfo = document.getElementById('demo-server-version-info');
            if (data.version) {
                demoVersionInfo.textContent = `v${data.version}`;
            } else {
                demoVersionInfo.textContent = 'Version not found';
            }
        })
        .catch(error => {
            console.error('Error fetching demo server version:', error);
            const demoVersionInfo = document.getElementById('demo-server-version-info');
            demoVersionInfo.textContent = 'Error loading version';
        });
        

    fetch('http://localhost:6338/npm-package-details')
        .then(response => response.json())
        .then(data => {
            document.getElementById('package-name').innerHTML = `<strong>Package Name:</strong> ${data.packageName}`;
            document.getElementById('package-downloads').innerHTML = `<strong>Total Downloads:</strong> ${data.totalDownloads}`;
            document.getElementById('package-version').innerHTML = `<strong>Latest Version:</strong> ${data.latestVersion} (updated on ${data.lastUpdated})`;
            document.getElementById('package-description').innerHTML = `<strong>Description:</strong> ${data.description}`;
            document.getElementById('package-url').href = data.npmUrl;
            document.getElementById('package-url').innerHTML = 'Visit npm Package Page';
        })
        .catch(error => {
            console.error('Error fetching package details:', error);
            document.getElementById('package-name').innerHTML = '<strong>Error:</strong> Failed to load package details.';
        });
};
