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
    console.log(isHost ? "Hosting game..." : "Joining game...");

    const sceneRef = this; // save scene reference
    const photon = new PhotonClient(this);

    // --- LOBBY CALLBACK ---
    // Photon SDK triggers onJoinLobby; set it here so we can create/join rooms after lobby join
    photon.onJoinLobby = () => {
      console.log(isHost ? "HOST: Creating room..." : "JOIN: Joining random room...");
      if (isHost) {
        photon.createRoom().catch(err => {
          console.error("Create room failed:", err);
          // fallback for testing
          sceneRef.scene.start('map', { photon });
        });
      } else {
        photon.joinRandomRoom().catch(err => {
          console.warn("No room found, auto-creating for testing:", err);
          // attempt create as a fallback for local dev/test
          photon.createRoom();
        });
      }
    };

    // --- ROOM JOINED CALLBACK ---
    // Use the dedicated callback property on the PhotonClient to avoid overwriting internal SDK methods
    photon.onRoomJoinedCallback = (createdByMe) => {
      console.log("Room joined (callback). createdByMe=", createdByMe);
      sceneRef.scene.start('map', { photon });
    };

    // --- SAFETY FALLBACK ---
    setTimeout(() => {
      if (!photon.roomJoined) {
        console.warn("Photon fallback: going to map scene (no roomJoined after timeout)...");
        sceneRef.scene.start('map', { photon });
      }
    }, 3000);

    // Start connecting after callbacks are set
    photon.connect();
  }
}