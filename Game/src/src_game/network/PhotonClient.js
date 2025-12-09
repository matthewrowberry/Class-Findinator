import { ClientState as LocalClientState } from "./ClientState.js";

export default class PhotonClient extends Photon.LoadBalancing.LoadBalancingClient {
    constructor(scene) {
        super(Photon.ConnectionProtocol.Wss, "0d3559e4-e1bf-4fe5-a345-030a67c30396", "1.0");

        this.scene = scene;

        // Event handlers
        this.myEventHandler = null;
        this.onRoomJoinedCallback = null;
        this.onJoinLobby = null;
        this.onRoomListUpdate = null;
        this.onError = null;

        // Internal state
        this.roomJoined = false;
        this._publicConnectPending = false;

        // Use SDK ClientState or fallback
        this.ClientStateMap = Photon?.LoadBalancing?.ClientState || LocalClientState;

        // Bind SDK state changes
        this.stateChanged = (state) => this.onStateChange(state);
    }

    // Connect to a region master
    connectWrap(region = "us") {
        if (this._publicConnectPending) {
            console.warn("PhotonClient: connect() called again while pending.");
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

    // Called whenever Photon state changes
    onStateChange(state) {
        console.log("Photon State Changed:", state);

        // Joined lobby -> trigger callback
        if (state === this.ClientStateMap.JoinedLobby && typeof this.onJoinLobby === "function") {
            this.onJoinLobby();
        }

        // Joined room -> trigger callback
        if (state === this.ClientStateMap.Joined && typeof this.onRoomJoinedCallback === "function") {
            this.roomJoined = true;
            this._publicConnectPending = false;
            this.onRoomJoinedCallback(true); // true = createdByMe by default
        }

        // Disconnected -> reset flags
        if (state === this.ClientStateMap.Disconnected) {
            this._publicConnectPending = false;
            this.roomJoined = false;
            console.warn("PhotonClient: Disconnected from server.");
        }

        // Call SDK default behavior if exists
        if (super.onStateChange) {
            try { super.onStateChange(state); } catch (e) { console.warn("super.onStateChange error:", e); }
        }
    }

    onJoinRoom(createdByMe) {
        console.log("PhotonClient: Joined room", createdByMe ? "(Created)" : "(Joined)");
        this.roomJoined = true;
        this._publicConnectPending = false;
        if (this.onRoomJoinedCallback) this.onRoomJoinedCallback(createdByMe);
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

     createRoom(roomName = "Room_" + Math.floor(Math.random() * 9999)) {
        return super.createRoom(roomName)
            .then(() => {
                console.log("Room successfully created:", roomName);
                this.roomJoined = true;
                this._publicConnectPending = false;
                if (this.onRoomJoinedCallback) this.onRoomJoinedCallback(true);
            })
            .catch(err => {
                this._publicConnectPending = false;
                console.error("Failed to create room:", err);
                throw err;
            });
    }

    /**
     * Wrapper for joining a room by name
     */

    createRoom(roomName = "Room_" + Math.floor(Math.random() * 9999)) {
        return super.createRoom(roomName)
            .then(() => {
                console.log("Room successfully created:", roomName);
                this.roomJoined = true;
                this._publicConnectPending = false;
                if (this.onRoomJoinedCallback) this.onRoomJoinedCallback(true);
            })
            .catch(err => {
                this._publicConnectPending = false;
                console.error("Failed to create room:", err);
                throw err;
            });
    }



    joinRoom(roomName) {
        return super.joinRoom(roomName)
            .then(() => {
                console.log("Successfully joined room:", roomName);
                this.roomJoined = true;
                this._publicConnectPending = false;
                if (this.onRoomJoinedCallback) this.onRoomJoinedCallback(false);
            })
            .catch(err => {
                this._publicConnectPending = false;
                console.error("Failed to join room:", err);
                throw err;
            });
    }
}
