import config from './config';

const CHECK_INTERVAL = 60;

function checkForNewIncidents() {
    chrome.storage.local.get(['allIncidents', 'lastChecked'], data => {
        const { allIncidents, lastChecked } = data;
        const currentTime = Date.now();

        const lastCheckedDate = lastChecked ? new Date(lastChecked) : null;

        const newIncidents = [];

        if (allIncidents && allIncidents.length > 0) {
            allIncidents.forEach(incident => {
                const incidentDate = parseTimestamp(incident.timestamp);
                if (lastChecked && incidentDate > lastCheckedDate) {
                    console.log('new incident found');
                    newIncidents.push(incident);
                }
            });
        }

        if (newIncidents.length > 0) {
            //await sendNotification(newIncidents);
            chrome.action.setBadgeText({ text: newIncidents.length.toString() });
            chrome.action.setBadgeTextColor({ color: '#FF0000' });
        }

        chrome.storage.local.set({ 'newIncidents': newIncidents });
        chrome.storage.local.set({ 'lastChecked': currentTime });
        refreshPage();
    });
}

function parseTimestamp(timestamp) {
    const parts = timestamp.split(' ');
    const dateParts = parts[0].split('-');
    const timeParts = parts[1].split(':');

    const month = parseInt(dateParts[1]) - 1; // Month is zero-based in Date object
    const day = parseInt(dateParts[0]);

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    return new Date(new Date().getFullYear(), month, day, hours, minutes);
}

async function sendNotification(incidents) {
    const chatId = config.chatId;
    const message = `New incidents found:\n${incidents.map(incident => `${incident.number}: ${incident.description}`).join('\n')}`;
    
    try {
        const response = await fetch('http://localhost:3000/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatId, message })
        });

        const data = await response.json();
        console.log('Telegram API response: ', data);
    } catch(error) {
        console.error('Error sending message to Telegram: ', error);
    }

    // const token = config.telegramToken;
    // const chatId = config.chatId;

    // const message = `New incidents found:\n${incidents.map(incident => `${incident.number}: ${incident.description}`).join('\n')}`;

    // const url = `https://api.telegram.org/bot${token}/sendMessage`;
    // const params = new URLSearchParams({
    //     chat_id: chatId,
    //     text: message
    // });

    // fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: params,
    // })
    // .then(response => {
    //     console.log(response)
    //     if (!response.ok) {
    //         throw new Error('Failed to send message');
    //     }
    //     console.log('Message sent succesfully');
    // })
    // .catch(error => {
    //     console.error('Error sending message:', error);
    // });
}

function refreshPage() {
    chrome.tabs.query({ url: config.extensionURL }, tabs => {
        if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}

function scheduleAlarm() {
    chrome.alarms.create('checkIncidents', { periodInMinutes: CHECK_INTERVAL });
}

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name == 'checkIncidents') {
        checkForNewIncidents();
    }
});

scheduleAlarm();

checkForNewIncidents();