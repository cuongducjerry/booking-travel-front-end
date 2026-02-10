import { Badge, Dropdown, List, Tag } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getNotificationsAPI,
    getUnreadNotificationsAPI,
    readAllNotificationsAPI,
    readNotificationAPI,
} from "@/services/api";

import { useCurrentApp } from "../context/app.context";
import { getNotificationRoute, toRoleType } from "@/services/helper";
import { connectNotificationWS, disconnectNotificationWS } from "@/services/notification.ws";

const NotificationBell = () => {
    const [unread, setUnread] = useState<number>(0);
    const [list, setList] = useState<IResNotification[]>([]);
    const { user } = useCurrentApp();
    const navigate = useNavigate();

    // Load unread + notification list
    useEffect(() => {
        const fetchNotifications = async () => {
            const unreadRes = await getUnreadNotificationsAPI();
            const listRes = await getNotificationsAPI();

            if (unreadRes?.data) {
                setUnread(unreadRes.data);
            }

            if (listRes?.data) {
                setList(listRes.data);
            }
        };

        fetchNotifications();
    }, []);

    // WebSocket realtime
    useEffect(() => {
        if (!user) return;

        connectNotificationWS((noti : IResNotification) => {
            console.log("WS NOTI >>>", noti);
            setUnread(prev => prev + 1);
            setList(prev => [noti, ...prev]);
        });

        return () => {
            disconnectNotificationWS();
        };
    }, [user]);

    const menu = {
        items: [
            {
                key: "notifications",
                label: (
                    <List
                        style={{ width: 360, maxHeight: 400, overflowY: "auto" }}
                        dataSource={list}
                        locale={{ emptyText: "Không có thông báo" }}
                        header={
                            (
                                <div style={{ textAlign: "left" }}>
                                    <a
                                        onClick={async () => {
                                            await readAllNotificationsAPI();
                                            setUnread(0);
                                            setList(prev => prev.map(n => ({ ...n, read: true })));
                                        }}
                                    >
                                        Đánh dấu đã xem tất cả
                                    </a>
                                </div>
                            )
                        }
                        renderItem={(item) => (
                            <List.Item
                                onClick={async () => {
                                    if (!item.read) {
                                        await readNotificationAPI(item.id);
                                        setUnread(prev => Math.max(prev - 1, 0));
                                        setList(prev =>
                                            prev.map(n =>
                                                n.id === item.id ? { ...n, read: true } : n
                                            )
                                        );
                                    }

                                    const route = getNotificationRoute(user?.role, item?.type);
                                    if (route) navigate(route);
                                }}
                                style={{
                                    cursor: "pointer",
                                    background: item.read ? "#fff" : "#f6faff",
                                    transition: "0.2s",
                                }}
                            >
                                <List.Item.Meta
                                    title={
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <Tag color="blue">{item.type}</Tag>
                                            <span>{item.title}</span>

                                            {!item.read && (
                                                <span
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: "#1890ff",
                                                        marginLeft: "auto",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    }
                                    description={item.content}
                                />
                            </List.Item>
                        )}
                    />
                ),
            },
        ],
    };

    return (
        <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={menu}
        >
            <Badge count={unread} size="small">
                <BellOutlined
                    style={{
                        fontSize: 20,
                        cursor: "pointer",
                        marginRight: 16,
                    }}
                />
            </Badge>
        </Dropdown>
    );
};

export default NotificationBell;
