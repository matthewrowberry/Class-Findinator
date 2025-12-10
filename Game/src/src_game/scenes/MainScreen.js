import PhotonClient from "../network/PhotonClient.js";

export class MainScreen extends Phaser.Scene {
    constructor() {
        super({ key: "MainScreen" });
    }

    create() {
        const { width, height } = this.scale;

        // TITLE
        this.add.text(width / 2, 150, "CAPTURE THE FLAGINATOR", {
            fontSize: "64px",
            color: "#ffffff",
            strokeThickness: 6,
        }).setOrigin(0.5);

        // HOST BUTTON
        const hostButton = this.add.text(width / 2, height / 2 - 40, "HOST GAME", {
            fontSize: "48px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        hostButton.on("pointerdown", () => this.startGame(true));

        // JOIN BUTTON
        const joinButton = this.add.text(width / 2, height / 2 + 40, "JOIN GAME", {
            fontSize: "48px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        joinButton.on("pointerdown", () => this.startGame(false));

        // ROOM LIST
        this.roomListTitle = this.add.text(width / 2, height / 2 + 150, "", {
            fontSize: "32px",
            color: "#ffffff",
        }).setOrigin(0.5);

        this.roomButtons = [];

        // DEV MODE
        // const devButton = this.add.text(50, 50, 'DEV MODE', { fontSize: '32px', fill: '#0f0' })
        //     .setInteractive()
        //     .on('pointerdown', () => {
        //         console.log("DEV BUTTON -> starting MapScene");
        //         this.scene.start("map");
        //     });
    }

    // -------------------------
    // Start Game
    // -------------------------
    startGame(isHost) {
        console.log(isHost ? "HOSTING GAME..." : "JOINING GAME...");
        console.log(isHost);
        if (window.photon) {
            window.photon.disconnect();
            window.photon = null;
        }

        const photon = new PhotonClient(this);
        window.photon = photon;
        const sceneRef = this;
        let movedToMap = false;

        // Callbacks
        photon.onError = (code, msg) => console.error("Photon ERROR:", code, msg);
        console.log(isHost);
        photon.onStateChange = (state) => {
            console.log("State " + state);
            if (state == 5) {
                console.log("Joined Lobby");
                console.log(isHost);
                if (isHost) {
                    console.log("hi");
                    const roomName = "Room_" + Math.floor(Math.random() * 9999);
                    console.log("Creating room:", roomName);
                    photon.createRoom(roomName, { maxPlayers: 4 });

                } else {
                    // Joiner mode: show room list
                    this.roomListTitle.setText("Available Rooms:");

                    // Periodically refresh room list (every 2 seconds)
                    this.roomListInterval = setInterval(() => {
                        if (window.photon && window.photon.isConnected()) {
                            // Some SDKs automatically update room list, others may need a refresh call
                            if (window.photon.getRoomList) {
                                window.photon.getRoomList();
                            }
                        }
                    }, 2000);
                }
            }
        };

        photon.OnJoinRoomFailed = () => {
            console.log("Failed to join room");
        }

        photon.onRoomListUpdate = (rooms) => {
            console.log("Room List Updated:", rooms);
            if (!isHost) this.updateRoomList(rooms);
        };

        photon.onRoomJoinedCallback = () => {
            console.log("Room joined! Loading map.js...");
            if (!movedToMap) {
                movedToMap = true;
                sceneRef.scene.start("map", { photon });
            }
        };

        // Connect to Photon
        photon.connectWrap("us");
    }

    // -------------------------
    // Room List UI
    // -------------------------
    updateRoomList(rooms) {
        const { width } = this.scale;
        this.roomButtons.forEach(b => b.destroy());
        this.roomButtons = [];

        let y = this.roomListTitle.y + 40;

        if (!rooms || rooms.length === 0) {
            const none = this.add.text(width / 2, y, "No rooms available...", {
                fontSize: "28px",
                color: "#aaaaaa"
            }).setOrigin(0.5);
            this.roomButtons.push(none);
            return;
        }

        rooms.forEach(room => {
            const btn = this.add.text(width / 2, y, room.name, {
                fontSize: "36px",
                color: "#ffffff",
                backgroundColor: "#222222",
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on("pointerdown", () => this.joinSelectedRoom(room.name));
            this.roomButtons.push(btn);
            y += 50;
        });
    }

    joinSelectedRoom(roomName) {
        console.log("JOINING ROOM:", roomName);
        window.photon.joinRoom(roomName);
    }
}
