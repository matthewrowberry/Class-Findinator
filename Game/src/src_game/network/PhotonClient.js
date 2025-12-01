export default class PhotonClient {
    constructor(game) {
        this.game = game;

        if (typeof Photon === "undefined") {
            throw new Error("Photon.js not loaded!");
        }

        this.client = new Photon.LoadBalancing.LoadBalancingClient(
            "wss", // Protocol
            "0d3559e4-e1bf-4fe5-a345-030a67c30396", // App ID
            "us" // Region
        );

        this.client.stateChanged = function(state) {
            console.log("Photon state: ", state);
            if (state === Photon.LoadBalancing.ClientState.JoinedLobby) {
                this.client.joinRandomRoom().catch(() => this.client.createRoom());
            }
            if (state === Photon.LoadBalancing.ClientState.Joined) {
                this.game.onNetworkReady(this);
            }
        }.bind(this);

        this.client.myEventHandler = function(code, content, actorNr) {
            if (code === 1) {
                this.game.updateOtherPlayer(actorNr, content);
            }
        }.bind(this);
    }

    connect() {
        this.client.connectToRegionMaster("us");
    }

    setPlayerState(x, y) {
        this.client.raiseEvent(1, { x, y });
    }

    onNetworkReady() {
        console.log("Joined Photon Room");
    }
}
