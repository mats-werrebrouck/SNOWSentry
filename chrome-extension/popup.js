document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['newIncidents'], data => {
        const incidents = data.newIncidents || [];
        const incidentsList = document.getElementById('incidents-list');

        incidentsList.innerHTML = '';

        if (incidents.length === 0) {
            const noIncidentsItem = document.createElement('li');
            noIncidentsItem.textContent = 'No recent incidents';
            incidentsList.appendChild(noIncidentsItem);
        } else {
            incidents.forEach(incident => {
                const incidentItem = createIncidentElement(incident);
                incidentsList.appendChild(incidentItem);
            });
        }
    });
});

function createIncidentElement(incident) {
    const incidentItem = document.createElement('li');

    const incidentNumber = document.createElement('sapn');
    incidentNumber.textContent = `Incident ${incident.number}: `;
    incidentNumber.classList.add('incident-number');
    incidentItem.appendChild(incidentNumber);

    const incidentDescription = document.createElement('span');
    incidentDescription.textContent = incident.description;
    incidentDescription.classList.add('incident-description');
    incidentItem.appendChild(incidentDescription);

    return incidentItem;
}