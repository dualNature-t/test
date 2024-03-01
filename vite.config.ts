import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 接口地址代理
      "/api": {
        target: "http://10.0.0.238:3000", // 接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
