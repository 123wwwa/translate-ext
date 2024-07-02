import type { PlasmoCSConfig } from "plasmo";
import React from "react";
import TranslatePopup from "./TranslatePopup";
import { createRoot } from "react-dom/client";
import { gptTranslate } from "~features/chatgpt";
import root from "react-shadow";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
};

let lastElement = null;
let tooltipElement = null;
let itemRoot = null;
const translatedElements = new Set();
const translatedTexts = new Map();

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
    const selectionText = element.innerText;
    let translatedText = {};
    // Click 이벤트 추가
    element.addEventListener("click", showTooltip);
    translatedTexts.set(element, translatedText);
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
    translatedText = await gptTranslate(selectionText);
    translatedTexts.set(element, translatedText);
    element.addEventListener("click", showTooltip);
  }

  document.addEventListener("mousemove", highlightElement);
  document.addEventListener("click", selectElement, true);
  document.addEventListener("click", preventDefaultActions, true);
}

function showTooltip(event) {
  event.stopPropagation(); // 이벤트 버블링 중지
  const element = event.target;
  const translatedText = translatedTexts.get(element);
  const fontSize = Math.max(parseFloat(window.getComputedStyle(element).fontSize),14);
  const tailwindCssUrl = window.chrome.runtime.getURL('assets/dict/tailwind.css');
  // 요소의 위치와 크기를 가져와서 툴팁에 적용
  const rect = element.getBoundingClientRect();
  if (!tooltipElement) {
    tooltipElement = document.createElement("div");
    tooltipElement.style.position = "absolute";
    tooltipElement.style.zIndex = 9999;
    document.body.appendChild(tooltipElement);
    itemRoot = createRoot(tooltipElement);
    itemRoot.render(
      <React.StrictMode>
        <root.div>
        <style>
            {`
              @import url(${tailwindCssUrl});
              :host {
                all: initial;
                display: block;
                font-size: ${fontSize}px;
                font-family: Arial, sans-serif;
                color: black;
              }
            `}
          </style>
          <TranslatePopup translations={translatedText} onClose={hideTooltip} fontSize={fontSize} />
        </root.div>
      </React.StrictMode>
    );
  } else {
    updateTooltipContent(translatedText, fontSize, tailwindCssUrl);
  }

  tooltipElement.style.top = `${rect.bottom + window.scrollY}px`;
  tooltipElement.style.left = `${rect.left + window.scrollX}px`;
  tooltipElement.style.width = `${rect.width}px`;
  tooltipElement.style.fontSize = `${fontSize}px`;
  tooltipElement.style.display = "block";

  element._tooltip = tooltipElement;
  element.style.outline = "2px solid blue"; // Hover 시 테두리 색상 변경
  element.style.backgroundColor = "rgba(0, 0, 255, 0.1)"; // Hover 시 배경색 변경

  // 툴팁 외부 클릭 감지
  document.addEventListener("click", handleDocumentClick);
}

function handleDocumentClick(event) {
  if (tooltipElement && !tooltipElement.contains(event.target)) {
    hideTooltip();
  }
}

function hideTooltip() {
  if (tooltipElement) {
    tooltipElement.style.display = "none";
    if (lastElement && !translatedElements.has(lastElement)) {
      lastElement.style.outline = ""; // 테두리 원래대로
      lastElement.style.backgroundColor = ""; // 배경색 원래대로
    }
    window.removeEventListener("scroll", updateTooltipPosition);
    document.removeEventListener("click", handleDocumentClick);
  }
}

function updateTooltipContent(translations, fontSize, tailwindCssUrl) {
  itemRoot.render(
    <root.div>
      <style>
        {`
          @import url(${tailwindCssUrl});
          :host {
            all: initial;
            display: block;
            font-size: ${fontSize}px;
            font-family: Arial, sans-serif;
            color: black;
          }
        `}
      </style>
      <TranslatePopup translations={translations} onClose={hideTooltip} fontSize={fontSize} />
    </root.div>
  );
}

function updateTooltipPosition() {
  if (tooltipElement && lastElement) {
    const rect = lastElement.getBoundingClientRect();
    tooltipElement.style.top = `${rect.bottom + window.scrollY}px`;
    tooltipElement.style.left = `${rect.left + window.scrollX}px`;
    tooltipElement.style.width = `${rect.width}px`;
    tooltipElement.style.display = "block";
  }
}
