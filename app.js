const workspace = require('genesys-workspace-client-js');
const request = require('request');
const apiKey = "iB4b9IG8536FQCKiPlyXL9wJYfKbALKT4GZW9VGu";
const apiUrl = "https://gapi-use1.genesyscloud.com";
const clientId = "b219ac0408a14a33ac4333382fc776c3";
const clientSecret = "es33SiFOzMaaZ6KQ57jQ7L167owt2KOeaJq0BXEEdtlcY6V5";
const port= 3002;

//region Create an instance of WorkspaceApi
//First we need to create a new instance of the WorkspaceApi class with the following parameters: **apiKey** (required to submit API requests) and **apiUrl** (base URL that provides access to the PureEngage Cloud APIs). You can get the values for both of these parameters from your PureEngage Cloud representative.
const workspaceApi = new workspace(apiKey, apiUrl);
//endregion

let callHasBeenHeld = false;

//region Register event handlers
//Now we can register event handlers that will be called whenever the Workspace Client Library publishes a CallStateChanged or DnStateChanged message. This lets us act on changes to the call state or DN state. Here we set up an event handler to act when it receives a CallStateChanged message where the call state is either Ringing, Established, Held, or Released.
workspaceApi.on('CallStateChanged', async msg => {
    let call = msg.call;

    switch (call.state) {
        //region Ringing
        //If the call state is Ringing, then answer the call.
        case 'Ringing':
            console.log('Answering call...');
            await workspaceApi.voice.answerCall(call.id);
            break;
        //endregion
        //region Established
        //The first time we see an Established call, place it on hold. The second time, release the call.
        case 'Established':
            if (!callHasBeenHeld) {
                console.log('Placing call on hold...');
                await workspaceApi.voice.holdCall(call.id);
                callHasBeenHeld = true;
            } else {
                console.log('Releasing call...');
                await workspaceApi.voice.releaseCall(call.id);
            }
            break;
        //endregion
        //region Held
        //If the call state is Held, retrieve the call.
        case 'Held':
            console.log('Retrieving call...');
            await workspaceApi.voice.retrieveCall(call.id);
            break;
        //endregion
        //region Released
        //If the call state is Released, set the agent's state to AfterCallWork.
        case 'Released':
            console.log('Setting agent notReady w/ ACW...');
            await workspaceApi.voice.notReady('AfterCallWork');
            break;
        //endregion
    }
});

workspaceApi.on('DnStateChanged', async msg => {
    let dn = msg.dn;
    //region Handle DN state change
    //When the DN workmode changes to AfterCallWork, the sequence is over and we can exit.
    console.log(`Dn updated - number [${dn.number}] state [${dn.agentState}] workMode [${dn.agentWorkMode}]...`);
    if (dn.agentWorkMode === 'AfterCallWork') {
        console.log('done');
        await workspaceApi.destroy();
    }
    //endregion
});
//endregion


var authorizationToken = "";


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
        authorizationToken = body.access_token;
        console.log("---->2" +  authorizationToken);
        //region Authorization code grant
//You'll need to use the Authentication API to get an authorization token. See https://github.com/GenesysPureEngage/authorization-code-grant-sample-app for an example of how to do this.

//endregion

//region Initialization
//Initialize the Workspace API with the authorization token from the previous step. Finally, call `activateChannels()` to initialize the voice channel for the agent and DN.
        workspaceApi.initialize({token: authorizationToken}).then(() => {
            return workspaceApi.activateChannels(workspaceApi.user.employeeId, null, workspaceApi.user.defaultPlace).then(()=>{
                workspaceApi.voice.ready();
            })
        }).catch(console.error);
//endregion

//region Wait for an inbound call
//We wait for an inbound call so we can perform the automated sequence covered in our event handlers.
        console.log('Waiting for an inbound call...');
//endregionn
    });
};

loginWithoutLoginPage();





















