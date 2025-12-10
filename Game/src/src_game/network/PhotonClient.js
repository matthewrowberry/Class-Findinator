import { ClientState as LocalClientState } from "./ClientState.js";

export default class PhotonClient extends Photon.LoadBalancing.LoadBalancingClient {
    constructor(scene) {
        super(Photon.ConnectionProtocol.Wss, "0d3559e4-e1bf-4fe5-a345-030a67c30396", "1.0");

        this.scene = scene;
        this.myEventHandler = null;
        this.onRoomJoinedCallback = null;
        this.onRoomListUpdate = null;
        this.onError = null;

        this.roomJoined = false;
        this._publicConnectPending = false;

        this.ClientStateMap = Photon?.LoadBalancing?.ClientState || LocalClientState;

        // Bind SDK state change
        this.lbc = this; // alias for clarity
        this.stateChanged = (state) => this.onStateChange(state);
    }

    // --------------------
    // Connect
    // --------------------
    connectWrap(region = "us") {
        if (this._publicConnectPending) {
            console.warn("PhotonClient: connect() called while pending.");
            return;
        }

        this._publicConnectPending = true;

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

    // --------------------
    // State change handling
    // --------------------
    onStateChange(state) {
        console.log("PhotonClient: State Changed:", state);

        // Force join lobby if connected to master
        if (state === this.ClientStateMap.ConnectedToMaster) {
            console.log("Connected to Master → forcing joinLobby()");
            
        }

        if (state === this.ClientStateMap.JoinedLobby && typeof this.scene.onJoinLobby === "function") {
            this.scene.onJoinLobby();
        }

        if (state === this.ClientStateMap.Joined && typeof this.onRoomJoinedCallback === "function") {
            this.roomJoined = true;
            this._publicConnectPending = false;
            this.onRoomJoinedCallback(true); // createdByMe
        }

        if (state === this.ClientStateMap.Disconnected) {
            this._publicConnectPending = false;
            this.roomJoined = false;
            console.warn("PhotonClient: Disconnected from server.");
        }

        if (super.onStateChange) {
            try { super.onStateChange(state); } catch (e) { console.warn("super.onStateChange error:", e); }
        }
    }

    onEvent(code, content, actorNr) {
        if (this.myEventHandler) this.myEventHandler(code, content, actorNr);
    }

    setPlayerState(x, y) {
        try {
            this.raiseEvent(1, { x, y });
        } catch (err) {
            console.warn("setPlayerState.raiseEvent failed:", err);
        }
    }

    // --------------------
    // Helpers
    // --------------------
    joinLobby() {
        // SDK method
        if (typeof this.opJoinLobby === "function") {
            this.opJoinLobby();
        } else {
            console.error("PhotonClient: opJoinLobby not available!");
        }
    }

    createRoom(roomName, options = {}) {
        console.log("PhotonClient: creating room:", roomName);
        const success = super.createRoom(roomName, options);
        if (!success) console.warn("PhotonClient: createRoom returned false");
    }

    // Add this callback if not already present
    onJoinRoom(createdByMe) {
        console.log("PhotonClient: joined room", createdByMe ? "(Created)" : "(Joined)");
        this.roomJoined = true;
        this._publicConnectPending = false;
        if (this.onRoomJoinedCallback) this.onRoomJoinedCallback(createdByMe);
    }


    joinRoom(roomName) {
        console.log("PhotonClient: Joining room", roomName);
        super.joinRoom(roomName);
    }
}
