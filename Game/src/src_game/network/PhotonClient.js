export default class PhotonClient {
    constructor(game) {
        this.game = game;

        if (typeof Photon === "undefined") {
            throw new Error("Photon.js not loaded! Make sure it's included in HTML before this script.");
        }

        // Correct LoadBalancingClient constructor for browser
        this.client = new Photon.LoadBalancing.LoadBalancingClient(
            "0d3559e4-e1bf-4fe5-a345-030a67c30396", // App ID
            "usw",                                     // Region ("us", "eu", etc.)
            { useSecure: true }                        // Options: enables wss://
        );

        // Handle state changes
        this.client.stateChanged = (state) => {
            console.log("Photon state:", state);

            if (state === Photon.LoadBalancing.ClientState.JoinedLobby) {
                // Try joining a random room; create one if none exists
                this.client.joinRandomRoom().catch(() => this.client.createRoom());
            }

            if (state === Photon.LoadBalancing.ClientState.Joined) {
                // Ready to send/receive game state
                this.game.onNetworkReady(this);
            }
        };

        // Handle custom events
        this.client.myEventHandler = (code, content, actorNr) => {
            if (code === 1) {
                this.game.updateOtherPlayer(actorNr, content);
            }
        };
    }

    connect() {
        // Connects to the Photon NameServer and then to your region
        this.client.connectToRegionMaster("usw");
    }

    setPlayerState(x, y) {
        this.client.raiseEvent(1, { x, y });
    }

    onNetworkReady() {
        console.log("Joined Photon Room");
    }
}