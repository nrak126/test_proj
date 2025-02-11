import { useState } from "react";
import Quagga from "quagga";
import "./custom.css";

export default function ReadBarcode() {
  const [bookInfo, setBookInfo] = useState(null);
  const [isbn, setIsbn] = useState(null);

  const start = () => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#my_quagga"),
        },
        decoder: {
          readers: ["ean_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onProcessed((result) => {
      if (result == null) return;
      if (typeof result !== "object") return;
      if (result.boxes === undefined) return;
      const ctx = Quagga.canvas.ctx.overlay;
      const canvas = Quagga.canvas.dom.overlay;
      ctx.clearRect(0, 0, parseInt(canvas.width), parseInt(canvas.height));
      Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, {
        color: "blue",
        lineWidth: 5,
      });
      // result.boxes.forEach((box) => {
      //   Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, {
      //     color: "blue",
      //     lineWidth: 5,
      //   });
      // });
      console.log("Processed result:", result);
    });

    Quagga.onDetected(async (data) => {
      if (data.codeResult.code) setIsbn(data.codeResult.code);
      console.log("Detected ISBN:", isbn);
    });
  };

  const stop = async () => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    const result = await response.json();
    if (result.items && result.items.length > 0) {
      setBookInfo(result.items[0].volumeInfo);
    }
    Quagga.stop();
    console.log("Stop!!");
  };

  return (
    <>
      <div id="my_container">
        <div id="my_inner">
          <div>= QuaggaJS =</div>
          <div>
            <button id="my_start" onClick={() => start()}>
              Start
            </button>
            <button id="my_stop" onClick={() => stop()}>
              Stop
            </button>
          </div>
          <div id="my_quagga"></div>
          <div id="my_result">***</div>
          <div id="my_barcode">
            <div>***</div>
          </div>
        </div>
        <div id="book_info">
          {bookInfo ? (
            <div>
              <h3>{bookInfo.title}</h3>
              <p>{bookInfo.authors.join(", ")}</p>
              <p>{bookInfo.description}</p>
            </div>
          ) : (
            "***"
          )}
        </div>
      </div>
    </>
  );
}
