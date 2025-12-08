import { ClientState as LocalClientState } from "./ClientState.js";

export default class PhotonClient extends Photon.LoadBalancing.LoadBalancingClient {
  constructor(scene) {
    // If Photon SDK isn't loaded yet this will throw — keep that to help debugging.
    try {
      super(Photon.ConnectionProtocol.Wss, "0d3559e4-e1bf-4fe5-a345-030a67c30396", "1.0");
    } catch (err) {
      console.error("PhotonClient: Failed to instantiate LoadBalancingClient. Ensure Photon SDK is loaded first.", err);
      throw err;
    }

    this.scene = scene;

    try { this.logger = Photon.Logger ? new Photon.Logger("debug") : null; } catch (e) { this.logger = null; }

    this.myEventHandler = null;
    this.onRoomJoinedCallback = null;
    this.roomJoined = false;
    this._connectPending = false;
  }

  // Helper: prefer SDK ClientState, fallback to local mapping
  getClientStateMap() {
    const sdk = (typeof Photon !== 'undefined' && Photon.LoadBalancing && Photon.LoadBalancing.ClientState)
      ? Photon.LoadBalancing.ClientState
      : null;
    return sdk || LocalClientState;
  }

  connect() {
    const PhotonGlobal = (typeof Photon !== 'undefined') ? Photon
      : (typeof window !== 'undefined' && window.Photon) ? window.Photon
      : (typeof globalThis !== 'undefined' && globalThis.Photon) ? globalThis.Photon
      : undefined;

    if (!PhotonGlobal) {
      console.error("PhotonClient.connect: Photon SDK not found (global 'Photon' is undefined). " +
        "Make sure the Photon JS SDK is loaded before your game bundle.");
      return;
    }

    if (this._connectPending) {
      console.log("PhotonClient.connect: connect already in progress, skipping duplicate call.");
      return;
    }

    const clientStateMap = this.getClientStateMap();

    // Log both maps so you can inspect/compare values in console when debugging
    if (PhotonGlobal && PhotonGlobal.LoadBalancing && PhotonGlobal.LoadBalancing.ClientState) {
      console.debug("Photon SDK ClientState available:", PhotonGlobal.LoadBalancing.ClientState);
    } else {
      console.debug("Photon SDK ClientState NOT available; using local ClientState:", LocalClientState);
    }

    if (clientStateMap && clientStateMap.Disconnected !== undefined) {
      if (this.state !== undefined && this.state !== clientStateMap.Disconnected && clientStateMap === PhotonGlobal?.LoadBalancing?.ClientState) {
        console.log("PhotonClient.connect: skipping connect because client state =", this.state);
        return;
      }
      // If using local fallback, don't be too strict — allow connect attempts unless _connectPending says otherwise.
    }

    this._connectPending = true;

    console.log("PhotonClient.connect: Connecting to Photon (WSS)...");
    try {
      // You can try omitting the region to let SDK pick or change "us" to the region your app uses.
      this.connectToRegionMaster("us");
    } catch (err) {
      this._connectPending = false;
      console.error("PhotonClient.connect: connectToRegionMaster threw:", err);
    }
  }

  onStateChange(state) {
    const clientStateMap = this.getClientStateMap();

    console.log("Photon State Changed:", state, clientStateMap);

    // If we can interpret Joined/Disconnected, clear pending on those states
    if (clientStateMap && clientStateMap.Joined !== undefined && clientStateMap.Disconnected !== undefined) {
      if (state === clientStateMap.Joined) {
        console.log("Photon Client is fully joined!");
        this._connectPending = false;
        if (this.scene && this.scene.onNetworkReady) this.scene.onNetworkReady(this);
      } else if (state === clientStateMap.Disconnected) {
        this._connectPending = false;
      }
    }

    if (super.onStateChange) {
      try { super.onStateChange(state); } catch (e) { /* ignore */ }
    }
  }

  onJoinRoom(createdByMe) {
    if (super.onJoinRoom) {
      try { super.onJoinRoom(createdByMe); } catch (e) { /* ignore */ }
    }

    console.log("PhotonClient: Joined Photon room!", createdByMe ? "(Created)" : "(Joined)");

    this.roomJoined = true;
    this._connectPending = false;

    if (this.onRoomJoinedCallback) {
      try { this.onRoomJoinedCallback(createdByMe); } catch (err) { console.error("onRoomJoinedCallback threw:", err); }
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