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

        // ROOM LIST (shown only when joining)
        this.roomListTitle = this.add.text(width / 2, height / 2 + 150, "", {
            fontSize: "32px",
            color: "#ffffff",
        }).setOrigin(0.5);

        this.roomButtons = [];

        const devButton = this.add.text(50, 50, 'DEV MODE', { fontSize: '32px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                console.log("DEV BUTTON -> starting MapScene");
                this.scene.start("map");
            });
    }

    // Start Game (Host or Join)
    startGame(isHost) {
        console.log(isHost ? "HOSTING GAME..." : "JOINING GAME...");

        // Destroy previous Photon instance
        if (window.photon) {
            window.photon.disconnect();
            window.photon = null;
        }

        const photon = new PhotonClient(this);
        window.photon = photon;

        let movedToMap = false;
        const sceneRef = this;

        // ----------------------
        //     PHOTON CALLBACKS
        // ----------------------

        photon.onError = (code, msg) => console.error("Photon ERROR:", code, msg);

        photon.onStateChange = (state) => {
            console.log("PHOTON STATE:", state);
        };

        // LOBBY JOINED
        photon.onJoinLobby = () => {
            console.log("Joined Photon Lobby");

            if (isHost) {
                // Create new room
                const roomName = "Room_" + Math.floor(Math.random() * 9999);
                photon.createRoom(roomName);
            } else {
                // JOIN MODE: show room list on screen
                this.roomListTitle.setText("Available Rooms:");
            }
        };

        // ROOM LIST UPDATE
        photon.onRoomListUpdate = (rooms) => {
            console.log("Room List Updated:", rooms);
            if (!isHost) this.updateRoomList(rooms);
        };

        // ROOM JOINED
        photon.onRoomJoinedCallback = () => {
            console.log("Successfully joined room!");

            if (!movedToMap) {
                movedToMap = true;
                sceneRef.scene.start("map", { photon });
            }
        };

        // ----------------------
        //     CONNECT TO PHOTON
        // ----------------------
        photon.connectWrap("us");
    }

    // -----------------------------------------
    // ROOM LIST UI (Join Mode)
    // -----------------------------------------

    updateRoomList(rooms) {
        const { width } = this.scale;

        // Clear old room buttons
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

        // Create a button for each room
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
