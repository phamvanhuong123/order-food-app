import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

function QRCodeTable({
  token,
  tableNumber,
  width = 200,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
 
    canvasContext.font = "14px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "#000";
    canvasContext.fillText(`Bàn số ${tableNumber}`, width / 2, width + 20);
    canvasContext.fillText("Quét mã QR để gọi món", width / 2, width + 50);

    const qrCanvas = document.createElement("canvas");

    QRCode.toCanvas(
      qrCanvas,
      getTableLink({ token, tableNumber }),
      { width },
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(qrCanvas, 0, 0, width, width);
        console.log("success!");
      },
    );
  }, [tableNumber, token, width]);
  return <canvas ref={canvasRef}></canvas>;
}

export default QRCodeTable;
