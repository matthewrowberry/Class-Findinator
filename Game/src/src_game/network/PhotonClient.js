import { ClientState } from "./ClientState.js";

export default class PhotonClient extends Photon.LoadBalancing.LoadBalancingClient {
    constructor(scene) {
        super(Photon.ConnectionProtocol.Wss, "0d3559e4-e1bf-4fe5-a345-030a67c30396", "1.0"); 
        this.scene = scene;

        this.logger = new Photon.Logger("info"); // optional logging
        this.myEventHandler = null; // for game events

        // bind state change
        this.stateChanged = (state) => this.onStateChange(state);
    }

    connect() {
        if (this.state !== ClientState.Disconnected) return;
        console.log("Connecting to Photon (WSS)...");
        this.connectToRegionMaster("us");
    }

    onStateChange(state) {
        console.log("Photon State:", state);
        // Call scene handlers if needed
        if (state === ClientState.JoinedLobby) {
            this.joinRandomRoom().catch(() => this.createRoom());
        }
        if (state === ClientState.Joined) {
            if (this.scene.onNetworkReady) this.scene.onNetworkReady(this);
        }
    }

    onJoinRoom() {
        console.log("Joined Photon room!");
    }

    onJoinLobby() {
        console.log("Joined lobby, joining default room...");
        this.joinRandomRoom();
    }

    onEvent(code, content, actorNr) {
        if (this.myEventHandler) this.myEventHandler(code, content, actorNr);
    }

    onError(errorCode, message) {
        console.error("Photon ERROR:", errorCode, message);
    }

    setPlayerState(x, y) {
        this.raiseEvent(1, { x, y });
    }
}