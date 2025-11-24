import { LoadBalancingClient, ClientState } from 'https://cdn.jsdelivr.net/npm/photon-realtime@5.0.0-beta.1/dist/photon-realtime.js';

export default class PhotonClient {
    constructor(game) {
        this.game = game;

        this.client = new LoadBalancingClient("wss", "0d3559e4-e1bf-4fe5-a345-030a67c30396");
        this.client.onStateChange = this.onStateCHange.bind(this);
        this.client.onEvent = this.onEvent.bind(this);
    }

    connect() {
        this.client.connectToRegionMaster("us");
    }
    onStateChange(state) {
        console.log("Photon state: ",state);

        if (state === ClientState.JoinedLobby) {
            this.client.joinRandomRoom()
                .catch(() => this.client.createRoom);
        }

        if (state === ClientState.Joined) {
            // Ready to send/receive game state
            this.game.onNetworkReady(this);
        }
    }



    onEvent(code, content, actorNr) {
        if (code === 1) {
            this.game.updateOtherPlayer(actorNr, content);
        }
    }

    setPlayerState(x, y) {
        this.client.raiseEvent(1, { x, y });
    }

    onNetworkReady() {
        console.log("Joined Photon Room")
    }

}


