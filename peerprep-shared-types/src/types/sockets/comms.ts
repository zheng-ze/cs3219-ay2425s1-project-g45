import exp from "constants";
import { PeerprepRequest, PeerprepResponse } from ".";
import { ChatMessage } from "../chat";

export enum CommsClientEvents {
  SEND_MESSAGE = "SEND_MESSAGE",
  GET_CHAT_STATE = "GET_CHAT_STATE",
  INITIATE_CALL = "initiate_call",
  ACCEPT_CALL = "accept_call",
  END_CALL = "end_call",
}

export enum CommsServerEvents {
  NEW_CHAT = "NEW_CHAT",
  CHAT_STATE = "CHAT_STATE",
  CALL_REQUESTED = "CALL_REQUESTED",
  CALL_ACCEPTED = "CALL_ACCEPTED",
  CALL_ENDED = "CALL_ENDED",
}

export interface SendMessageRequest extends PeerprepRequest {
  roomId: string;
  message: string;
}

export interface GetChatStateRequest extends PeerprepRequest {
  roomId: string;
}

export interface InitiateCallRequest extends PeerprepRequest {
  roomId: string;
  signalData: any;
}

export interface AcceptCallRequest extends PeerprepRequest {
  roomId: string;
  signalData: any;
}

export interface EndCallRequest extends PeerprepRequest {
  roomId: string;
}

export interface NewChatResponse extends PeerprepResponse {
  roomId: string;
  message: ChatMessage;
}

export interface ChatStateResponse extends PeerprepResponse {
  roomId: string;
  messages: ChatMessage[];
}

export interface CallRequestedResponse extends PeerprepResponse {
  roomId: string;
  from: string;
  signalData: any;
}

export interface CallAcceptedResponse extends PeerprepResponse {
  roomId: string;
  from: string;
  signalData: any;
}

export interface CallEndedResponse extends PeerprepResponse {
  roomId: string;
  from: string;
}

export interface CommsClientToServerEvents {
  [CommsClientEvents.SEND_MESSAGE]: (request: SendMessageRequest) => void;
  [CommsClientEvents.GET_CHAT_STATE]: (request: GetChatStateRequest) => void;
  [CommsClientEvents.INITIATE_CALL]: (request: InitiateCallRequest) => void;
  [CommsClientEvents.ACCEPT_CALL]: (request: AcceptCallRequest) => void;
  [CommsClientEvents.END_CALL]: (request: EndCallRequest) => void;
}

export interface CommsServerToClientEvents {
  [CommsServerEvents.NEW_CHAT]: (response: NewChatResponse) => void;
  [CommsServerEvents.CHAT_STATE]: (response: ChatStateResponse) => void;
  [CommsServerEvents.CALL_REQUESTED]: (response: CallRequestedResponse) => void;
  [CommsServerEvents.CALL_ACCEPTED]: (response: CallAcceptedResponse) => void;
  [CommsServerEvents.CALL_ENDED]: (response: CallEndedResponse) => void;
}
