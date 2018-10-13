const workspace = require('genesys-workspace-client-js');
const request = require('request');
const apiKey = "iB4b9IG8536FQCKiPlyXL9wJYfKbALKT4GZW9VGu";
const apiUrl = "https://gapi-use1.genesyscloud.com";
const clientId = "b219ac0408a14a33ac4333382fc776c3";
const clientSecret = "es33SiFOzMaaZ6KQ57jQ7L167owt2KOeaJq0BXEEdtlcY6V5";
const port= 3002;

const workspaceApi = new workspace(apiKey, apiUrl);

let callHasBeenHeld = false;

workspaceApi.on('CallStateChanged', async msg => {
    let call = msg.call;

    switch (call.state) {
        case 'Ringing':
            console.log('Answering call...');
            await workspaceApi.voice.answerCall(call.id);
            break;
        case 'Established':
            console.log('Connected...');
            break;
        case 'Held':
            console.log('Retrieving call...');
            await workspaceApi.voice.retrieveCall(call.id);
            break;
        case 'Released':
            console.log('Setting agent notReady w/ ACW...');
            try {
                await workspaceApi.voice.releaseCall(call.id);

            }catch (error) {
                console.log("Error Cancelling Call")
            }

            break;
    }
});

workspaceApi.on('DnStateChanged', async msg => {
    let dn = msg.dn;
    console.log(`Dn updated - number [${dn.number}] state [${dn.agentState}] workMode [${dn.agentWorkMode}]...`);
    if (dn.agentWorkMode === 'AfterCallWork') {
        await workspaceApi.voice.ready();
    }
});

function loginWithoutLoginPage(req,res) {
    let encodedCredentials = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    // Your agent username
    let username = 'RahimS';
    // Your agent password
    let password = 'Genesys1';
    request.post(`${apiUrl}/auth/v3/oauth/token`, {
        headers: {
            'x-api-key': apiKey,
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encodedCredentials}`
        },
        form: {
            client_id: clientId,
            grant_type: 'password',
            scope:'*',
            username: `Hackathon\\${username}`,
            password: password
        },
        json: true
    }, function (err, res2, body) {
        workspaceApi.initialize({token: body.access_token}).then(() => {
            return workspaceApi.activateChannels(workspaceApi.user.employeeId, null, workspaceApi.user.defaultPlace);
        }).catch(err => {
            console.log("Errr");
            console.error(err)
        });

        console.log('Waiting for an inbound call...');
    });
};

loginWithoutLoginPage();





















