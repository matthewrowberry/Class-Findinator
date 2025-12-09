import { ClientState as LocalClientState } from "./ClientState.js";

export default class PhotonClient extends Photon.LoadBalancing.LoadBalancingClient {
    constructor(scene) {
        super(Photon.ConnectionProtocol.Wss, "0d3559e4-e1bf-4fe5-a345-030a67c30396", "1.0");

        this.scene = scene;
        this.myEventHandler = null;
        this.onRoomJoinedCallback = null;
        this.roomJoined = false;

        // Track public connect separately
        this._publicConnectPending = false;

        // Use SDK ClientState or fallback
        this.ClientStateMap = Photon?.LoadBalancing?.ClientState || LocalClientState;

        // Bind state change
        this.stateChanged = (state) => this.onStateChange(state);
    }

    /**
     * Connect to Photon region master.
     * Only triggers warning if your code calls connect() twice.
     */
    connect(region = "us") {
        // Only warn if YOUR code calls connect() twice
        if (this._publicConnectPending) {
            console.warn("PhotonClient: connect() called again by code while pending.");
            return;
        }

        this._publicConnectPending = true;

        // Disconnect old connection if needed
        if (this.isConnected()) super.disconnect();

        console.log(`PhotonClient.connect: Connecting to region master (${region})...`);

        try {
            super.connectToRegionMaster(region);
        } catch (err) {
            this._publicConnectPending = false;
            console.error("PhotonClient.connect: connectToRegionMaster threw:", err);
        }
    }


    disconnect() {
        if (this.isConnected()) super.disconnect();
        this._publicConnectPending = false;
        this.roomJoined = false;
    }

    isConnected() {
        return this.client && this.client.isConnected;
    }

    onStateChange(state) {
        console.log("Photon State Changed:", state);

        if (state === this.ClientStateMap.JoinedLobby && this.onJoinLobby) {
            this.onJoinLobby();
        }

        if (state === this.ClientStateMap.Joined && this.onRoomJoinedCallback) {
            this.roomJoined = true;
            this._publicConnectPending = false;
            this.onRoomJoinedCallback(true); // default: createdByMe
        }

        if (state === this.ClientStateMap.Disconnected) {
            this._publicConnectPending = false;
            this.roomJoined = false;
            console.warn("Photon: Disconnected from server.");
        }

        if (super.onStateChange) {
            try { super.onStateChange(state); } catch (e) {}
        }
    }

    onJoinRoom(createdByMe) {
        console.log("PhotonClient: Joined room", createdByMe ? "(Created)" : "(Joined)");
        this.roomJoined = true;
        this._publicConnectPending = false;

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
        this._publicConnectPending = false;
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
