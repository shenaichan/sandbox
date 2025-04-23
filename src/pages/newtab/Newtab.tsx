import { useState, useEffect } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Newtab() {
  // I guess it's kind of a string but not really
  const [currScreenShot, setCurrScreenShot] = useState<string[]>([]);

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
          setCurrScreenShot((scs) => [...scs, newValue]);
        }
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return (
    <div>
      {currScreenShot.map((img, idx) => (
        <img src={img} key={idx}></img>
      ))}
    </div>
  );
}
