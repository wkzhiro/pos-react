import React, { useEffect } from "react";
import Quagga from "quagga";
import "./styles.css"; // 新しいCSSファイルをインポート

const Scanner = props => {
    const { onDetected } = props;

    useEffect(() => {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            constraints: {
            facingMode: "environment", // カメラの向き (背面カメラを使用)
            aspectRatio: 4/3, // アスペクト比 (4:3)
            target: document.querySelector("#viewport"),
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
            readers: ["ean_reader"]
        },
        locate: true
        }, 
        function(err){
        if (err) {
        console.log(err, "error msg");
        }
        Quagga.start();
        return () => {
            Quagga.stop()
        }
    });

    Quagga.onProcessed(result => {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;       
        
        if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(
            0,
            0,
            Number(drawingCanvas.getAttribute("width")),
            Number(drawingCanvas.getAttribute("height"))
            );
            result.boxes
            .filter(function(box) {
                return box !== result.box;
            })
            .forEach(function(box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2
                });
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2
            });
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
            );
        }
        }
    });

    Quagga.onDetected(detected);
    }, );

    let scanSucceeded = false;
    const detected = result => {
        if (!scanSucceeded) {
            scanSucceeded = true;
        onDetected(result.codeResult.code);
    };
    };

    return (
        <div id="interactive" className="viewport">
        </div>
    );
};

export default Scanner;