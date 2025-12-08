import PhotonClient from "../network/PhotonClient.js"
export class MainScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScreen' });
  }

  create() {
    // Get center of screen
    const { width, height } = this.scale;

    const title = this.add.text(this.scale.width / 2, 200, "CAPTURE THE FLAGINATOR", {
      fontSize: "64px",
      color: "#ffffff",
      strokeThickness: 6,
      padding: { x: 20, y: 10}
    })

    title.setOrigin(0.5, 0.5)

    // Create a text button
    const hostButton = this.add.text(width / 2, height / 2, "HOST GAME", {
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    // What happens when clicked:
    hostButton.on('pointerdown', () => {
      console.log("Hosting game...")
      this.startGame(true);
    });

    const joinButton = this.add.text(width / 2, height / 2 + 50, "JOIN GAME", {
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    joinButton.on("pointerdown", () => {
      console.log("Joining Game...");
      this.startGame(false);
    })
  }

  startGame(isHost) {
    // Here we initialize PhotonClient or local server
    // and pass the instance to the Map scene
    const photon = new PhotonClient();

    photon.connect();

    // Once in the lobby, create or join a room
    photon.onJoinLobby = () => {
      if (isHost) {
        photon.createRoom(); // Creates a new room for LAN
      } else {
        photon.joinRandomRoom(); // Joins an existing room
      }
    };

    // When room is ready, start the Map scene
    photon.onJoinRoom = () => {
      this.scene.start('map', { photon });
    };
  }
}
