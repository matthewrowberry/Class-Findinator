import PhotonClient from "../network/PhotonClient.js";

export class MainScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScreen' });
  }

  create() {
    const { width, height } = this.scale;

    const title = this.add.text(width / 2, 200, "CAPTURE THE FLAGINATOR", {
      fontFamily: "Press Start 2P",
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
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    hostButton.on('pointerdown', () => {
      console.log("Hosting game...");
      this.startGame(true);
    });

    // JOIN BUTTON
    const joinButton = this.add.text(width / 2, height / 2 + 80, "JOIN GAME", {
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    joinButton.on("pointerdown", () => {
      console.log("Joining game...");
      this.startGame(false); // Fixed typo
    });
  }

  startGame(isHost) {
    // Initialize PhotonClient
    const photon = new PhotonClient(this);

    // Assign handlers BEFORE connecting
    photon.onJoinLobby = () => {
        console.log(isHost ? "HOST: Creating room..." : "JOIN: Joining random room...");
        if (isHost) {
            photon.createRoom()
                .catch(err => console.error("Create room failed:", err));
        } else {
            photon.joinRandomRoom()
                .catch(err => {
                console.error("No room found, auto-creating for testing:", err);
                photon.createRoom();  // Fallback for solo JOIN
            });
        }
    };

    photon.onJoinRoom = () => {  // No param needed
        console.log("Joined room, starting map...");
        this.scene.start('map', { photon });
    };

    photon.connect();
  }
}
