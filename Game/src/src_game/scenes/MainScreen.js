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

        // Initialize Photon
        const photon = new PhotonClient(this);

        // --- LOBBY CALLBACK ---
        photon.onJoinLobby = () => {
            console.log(isHost ? "HOST: Creating room..." : "JOIN: Joining random room...");
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
                    console.warn("No room found, auto-creating for testing:", err);
                    photon.createRoom();
                });
            }
        };

        // --- ROOM JOINED CALLBACK ---
        photon.onRoomJoinedCallback = (createdByMe) => {
            console.log("Room joined callback. createdByMe=", createdByMe);
            if (!movedToMap) {
                movedToMap = true;
                sceneRef.scene.start("map", { photon });
            }
        };

        // --- SAFETY FALLBACK ---
        setTimeout(() => {
            if (!photon.isConnected()) {
                console.log("PHOTON FALLBACK TRIGGERED");

                try {
                    photon.disconnect();
                } catch (e) {
                    console.warn("Photon already closed.");
                }

                if (!movedToMap) {
                    movedToMap = true;
                    this.scene.start("map", { photon: null });
                }
            }
        }, 3000);

        photon.connect();
    }
}
