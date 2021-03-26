import React from "react";
import { Modal } from "antd";


export default function AddChatModal(isVisible, close) {
    return (
      <Modal
        centered
        footer={null}
        visible={isVisible}
      >
      </Modal>
    )
}
