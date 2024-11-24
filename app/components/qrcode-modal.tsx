"use client";
import { Check, Copy, Download, QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Modal from "./ui/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const DEFAULT_COLORS = [
  // Modern Dark Shades
  "#1F2937", // Slate gray
  "#312E81", // Deep indigo
  "#064E3B", // Deep emerald
  "#831843", // Deep pink
  "#7C2D12", // Deep orange

  // Vibrant But Soft
  "#3B82F6", // Sky blue
  "#8B5CF6", // Purple
  "#10B981", // Emerald
  "#F43F5E", // Rose
  "#F59E0B", // Amber
];

export default function QrCodeModal({ value }: { value: string }) {
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(128);

  const handleDownload = () => {
    const svg = document.querySelector("#qr-code svg") as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-${value}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Modal
      title="QR Code Preview"
      description="Customize your QR code to fit your brand"
      trigger={
        <Button size="icon" variant="ghost">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <QrCodeIcon className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>QR Code</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* QR Code Preview */}
        <div
          className="p-4 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div id="qr-code">
            <QRCodeSVG
              value={value}
              size={size}
              fgColor={qrColor}
              bgColor={bgColor}
              level="Q"
            />
          </div>
        </div>

        {/* Size Control */}
        {/* <div className="space-y-2">
          <Label>Size</Label>
          <Input
            type="range"
            min="128"
            max="512"
            step="32"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-right">{size}px</div>
        </div> */}

        {/* Color Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>QR Code Color</Label>
            <div className="grid grid-cols-5 gap-2">
              <Input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="!h-10"
              />
              {DEFAULT_COLORS.slice(0, 4).map((color) => (
                <button
                  key={color}
                  className="w-full h-10 rounded-md border transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: color }}
                  onClick={() => setQrColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="grid grid-cols-5 gap-2">
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="!h-10"
              />
              <button
                className="w-full h-10 rounded-md border transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "#FFFFFF" }}
                onClick={() => setBgColor("#FFFFFF")}
              />
              <button
                className="w-full h-10 rounded-md border transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "#F3F4F6" }}
                onClick={() => setBgColor("#F3F4F6")}
              />
              <button
                className="w-full h-10 rounded-md border transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "#E5E7EB" }}
                onClick={() => setBgColor("#E5E7EB")}
              />
              <button
                className="w-full h-10 rounded-md border transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "#D1D5DB" }}
                onClick={() => setBgColor("#D1D5DB")}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
