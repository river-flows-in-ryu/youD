import React from "react";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function LoadingButton() {
  return (
    <button className="w-full h-ull bg-secondary">
      <Spin indicator={<LoadingOutlined spin className="text-primary" />} />
    </button>
  );
}
