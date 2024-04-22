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
    var iframe = document.getElementById('fileDirectoryFrame');
    iframe.onload = function() {
        try {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            var styleElement = iframeDocument.createElement('style');
            styleElement.type = 'text/css';
            styleElement.innerHTML = 'img { max-height: 400px; width: auto; }';  // CSS rules
            iframeDocument.head.appendChild(styleElement);
        } catch (error) {
            console.error('Could not inject CSS into iframe:', error);
        }
    };
    var setupGuideButton = document.querySelector('[data-target="#setupGuideModal"]');
    var demoGuideButton = document.querySelector('[data-target="#demoGuideModal"]');
    var setupMarkdownContainer = document.getElementById('markdownContainerSetup');
    var demoMarkdownContainer = document.getElementById('markdownContainerDemo');

    setupGuideButton.addEventListener('click', function () {
        loadMarkdown('/files/ServiceAccountSetupGuide.md', setupMarkdownContainer);
    });

    demoGuideButton.addEventListener('click', function () {
        loadMarkdown('/files/demoUse.md', demoMarkdownContainer);
    });

    function loadMarkdown(filePath, container) {
        fetch(filePath)
            .then(response => response.text())
            .then(text => {
                const converter = new showdown.Converter();
                container.innerHTML = converter.makeHtml(text);
            })
            .catch(error => {
                container.innerHTML = '<p>Error loading the guide.</p>';
                console.error('Error loading the markdown file:', error);
            });
    }
    $('#fileDirectoryModal').on('show.bs.modal', function() {
        fetch('http://localhost:6338/files')  // Update URL as needed
            .then(response => response.json())  // Adjust this if the endpoint returns HTML or text
            .then(data => {
                var content = '';
                if (Array.isArray(data)) {
                    data.forEach(file => {
                        content += `<p>${file.name}</p>`;  // Customize as per your file object structure
                    });
                } else {
                    content = '<p>No files found.</p>';
                }
                document.getElementById('fileDirectoryContainer').innerHTML = content;
            })
            .catch(error => {
                console.error('Error loading files:', error);
                document.getElementById('fileDirectoryContainer').innerHTML = 'Failed to load files.';
            });
    });
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

            // Handle keywords
            let keywordsHtml = '';
            data.keywords.forEach(keyword => {
                keywordsHtml += `<span class="badge badge-secondary">${keyword}</span> `;
            });
            document.getElementById('package-keywords').innerHTML = keywordsHtml;
        })
        .catch(error => {
            console.error('Error fetching package details:', error);
        });
};

function copyToClipboard() {
    var copyText = document.getElementById("envText");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");

    // Optional: Show an alert or change button text to confirm copied text
    alert("Copied to clipboard!");
}

function goBackIframe() {
    var iframe = document.getElementById('fileDirectoryFrame');
    if (iframe.contentWindow.history.length > 1) {
        iframe.contentWindow.history.back();
    }
}

function goHomeIframe() {
    var iframe = document.getElementById('fileDirectoryFrame');
    iframe.src = "/files";  // Reset to the home directory listing
}
