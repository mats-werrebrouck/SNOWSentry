function fetchAndStoreIncidents() {
    window.onload = function() {
        document.querySelectorAll('iframe#gsft_main').forEach( function(item) {
            let incidents = item.contentWindow.document.body.querySelectorAll('.list2_body tr');
                            
            let allIncidents = [];
                            
            incidents.forEach(incident => {
                const number = incident.querySelectorAll('td')[5].innerText;
                const description = incident.querySelectorAll('td')[8].innerText;
                const timestamp = incident.querySelectorAll('td')[2].innerText;
                            
                allIncidents.push({ number, description, timestamp });
            });
                            
            chrome.storage.local.set({ allIncidents });
        });
    };
}

// Initial run
fetchAndStoreIncidents();

// Periodic run
setInterval(fetchAndStoreIncidents, 3600000);