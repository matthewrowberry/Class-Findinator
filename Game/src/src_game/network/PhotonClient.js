export default class PhotonClient {
    constructor(game) {
        this.game = game;

        if (typeof Photon === "undefined") {
            throw new Error("Photon.js not loaded! Make sure it's included in HTML before this script.");
        }

        this.client = new Photon.LoadBalancing.LoadBalancingClient(
            "us", // Region
            "0d3559e4-e1bf-4fe5-a345-030a67c30396" // APP ID
        );

        // Browser SDK uses stateChanged and myEventHandler
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
