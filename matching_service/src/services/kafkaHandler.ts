import { Kafka, Producer } from "kafkajs";
import { EditorManager } from "./editor";
import { RoomModel } from "../models/Room";

export class KafkaHandler {
  private producer: Producer;
  private editorManager: EditorManager;

  constructor(kafka: Kafka) {
    this.producer = kafka.producer();
    this.editorManager = new EditorManager();
  }

  async initialize() {
    await this.producer.connect();
  }

  async handleCollaborationEvent(event: any) {
    const { type, roomId, username, content, socketId } = event;

    try {
      switch (type) {
        case "JOIN_ROOM":
          await this.handleJoinRoom(roomId, username, socketId);
          break;

        case "CODE_CHANGE":
          await this.handleCodeChange(roomId, username, content);
          break;

        case "LEAVE_ROOM":
          await this.handleLeaveRoom(roomId, username);
          break;
      }
    } catch (error) {
      console.error(`Error handling ${type} event:`, error);
      // Send error event back to gateway if needed
      await this.sendGatewayEvent({
        type: "ERROR",
        roomId,
        error: `Failed to handle ${type} event`,
        timestamp: Date.now(),
      });
    }
  }

  private async handleJoinRoom(
    roomId: string,
    username: string,
    socketId: string
  ) {
    // Get or initialize room state
    const editorState = this.editorManager.initializeRoom(roomId);

    // Add user to room
    this.editorManager.addUserToRoom(roomId, username);

    // Send editor state back to gateway
    await this.sendGatewayEvent({
      type: "ROOM_STATE",
      roomId,
      socketId,
      state: editorState,
      timestamp: Date.now(),
    });

    // Update room in database if needed
    await RoomModel.findByIdAndUpdate(roomId, {
      $addToSet: { activeUsers: username },
    });
  }

  private async handleCodeChange(
    roomId: string,
    username: string,
    content: string
  ) {
    // Update editor state
    const newState = this.editorManager.updateCode(roomId, username, content);

    if (newState) {
      // Send updated state to gateway
      await this.sendGatewayEvent({
        type: "CODE_CHANGED",
        roomId,
        username,
        state: newState,
        timestamp: Date.now(),
      });
    }
  }

  private async handleLeaveRoom(roomId: string, username: string) {
    // Remove user from room
    const newState = this.editorManager.removeUserFromRoom(roomId, username);

    if (newState) {
      // If room is empty, consider cleanup
      if (newState.activeUsers.length === 0) {
        this.editorManager.cleanupRoom(roomId);
      }

      // Send updated state to gateway
      await this.sendGatewayEvent({
        type: "USER_LEFT",
        roomId,
        username,
        state: newState,
        timestamp: Date.now(),
      });

      // Update room in database
      await RoomModel.findByIdAndUpdate(roomId, {
        $pull: { activeUsers: username },
      });
    }
  }

  private async sendGatewayEvent(event: any) {
    await this.producer.send({
      topic: "gateway-events",
      messages: [
        {
          key: event.roomId,
          value: JSON.stringify(event),
        },
      ],
    });
  }
}
