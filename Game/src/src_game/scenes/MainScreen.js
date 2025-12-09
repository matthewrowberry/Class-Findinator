import PhotonClient from "../network/PhotonClient.js";

export class MainScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScreen' });
        console.log("Constructor")
    }

    create() {
        console.log("create")
        const { width, height } = this.scale;

        // TITLE
        const title = this.add.text(width / 2, 200, "CAPTURE THE FLAGINATOR", {
            fontSize: "64px",
            color: "#ffffff",
            strokeThickness: 6,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5, 0.5);

        // HOST BUTTON
        const hostButton = this.add.text(width / 2, height / 2, "HOST GAME", {
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        hostButton.on('pointerdown', () => this.startGame(true));

        // JOIN BUTTON
        const joinButton = this.add.text(width / 2, height / 2 + 80, "JOIN GAME", {
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        joinButton.on("pointerdown", () => this.startGame(false));
    }

    

    startGame(isHost) {
        console.log(isHost ? "Hosting game..." : "Joining game...");
        const sceneRef = this;
        let movedToMap = false;

        // Disconnect previous client
        if (window.photon) {
            window.photon.disconnect();
            window.photon = null;
        }

        const photon = new PhotonClient(this);
        window.photon = photon;

        // --- Handlers ---
        photon.onError = (code, msg) => console.error("Photon onError:", code, msg);
        photon.onStateChange = (state) => console.log("Photon state changed:", state);

        photon.onJoinLobby = () => {
            console.log("PHOTON: Joined Lobby");
            if (isHost) {
                photon.createRoom().catch(err => {
                    console.error("Create room failed:", err);
                    if (!movedToMap) {
                        movedToMap = true;
                        sceneRef.scene.start("map", { photon });
                    }
                });
            } else {
                photon.joinRandomRoom().catch(err => {
                    console.warn("No room found, auto-creating:", err);
                    photon.createRoom();
                });
            }
        };

        photon.onRoomJoinedCallback = (createdByMe) => {
            console.log("PHOTON: Room joined callback, createdByMe=", createdByMe);
            if (!movedToMap) {
                movedToMap = true;
                sceneRef.scene.start("map", { photon });
            }
        };

        // --- Connect ---
        if (!photon._publicConnectPending) {
            photon.connect("us"); // valid region code
        } else {
            console.log("Photon connect already in progress, skipping...");
        }

        // --- Fallback (10s) ---
        setTimeout(() => {
            if (!photon.roomJoined && !photon._publicConnectPending) {
                console.warn("Photon fallback: trying to connect again...");
                //photon.connect("us");
                sceneRef.scene.start("map", { photon });
            }
        }, 10000);
    }

    
    
}
