import { ClientState as LocalClientState } from "./ClientState.js";

export default class PhotonClient extends Photon.LoadBalancing.LoadBalancingClient {
    constructor(scene) {
        super(Photon.ConnectionProtocol.Wss, "0d3559e4-e1bf-4fe5-a345-030a67c30396", "1.0");

        this.scene = scene;
        this.myEventHandler = null;
        this.onRoomJoinedCallback = null;
        this.roomJoined = false;
        this._connectPending = false;

        // Bind state change
        this.stateChanged = (state) => this.onStateChange(state);

        // Use SDK ClientState if available, fallback to local mapping
        this.ClientStateMap = Photon?.LoadBalancing?.ClientState || LocalClientState;
    }

    connect() {
        if (this.isConnected) return;
        this.isConnected = true;

        this._connectPending = true;
        console.log("PhotonClient.connect: Connecting to Photon (WSS)...");
        try {
            this.connectToRegionMaster("us");
        } catch (err) {
            this._connectPending = false;
            console.error("PhotonClient.connect: connectToRegionMaster threw:", err);
        }
    }

    isConnected() {
        return this.client && this.client.isConnected;

    }

    
    disconnect() {
        if (this.client && this.client.isConnected) {
            console.log("PhotonClient.disconnect: Closing Photon connection...");
            this.client.disconnect();
        }
        this.isConnecting = false;

    }

    onStateChange(state) {
        console.log("Photon State Changed:", state);

        if (state === this.ClientStateMap.JoinedLobby && this.onJoinLobby) {
            this.onJoinLobby();
        }

        if (state === this.ClientStateMap.Joined && this.onRoomJoinedCallback) {
            this.roomJoined = true;
            this._connectPending = false;
            this.onRoomJoinedCallback(true); // createdByMe true by default
        }

        if (state === this.ClientStateMap.Disconnected) {
            this._connectPending = false;
        }

        if (super.onStateChange) {
            try { super.onStateChange(state); } catch (e) {}
        }
    }

    onJoinRoom(createdByMe) {
        console.log("PhotonClient: Joined Photon room!", createdByMe ? "(Created)" : "(Joined)");
        this.roomJoined = true;
        this._connectPending = false;

        if (this.onRoomJoinedCallback) {
            try { this.onRoomJoinedCallback(createdByMe); } catch (err) {
                console.error("onRoomJoinedCallback threw:", err);
            }
        }
    }

    onEvent(code, content, actorNr) {
        if (this.myEventHandler) this.myEventHandler(code, content, actorNr);
    }

    onError(errorCode, message) {
        this._connectPending = false;
        console.error("Photon ERROR:", errorCode, message);
    }

    setPlayerState(x, y) {
        try {
            this.raiseEvent(1, { x, y });
        } catch (err) {
            console.warn("setPlayerState.raiseEvent failed:", err);
        }
    }
    
}
