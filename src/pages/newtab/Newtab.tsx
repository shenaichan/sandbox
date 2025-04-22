import { useState, useEffect } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Newtab() {
  const [currScreenShot, setCurrScreenShot] = useState("");
  useEffect(() => {
    const listener: Parameters<
      typeof chrome.storage.onChanged.addListener
    >[0] = (changes, namespace) => {
      if (chrome) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
          console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
          );
          if (key === "screenshot" && namespace === "local") {
            setCurrScreenShot(newValue);
          }
        }
        chrome.storage.onChanged.addListener(listener);
        return () => chrome.storage.onChanged.removeListener(listener);
      } else {
        console.log("chrome not loaded");
      }
    };
  }, [chrome]);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <img src={currScreenShot} />;{/* <Tldraw /> */}
    </div>
  );
}
