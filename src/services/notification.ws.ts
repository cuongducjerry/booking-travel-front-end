import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const connectNotificationWS = (onMessage: (data: any) => void) => {
    const token = localStorage.getItem("access_token");

    const socket = new SockJS(
        `http://localhost:8080/ws?token=${token}`
    );

    stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log("[WS]", str),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("[WS] CONNECTED");

            stompClient?.subscribe(
                "/user/queue/notifications",
                (message) => {
                    const data = JSON.parse(message.body);
                    console.log("WS NOTI >>>", data);
                    onMessage(data);
                }
            );
        },
    });

    stompClient.activate();
};

export const disconnectNotificationWS = () => {
    stompClient?.deactivate();
    stompClient = null;
};
