import { useState, useEffect } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Newtab() {
  const [currScreenShot, setCurrScreenShot] = useState("");

  console.log("huh???");
  useEffect(() => {
    console.log("attempting to set storage listener");
    const listener: Parameters<
      typeof chrome.storage.onChanged.addListener
    >[0] = (changes, namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
        if (key === "latestScreenshot" && namespace === "local") {
          setCurrScreenShot(newValue);
        }
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <img src={currScreenShot} />;{/* <Tldraw /> */}
    </div>
  );
}
