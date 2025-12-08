import PhotonClient from "../network/PhotonClient.js";

export class MainScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScreen' });
  }

  create() {
    const { width, height } = this.scale;

    // TITLE SCREEN
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
    // --- Initialize Photon ---
    const photon = new PhotonClient(this);

    // --- Handler: once joined lobby, create or join room ---
    photon.onJoinLobby = () => {
      console.log(isHost ? "HOST: Creating room..." : "JOIN: Joining random room...");
      if (isHost) {
        photon.createRoom().catch(err => console.error("Create room failed:", err));
      } else {
        photon.joinRandomRoom().catch(err => {
          console.warn("No room found, attempting to create one instead...", err);
          photon.createRoom(); // now triggers onJoinRoom
        });
      }
    };

    // --- Handler: only start map AFTER joining room ---
    photon.onJoinRoom = () => {
      console.log("Joined room successfully! Starting map...");
      this.scene.start('map', { photon }); // <-- pass Photon client to Map scene
    };

    // Optional: log errors
    photon.onError = (code, msg) => console.error("Photon error:", code, msg);

    // --- Connect to Photon ---
    console.log("Connecting to Photon...");
    photon.connect();
  }
}