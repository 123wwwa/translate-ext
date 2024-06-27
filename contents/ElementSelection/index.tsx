import type { PlasmoCSConfig } from "plasmo";
import React from "react";
import TranslatePopup from "./TranslatePopup";
import { createRoot } from "react-dom/client";
import { gptTranslate } from "~features/chatgpt";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

let lastElement = null;
let tooltipElement = null;
let itemRoot = null;
let tooltipTimeout = null;
const translatedElements = new Set();

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

  function selectElement(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target;

    if (translatedElements.has(element)) {
      console.log("Element already translated:", element);
      return;
    }

    console.log("Element selected:", element);
    const selectionText = element.innerText;

    translateText(selectionText, (translatedText) => {
      element.dataset.translatedText = translatedText;
      console.log("Translated Text:", translatedText);

      // Hover 이벤트 추가
      element.addEventListener("mouseenter", showTooltip);
      element.addEventListener("mouseleave", handleElementMouseLeave);

      translatedElements.add(element);
      element.style.outline = "2px dashed green"; // 번역된 요소를 초록색 점선 테두리로 표시
    });

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
  }

  document.addEventListener("mousemove", highlightElement);
  document.addEventListener("click", selectElement, true);
  document.addEventListener("click", preventDefaultActions, true);
}

function showTooltip(event) {
  const element = event.target;
  const translatedText = element.dataset.translatedText;

  // 요소의 위치와 크기를 가져와서 툴팁에 적용
  const rect = element.getBoundingClientRect();
  if (!tooltipElement) {
    tooltipElement = document.createElement("div");
    tooltipElement.style.position = "absolute";
    tooltipElement.style.zIndex = 9999;
    tooltipElement.addEventListener("mouseenter", cancelHideTooltip);
    tooltipElement.addEventListener("mouseleave", handleTooltipMouseLeave);
    document.body.appendChild(tooltipElement);
    itemRoot = createRoot(tooltipElement);
    itemRoot.render(
      <React.StrictMode>
        <TranslatePopup text={translatedText} />
      </React.StrictMode>
    );
  } else {
    updateTooltipContent(translatedText);
  }

  tooltipElement.style.top = `${rect.bottom + window.scrollY}px`;
  tooltipElement.style.left = `${rect.left + window.scrollX}px`;
  tooltipElement.style.width = `${rect.width}px`;
  tooltipElement.style.display = "block";

  element._tooltip = tooltipElement;
  element.style.outline = "2px solid blue"; // Hover 시 테두리 색상 변경
  element.style.backgroundColor = "rgba(0, 0, 255, 0.1)"; // Hover 시 배경색 변경
}

function hideTooltip() {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }

  if (tooltipElement) {
    tooltipElement.style.display = "none";
    if (lastElement && !translatedElements.has(lastElement)) {
      lastElement.style.outline = ""; // 테두리 원래대로
      lastElement.style.backgroundColor = ""; // 배경색 원래대로
    }
    window.removeEventListener("scroll", updateTooltipPosition);
  }
}

function cancelHideTooltip() {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }
}

function handleTooltipMouseLeave(event) {
  const element = event.target;
  if (!lastElement.matches(':hover') && !tooltipElement.matches(':hover')) {
    hideTooltip();
    if (!translatedElements.has(lastElement)) {
      lastElement.style.outline = ""; // Hover 종료 시 테두리 제거
      lastElement.style.backgroundColor = ""; // Hover 종료 시 배경색 제거
    } else {
      lastElement.style.outline = "2px dashed green"; // 이미 번역된 요소는 초록색 점선 유지
      lastElement.style.backgroundColor = ""; // 이미 번역된 요소는 배경색 제거
    }
  }
}

function handleElementMouseLeave(event) {
  const element = event.target;
  if (!tooltipElement.matches(':hover')) {
    hideTooltip();
    if (!translatedElements.has(element)) {
      element.style.outline = ""; // Hover 종료 시 테두리 제거
      element.style.backgroundColor = ""; // Hover 종료 시 배경색 제거
    } else {
      element.style.outline = "2px dashed green"; // 이미 번역된 요소는 초록색 점선 유지
      element.style.backgroundColor = ""; // 이미 번역된 요소는 배경색 제거
    }
  }
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

function updateTooltipContent(text) {
  itemRoot.render(
    <React.StrictMode>
      <TranslatePopup text={text} />
    </React.StrictMode>
  );
}

async function translateText(text, callback) {
  const translatedText = await gptTranslate(text);
  console.log("Translated Text:", translatedText);
  callback(translatedText);
}
