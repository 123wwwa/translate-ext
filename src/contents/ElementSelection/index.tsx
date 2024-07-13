import type { PlasmoCSConfig } from "plasmo";
import React from "react";
import TranslatePopup from "./TranslatePopup";
import { createRoot } from "react-dom/client";
import root from "react-shadow";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
};

let lastElement = null;
const translatedElements = new Set();
const tooltipMap = new Map();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activateElementSelectionMode") {
    activateElementSelectionMode();
  }
});

function activateElementSelectionMode() {
  document.body.style.cursor = "pointer";

  function highlightElement(event) {
    const element = event.target;

    if (translatedElements.has(element)) {
      element.style.outline = "2px dashed green";
    } else {
      element.style.outline = "2px solid red";
    }

    if (lastElement && lastElement !== element) {
      if (translatedElements.has(lastElement)) {
        lastElement.style.outline = "2px dashed green";
      } else {
        lastElement.style.outline = "";
        lastElement.style.backgroundColor = "";
      }
    }

    lastElement = element;
  }

  function preventDefaultActions(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  async function selectElement(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target;

    if (translatedElements.has(element)) {
      console.log("Element already translated:", element);
      return;
    }

    translatedElements.add(element);
    element.style.outline = "2px dashed green"; // 번역된 요소를 초록색 점선 테두리로 표시

    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", highlightElement);
    document.removeEventListener("click", selectElement, true);

    if (lastElement) {
      if (translatedElements.has(lastElement)) {
        lastElement.style.outline = "2px dashed green";
      } else {
        lastElement.style.outline = "";
        lastElement.style.backgroundColor = "";
      }
    }
    document.removeEventListener("click", preventDefaultActions, true);
    element.addEventListener("click", (e) => showTooltip(e, element));
  }

  document.addEventListener("mousemove", highlightElement);
  document.addEventListener("click", selectElement, true);
  document.addEventListener("click", preventDefaultActions, true);
}

function showTooltip(event, element) {
  event.stopPropagation(); // 이벤트 버블링 방지

  const rect = element.getBoundingClientRect();
  let tooltipElement = tooltipMap.get(element);

  if (!tooltipElement) {
    tooltipElement = document.createElement("div");
    tooltipElement.style.position = "absolute";
    tooltipElement.style.zIndex = 9999;
    document.body.appendChild(tooltipElement);
    const itemRoot = createRoot(tooltipElement);
    itemRoot.render(
      <React.StrictMode>
        <root.div>
          <style>
            {`
              @import url(${window.chrome.runtime.getURL('src/assets/dict/tailwind.css')});
              :host {
                all: initial;
                display: block;
                font-size: 16px;
                font-family: Arial, sans-serif;
                color: black;
              }
            `}
          </style>
          <TranslatePopup
            selectionElement={element}
            onClose={() => hideTooltip(element)}
          />
        </root.div>
      </React.StrictMode>
    );

    tooltipMap.set(element, tooltipElement);
  }

  tooltipElement.style.top = `${rect.bottom + window.scrollY}px`;
  tooltipElement.style.left = `${rect.left + window.scrollX}px`;
  tooltipElement.style.width = `${rect.width}px`;
  tooltipElement.style.fontSize = "16px";
  tooltipElement.style.display = "block";

  element._tooltip = tooltipElement;
  element.style.outline = "2px solid blue"; // Hover 시 테두리 색상 변경
  element.style.backgroundColor = "rgba(0, 0, 255, 0.1)"; // Hover 시 배경색 변경

  // 툴팁 외부 클릭 감지
  document.addEventListener("click", handleDocumentClick);
}

function handleDocumentClick(event) {
  tooltipMap.forEach((tooltipElement, element) => {
    if (tooltipElement && !tooltipElement.contains(event.target)) {
      hideTooltip(element);
    }
  });
}

function hideTooltip(element) {
  const tooltipElement = tooltipMap.get(element);
  if (tooltipElement) {
    tooltipElement.style.display = "none";
    element.style.outline = "2px dashed green"; // 테두리 원래대로
    element.style.backgroundColor = ""; // 배경색 원래대로
    window.removeEventListener("scroll", updateTooltipPosition);
    document.removeEventListener("click", handleDocumentClick);
  }
}

function updateTooltipPosition() {
  tooltipMap.forEach((tooltipElement, element) => {
    if (tooltipElement && element) {
      const rect = element.getBoundingClientRect();
      tooltipElement.style.top = `${rect.bottom + window.scrollY}px`;
      tooltipElement.style.left = `${rect.left + window.scrollX}px`;
      tooltipElement.style.width = `${rect.width}px`;
      tooltipElement.style.display = "block";
    }
  });
}
